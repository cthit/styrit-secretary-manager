use sqlx::Transaction;

use crate::{models::group::Group, util::secretary_error::SecretaryResult};

use super::DB;

pub async fn get_all_groups(transaction: &mut Transaction<'_, DB>) -> SecretaryResult<Vec<Group>> {
    Ok(sqlx::query_as!(
        Group,
        "
SELECT name, display_name
FROM public.group
        "
    )
    .fetch_all(transaction)
    .await?)
}
