import React from "react";

import { Tab, Tabs } from "native-base";

/*
  ProfileTabBar is the component for the bar of tabs at the bottom of the user profile view
 */
export default class ProfileTabBar extends React.Component {
  render() {
    return (
      <Tabs
        tabBarPosition={"top"}
        onChangeTab={this.props.onChangeTab}
        page={this.props.activeTab}
      >
        {/* Tab for the user profile view */}
        <Tab heading={"Profile"}>{this.props.profileView}</Tab>

        {/* Tab for the repositories */}
        <Tab heading={"Repos"}>{this.props.repositoriesView}</Tab>

        {/* Tab for the "User Following" view */}
        <Tab heading={"Following"}>{this.props.followingView}</Tab>

        {/* Tab for the "User Followers" view */}
        <Tab heading={"Followers"}>{this.props.followersView}</Tab>
      </Tabs>
    );
  }
}
