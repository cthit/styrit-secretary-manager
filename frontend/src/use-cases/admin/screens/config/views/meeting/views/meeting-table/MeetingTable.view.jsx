import React from "react";
import {
    StyledTable,
    StyledTableBody,
    StyledTableCell,
    StyledTableHead,
    StyledTableRow
} from "./MeetingTable.styles.view";
import {MeetingTableContainer} from "../../Meeting.styles.view";
import {TASK_MODE_ALL, TASK_MODE_SOME} from "../../TaskModes";
import MeetingActions from "../meeting-actions/MeetingActions.container.view";
import {DigitCheckbox} from "@cthit/react-digit-components";

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
                                <DigitCheckbox
                                    value={tasksMode[task] === TASK_MODE_ALL}
                                    indeterminate={
                                        tasksMode[task] === TASK_MODE_SOME
                                    }
                                    onChange={() => {
                                        props.onAllTaskClicked(task)
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
                                    <DigitCheckbox
                                        value={getChecked(
                                            group,
                                            task,
                                            groupTasks
                                        )}
                                        onChange={() => {
                                            props.onGroupTaskClicked(
                                                task,
                                                group
                                            );
                                        }}/>
                                </StyledTableCell>
                            ))}
                            <StyledTableCell align="right">
                                {groupTasks[group].code}
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </StyledTableBody>
            </StyledTable>
            <MeetingActions/>
        </MeetingTableContainer>
    );
};

function getChecked(group, task, groupTasks) {
    return groupTasks[group].tasks.includes(task);
}

export default MeetingTable;
