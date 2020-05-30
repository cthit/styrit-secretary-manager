import React from "react";
import {connect} from "react-redux";
import {Stories} from "./Stories.view";

const mapStateToProps = state => ({
    groups: state.root.MeetingReducer.groups,
    years: state.root.StoriesReducer.years,
    groupYears: state.root.StoriesReducer.groupYears,
    selectedGroup: state.root.StoriesReducer.selectedGroup,
    selectedYear: state.root.StoriesReducer.selectedYear
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Stories);
