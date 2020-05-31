import React from "react";
import {
    HLine,
    HSpace,
    SmallVSpace,
    StoriesContainer,
    StoriesSelectContainer,
    StoryChipContainer,
    VSpace
} from "./Stories.styles.view.jsx.";
import {
    DigitAutocompleteSelectSingle,
    DigitButton,
    DigitChip,
    DigitText,
    useDigitDialog
} from "@cthit/react-digit-components";

export const Stories = props => {
    const [openSendMailDialog] = useDigitDialog({
        title: "Are you sure you want to send the mail(s)?",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        onConfirm: () => props.sendStoryEmails(props.password),
        onCancel: () => {
        }
    })

    return (
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
                        <DigitChip key={gy.group.name + "_" + gy.year} primary label={formatChipLabel(gy)}
                                   onDelete={() => props.deleteGroupYear(gy)} />
                    ))
                }
            </StoryChipContainer>
            <VSpace />
            <HLine />
            {
                props.saveError && (
                    <DigitText.Text text={props.saveError} color="error" bold />
                )
            }
            <DigitButton raised primary
                         onClick={() => props.save(props.groupYears, props.password)}
                         text={"Save stories settings"}
                         size={{width: "400px"}} />
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

function getSendEmailsDisabled(groupYears) {
    let disabled = true;
    groupYears.forEach(groupYear => {
        if (groupYear.finished === false) {
            disabled = false;
        }
    })
    return disabled;
}

export default Stories;