import React from "react";
import {
    StyledTable,
    StyledTableHead,
    StyledTableCell,
    StyledTableRow,
    StyledTableBody
} from "./MeetingTable.styles.view";
import { MeetingTableContainer } from "../../Meeting.styles.view";
import { Checkbox } from "@material-ui/core";
import { TASK_MODE_ALL, TASK_MODE_SOME } from "../../TaskModes";

export const MeetingTable = p => {
    const { tasks, groups, groups_tasks } = p;

    return (
        <MeetingTableContainer>
            <StyledTable aria-label="Tasks" size="small">
                <StyledTableHead>
                    <StyledTableRow>
                        <StyledTableCell>Task</StyledTableCell>
                        {tasks.map(task => (
                            <StyledTableCell align="right" key={task.name}>
                                {task.display_name}
                                <Checkbox
                                    checked={task.mode == TASK_MODE_ALL} // Add checkall later!
                                    indeterminate={task.mode == TASK_MODE_SOME}
                                    onChange={() => {
                                        console.log("TASK", task);
                                    }}
                                />
                            </StyledTableCell>
                        ))}
                        <StyledTableCell align="center">Code</StyledTableCell>
                    </StyledTableRow>
                </StyledTableHead>
                <StyledTableBody>
                    {groups.map(group => (
                        <StyledTableRow key={group.name}>
                            <StyledTableCell component="th" scope="row">
                                {group.displayName}
                            </StyledTableCell>
                            {tasks.map(task => (
                                <StyledTableCell align="right" key={task.name}>
                                    <Checkbox
                                        checked={getChecked(
                                            group,
                                            task,
                                            groups_tasks
                                        )}
                                        onChange={() => {
                                            p.onGroupTaskClicked(task, group);
                                        }}
                                    />
                                </StyledTableCell>
                            ))}
                            <StyledTableCell align="right">
                                {group.code}
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </StyledTableBody>
            </StyledTable>
        </MeetingTableContainer>
    );
};

function getChecked(group, task, groups_tasks) {
    let checked = false;
    const groups = groups_tasks[task.name];
    if (groups) {
        groups.forEach(g => {
            if (g.name === group.name) {
                checked = true;
            }
        });
    }
    return checked;
}

export default MeetingTable;
