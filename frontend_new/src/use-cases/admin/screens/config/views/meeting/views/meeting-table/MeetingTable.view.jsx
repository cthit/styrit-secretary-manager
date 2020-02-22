import React from "react";
import {
    StyledTable,
    StyledTableHead,
    StyledTableCell,
    StyledTableRow,
    StyledCheckbox
} from "./MeetingTable.styles.view";
import { MeetingTableContainer } from "../../Meeting.styles.view";
import { DigitCheckbox } from "@cthit/react-digit-components";
import { Checkbox } from "@material-ui/core";

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
                                    value={true} // Add checkall later!
                                    onChange={val => {
                                        console.log("TASK, VAL", task, val);
                                    }}
                                    style={{ marginLeft: "5px!" }}
                                />
                            </StyledTableCell>
                        ))}
                        <StyledTableCell align="center">Code</StyledTableCell>
                    </StyledTableRow>
                </StyledTableHead>
            </StyledTable>
            {/* {console.log("GTasks", groups_tasks)}
            <StyledTable aria-label="Tasks" size="small">
                <StyledTableHead>
                    <StyledTableRow>
                        <StyledTableCell>Task</StyledTableCell>
                        {tasks.map(task => (
                            <StyledTableCell align="right" key={task.name}>
                                {task.display_name}
                                <StyledCheckbox
                                    checked={false} // Add checkall later!
                                    onChange={val => {
                                        console.log("TASK, VAL", task, val);
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
                                {group.display_name}
                            </StyledTableCell>
                            {tasks.map(task => (
                                <StyledTableCell align="right" key={task.name}>
                                    <StyledCheckbox
                                        checked={false}
                                        onChange={val => {
                                            console.log(
                                                "Group, Task, Val",
                                                group,
                                                task,
                                                val
                                            );
                                        }}
                                    />
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                    ))}
                    {/* 
                    {this.state.groups.map(row => (
                        <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                                {row.display_name}
                            </TableCell>
                            {this.state.tasks.map(col => (
                                <TableCell align="right">
                                    <Checkbox
                                        checked={this.getChecked(row, col)}
                                        onChange={() =>
                                            this.handleCheck(row, col)
                                        }
                                    />
                                </TableCell>
                            ))}
                            <TableCell align="right">
                                {this.getCode(row)}
                            </TableCell>
                        </TableRow>
                    ))} */
            /*}
                </StyledTableBody>
            </StyledTable>          */}
        </MeetingTableContainer>
    );
};

export default MeetingTable;

{
    /* <Table aria-label="Tasks" size="small">
<TableHead>
    <TableRow>
        <TableCell>Task</TableCell>
        {this.state.tasks.map(col => (
            <TableCell align="right">
                {col.display_name}
                <Checkbox
                    checked={this.get}
                    onChange={() =>
                        this.handleCheckAll(col)
                    }
                />
            </TableCell>
        ))}
        <TableCell align="center">Code</TableCell>
    </TableRow>
</TableHead>
<TableBody>
    {this.state.groups.map(row => (
        <TableRow key={row.name}>
            <TableCell component="th" scope="row">
                {row.display_name}
            </TableCell>
            {this.state.tasks.map(col => (
                <TableCell align="right">
                    <Checkbox
                        checked={this.getChecked(
                            row,
                            col
                        )}
                        onChange={() =>
                            this.handleCheck(
                                row,
                                col
                            )
                        }
                    />
                </TableCell>
            ))}
            <TableCell align="right">
                {this.getCode(row)}
            </TableCell>
        </TableRow>
    ))}
</TableBody>
</Table> */
}
