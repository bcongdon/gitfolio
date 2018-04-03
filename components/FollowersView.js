import React from "react";
import UserListView from "./UserListView";

/*
  FollowersView wraps the UserListView component, and displays a list of user followers.
 */
export default class FollowersView extends React.Component {
  render() {
    return (
      <UserListView
        users={this.props.screenProps.followers}
        navigation={this.props.screenProps.rootNavigate}
      />
    );
  }
}
