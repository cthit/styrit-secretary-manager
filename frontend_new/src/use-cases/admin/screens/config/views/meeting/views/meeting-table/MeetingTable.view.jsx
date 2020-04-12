import React from "react";
import {
    StyledTable,
    StyledTableBody,
    StyledTableCell,
    StyledTableHead,
    StyledTableRow
} from "./MeetingTable.styles.view";
import { MeetingTableContainer } from "../../Meeting.styles.view";
import { Checkbox } from "@material-ui/core";
import { TASK_MODE_ALL, TASK_MODE_SOME } from "../../TaskModes";

export const MeetingTable = props => {
    const {groups, tasks, tasksMode, groupTasks} = props;

    return (
        <MeetingTableContainer>
            <StyledTable aria-label="Tasks" size="small">
                <StyledTableHead>
                    <StyledTableRow>
                        <StyledTableCell>Task</StyledTableCell>
                        {Object.keys(tasks).map(task => (
                            <StyledTableCell align="right" key={task}>
                                {tasks[task]}
                                <Checkbox
                                    checked={tasksMode[task] === TASK_MODE_ALL}
                                    indeterminate={
                                        tasksMode[task] === TASK_MODE_SOME
                                    }
                                    onChange={() => {
                                        console.log("ALL TASK CLICKED FOR", task);
                                    }}
                                />
                            </StyledTableCell>
                        ))}
                        <StyledTableCell align="center">Code</StyledTableCell>
                    </StyledTableRow>
                </StyledTableHead>
                <StyledTableBody>
                    {Object.keys(groups).map(group => (
                        <StyledTableRow key={group}>
                            <StyledTableCell component="th" scope="row">
                                {groups[group]}
                            </StyledTableCell>
                            {Object.keys(tasks).map(task => (
                                <StyledTableCell align="right" key={task}>
                                    <Checkbox
                                        checked={getChecked(
                                            group,
                                            task,
                                            groupTasks
                                        )}
                                        onChange={() => {
                                            props.onGroupTaskClicked(
                                                task,
                                                group
                                            );
                                        }}
                                    />
                                </StyledTableCell>
                            ))}
                            <StyledTableCell align="right">
                                {groupTasks[group].code}
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </StyledTableBody>
            </StyledTable>
        </MeetingTableContainer>
    );
};

function getChecked(group, task, groupTasks) {
    return groupTasks[group].tasks.includes(task);
}

export default MeetingTable;
