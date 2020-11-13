import React from "react";
import {
    HLine,
    HSpace,
    SmallVSpace,
    StoriesContainer,
    StoriesSelectContainer,
    StoryChipContainer,
    VSpace,
    WarningText
} from "./Stories.styles.view.jsx.";
import {
    DigitAutocompleteSelectSingle,
    DigitButton,
    DigitChip,
    DigitText
} from "@cthit/react-digit-components";
import {Space} from "../../../../../main/screens/upload/Upload.styles.screen";

export const Stories = props => {
    return (
        <StoriesContainer>
            <DigitText.Heading5 text={"Ansvarsbefrielse"}/>
            <VSpace/>
            <StoriesSelectContainer>
                <DigitAutocompleteSelectSingle
                    upperLabel={"Group"}
                    outlined
                    options={getGroups(props.groups)}
                    onChange={e => {
                        props.selectGroup(e.target.value)
                    }}
                    value={props.selectedGroup}
                    noOptionsText={"No Groups"}
                />
                <HSpace/>
                <DigitAutocompleteSelectSingle
                    upperLabel={"Year"}
                    outlined
                    options={getYears(props.years)}
                    onChange={e => {
                        props.selectYear(e.target.value)
                    }}
                    value={props.selectedYear}
                    noOptionsText={"No Years"}
                />
                <HSpace/>
                <DigitButton
                    raised
                    primary
                    size={{width: "200px"}}
                    text={"Add committee year"}
                    // Should be == as we want to check both for null and undefined
                    disabled={props.selectedGroup == null || props.selectedYear == null}
                    onClick={() => {
                        props.addGroupYear()
                    }}
                />
            </StoriesSelectContainer>
            {
                props.errorMsg && (
                    <div>
                        <SmallVSpace/>
                        <DigitText.Text text={props.errorMsg} color="error"
                                        bold/>
                    </div>
                )
            }
            <SmallVSpace/>
            <HLine/>
            <VSpace/>
            <StoryChipContainer>
                {
                    getGroupYears(props.groupYears, props.groups).map(gy => (
                        <DigitChip key={gy.group.name + "_" + gy.year} primary
                                   label={formatChipLabel(gy)}
                                   onDelete={() => props.deleteGroupYear(gy)}/>
                    ))
                }
            </StoryChipContainer>
            <VSpace/>
            <HLine/>
            {
                props.saveError && (
                    <DigitText.Text text={props.saveError} color="error" bold/>
                )
            }
            {
                props.unsavedChanges && (
                    <WarningText text="You have unsaved changes!"/>
                )
            }
            <DigitButton raised primary
                         onClick={() => props.save(props.groupYears)}
                         text={"Save stories settings"}
                         size={{width: "400px"}}/>
            <HLine/>
            {/*<div style={{minHeight: "50px"}}/>*/}
            <DigitText.Title text={"Connect stories to meeting"}/>
            <DigitText.Text
                text={"(Also done automatically before sending story emails)"}/>
            <div style={{minHeight: "10px"}}/>
            <DigitAutocompleteSelectSingle
                upperLabel={"Meeting"}
                outlined
                options={props.meetings}
                onChange={e => {
                    props.selectMeeting(e.target.value)
                }}
                value={props.selectedMeeting}
                disabled={props.meetings.length === 0}
                noOptionsText={"No meetings"}
            />
            <DigitButton
                primary
                raised
                text={"Generate codes for story groups"}
                onClick={() => props.connectStories(props.selectedMeeting)}
                disabled={props.selectedMeeting === ""}
            />
            <Space/>
            <table style={{width: "80%"}}>
                <tbody>
                {
                    props.groupIds[props.selectedMeeting] && (
                        props.groupIds[props.selectedMeeting].map((obj, index) => (
                            <tr key={index}>
                                <td width={"42%"}>
                                    <DigitText.Text
                                        alignRight
                                        bold
                                        text={obj.group + " " + obj.year + ": "}/>
                                </td>
                                <td width={"1%"}/>
                                <td width={"57%"}>
                                    <DigitText.Text text={obj.id}/>
                                </td>
                            </tr>
                        ))
                    )
                }
                </tbody>
            </table>

            <HLine/>
        </StoriesContainer>
    );
}

function getGroups(groups) {
    return Object.keys(groups).map(group => {
        return {
            text: groups[group],
            value: group
        }
    })
}

function getYears(years) {
    return years.map(year => {
        return {
            text: year.toString(),
            value: year
        }
    })
}

function getGroupYears(groupYears, groups) {
    let arr = []
    groupYears.forEach(groupYear => {
        if (groupYear.finished === false) {
            arr.push({
                         year: groupYear.year,
                         group: getGroupFromName(groupYear.group, groups)
                     })
        }
    })
    return arr;
}

function getGroupFromName(groupName, groups) {
    return {
        name: groupName,
        displayName: groups[groupName]
    }
}

function formatChipLabel(data) {
    return data.group.displayName + " " + data.year
}

export default Stories;