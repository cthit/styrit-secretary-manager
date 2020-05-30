import React from "react";
import {
    HLine,
    HSpace,
    InfoCard,
    SmallVSpace,
    StoriesContainer,
    StoriesSelectContainer,
    StoryChipContainer,
    VSpace
} from "./Stories.styles.view.jsx.";
import {DigitAutocompleteSelectSingle, DigitButton, DigitChip, DigitText} from "@cthit/react-digit-components";

export const Stories = props => (
    <StoriesContainer>
        <DigitText.Heading5 text={"Ansvarsbefrielse"} />
        <VSpace />
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
            <HSpace />
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
            <HSpace />
            <DigitButton
                raised
                primary
                size={{width: "200px"}}
                text={"Add committee year"}
                onClick={() => {
                    console.log("Add groupYear!")
                    props.addGroupYear()
                }}
            />
        </StoriesSelectContainer>
        {
            props.errorMsg && (
                <div>
                    <SmallVSpace />
                    <DigitText.Text text={props.errorMsg} color="error" bold />
                </div>
            )
        }
        <SmallVSpace />
        <HLine />
        <VSpace />
        <StoryChipContainer>
            {
                getGroupYears(props.groupYears, props.groups).map(gy => (
                    <DigitChip primary label={formatChipLabel(gy)} onDelete={() => alert("delete")} />
                ))
            }
        </StoryChipContainer>
        <VSpace />
        <HLine />
        <InfoCard>
            <DigitText.Text
                text={"Requests that these groups send in their economic and activity stories for their year (Verksamhetsberättelser / ekonomiska berättelser)"} />
        </InfoCard>
        <DigitButton text={"Send emails to above groups"} raised primary />
    </StoriesContainer>
);

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