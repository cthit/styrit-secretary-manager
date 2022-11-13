use std::collections::HashMap;

use chrono::{Datelike, NaiveDateTime, Utc};
use rocket::State;
use serde::Serialize;
use sqlx::{Pool, Transaction};
use uuid::Uuid;

use crate::{
    db::{
        config_repository, group_meeting_repository, group_meeting_task_repository,
        group_repository, group_year_repository, meeting_repository, new_transaction,
        task_repository, DB,
    },
    models::{
        config::Config, group::Group, group_task_code::GroupTaskCode, group_year::GroupYear,
        meeting::Meeting, meeting_story_group::MeetingStoryGroup, task::Task,
    },
    util::secretary_error::{SecretaryError, SecretaryResult},
};

#[derive(Clone, Debug, Serialize)]
pub struct MeetingData {
    id: Uuid,
    lp: i32,
    meeting_no: i32,
    date: NaiveDateTime,
    last_upload_date: NaiveDateTime,
    groups_tasks: HashMap<String, Vec<GroupTask>>,
}

impl MeetingData {
    fn from_meeting(meeting: &Meeting, groups_tasks: Vec<GroupTaskCode>) -> Self {
        let mut tasks = groups_tasks
            .clone()
            .into_iter()
            .map(|g| g.task)
            .collect::<Vec<String>>();
        tasks.sort();
        tasks.dedup();

        let gt_map = tasks
            .into_iter()
            .map(|t| {
                (
                    t.clone(),
                    groups_tasks
                        .clone()
                        .into_iter()
                        .filter(|gt| gt.task == t)
                        .map(|gt| GroupTask {
                            name: gt.group_name,
                            code: gt.code,
                        })
                        .collect::<Vec<GroupTask>>(),
                )
            })
            .collect::<HashMap<String, Vec<GroupTask>>>();

        MeetingData {
            id: meeting.id,
            lp: meeting.lp,
            meeting_no: meeting.meeting_no,
            date: meeting.date,
            last_upload_date: meeting.last_upload,
            groups_tasks: gt_map,
        }
    }
}

#[derive(Clone, Debug, Serialize)]
pub struct GroupTask {
    name: String,
    code: Uuid,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AdminConfig {
    pub meetings: Vec<MeetingData>,
    pub general: Vec<Config>,
    pub groups: Vec<Group>,
    pub tasks: Vec<Task>,
    pub years: Vec<i32>,
    pub group_years: Vec<GroupYear>,
    pub meeting_story_groups: HashMap<Uuid, Vec<MeetingStoryGroup>>,
}

pub async fn get_admin_config(db_pool: &State<Pool<DB>>) -> SecretaryResult<AdminConfig> {
    let mut transaction = new_transaction(db_pool).await?;

    let meetings = get_meetings(&mut transaction).await?;
    let general = config_repository::get_all_configs(&mut transaction).await?;
    let groups = group_repository::get_all_groups(&mut transaction).await?;
    let tasks = task_repository::get_all_tasks(&mut transaction).await?;
    let group_years = group_year_repository::get_group_years(&mut transaction).await?;
    let story_groups = get_meetings_story_groups(
        meetings.iter().map(|m| m.id.clone()).collect(),
        &mut transaction,
    )
    .await?;
    let years_back = get_story_years(&mut transaction).await?;

    transaction.commit().await?;
    Ok(AdminConfig {
        meetings,
        general,
        groups,
        tasks,
        years: years_back,
        group_years,
        meeting_story_groups: story_groups,
    })
}

async fn get_meetings(transaction: &mut Transaction<'_, DB>) -> SecretaryResult<Vec<MeetingData>> {
    let meetings = meeting_repository::get_all_meetings(transaction).await?;
    let mut meeting_datas = vec![];
    for meeting in meetings.iter() {
        let groups_tasks =
            group_meeting_task_repository::get_tasks_for_meeting(transaction, meeting.id).await?;
        meeting_datas.push(MeetingData::from_meeting(meeting, groups_tasks));
    }
    Ok(meeting_datas)
}

async fn get_meetings_story_groups(
    meeting_ids: Vec<Uuid>,
    transaction: &mut Transaction<'_, DB>,
) -> SecretaryResult<HashMap<Uuid, Vec<MeetingStoryGroup>>> {
    let mut map = HashMap::new();
    for id in meeting_ids.into_iter() {
        map.insert(
            id.clone(),
            group_meeting_repository::get_story_groups_for_meeting(transaction, id).await?,
        );
    }
    return Ok(map);
}

const YEARS_BACK_CONFIG_KEY: &str = "possible_years_back_for_stories";

async fn get_story_years(transaction: &mut Transaction<'_, DB>) -> SecretaryResult<Vec<i32>> {
    let years =
        config_repository::get_config_value(String::from(YEARS_BACK_CONFIG_KEY), transaction)
            .await?;
    let num_years: i32 = years.parse().or_else(|e| {
        Err(SecretaryError::InternalError(format!(
            "Failed to parse num years config to int, err: {e}"
        )))
    })?;
    let curr_year = Utc::now().year();
    let years = (0..num_years)
        .into_iter()
        .map(|offset| curr_year - offset)
        .collect::<Vec<i32>>();

    Ok(years)
}
