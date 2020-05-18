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
import { DigitAutocompleteSelectSingle, DigitButton, DigitChip, DigitText } from "@cthit/react-digit-components";

export const Stories = props => (
    <StoriesContainer>
        <DigitText.Heading5 text={"Ansvarsbefrielse"} />
        <VSpace />
        <StoriesSelectContainer>
            <DigitAutocompleteSelectSingle
                upperLabel={"Group"}
                outlined
                options={getGroups()}
                onChange={e => {
                    console.log("GROUP SELECTED: ", e.target.value)
                }}
                value={"prit"}
                noOptionsText={"No Groups"}
            />
            <HSpace />
            <DigitAutocompleteSelectSingle
                upperLabel={"Year"}
                outlined
                options={getYears()}
                onChange={e => {
                    console.log("Year SELECTED: ", e.target.value)
                }}
                value={2019}
                noOptionsText={"No Years"}
            />
            <HSpace />
            <DigitButton
                raised
                primary
                size={{width: "200px"}}
                text={"Add committee year"}
            />
        </StoriesSelectContainer>
        <SmallVSpace />
        <HLine />
        <VSpace />
        <StoryChipContainer>
            {
                getGroupYears().map(gy => (
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

function getGroups() {
    const arr = [
        {
            "text": "P.R.I.T.",
            "value": "prit"
        },
        {
            "text": "sexIT",
            "value": "sexit"
        },
        {
            "text": "styrIT",
            "value": "styrit"
        }
    ]
    return arr;
}

function getYears() {
    return [
        {
            "text": "2020",
            "value": 2020
        },
        {
            "text": "2019",
            "value": 2019
        },
        {
            "text": "2018",
            "value": 2018
        },
        {
            "text": "2017",
            "value": 2017
        },
        {
            "text": "2016",
            "value": 2016
        }
    ]
}

function getGroupYears() {
    return [
        {
            "group": {
                "name": "prit",
                "displayName": "P.R.I.T."
            },
            "year": 2020
        },
        {
            "group": {
                "name": "sexit",
                "displayName": "sexIT"
            },
            "year": 2017
        },
        {
            "group": {
                "name": "sexit",
                "displayName": "sexIT"
            },
            "year": 2017
        },
        {
            "group": {
                "name": "nollkit",
                "displayName": "nollKIT"
            },
            "year": 2016
        },
        {
            "group": {
                "name": "sexit",
                "displayName": "sexIT"
            },
            "year": 2017
        }
    ]
}

function formatChipLabel(data) {
    return data.group.displayName + " " + data.year
}

export default Stories;