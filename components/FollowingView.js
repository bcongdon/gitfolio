import React from "react";
import UserListView from "./UserListView";

/*
  FollowingView wraps the UserListView component, and displays a list of users
  that the current user is following.
 */
export default class FollowingView extends React.Component {
  render() {
    return (
      <UserListView
        users={this.props.screenProps.following}
        navigation={this.props.screenProps.rootNavigate}
      />
    );
  }
}
