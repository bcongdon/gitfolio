import React from "react";
import UserProfile from "./UserProfile";

/**
 * UserProfile container is a wrapper for the UserProfile view.
 * It passes props from the loaded Github data into the UserProfile's prop types
 */
export default class UserProfileContainer extends React.Component {
  render() {
    return (
      <UserProfile
        avatarURL={this.props.screenProps.profile.avatarUrl}
        name={this.props.screenProps.profile.name}
        userName={this.props.screenProps.profile.login}
        profileDescription={this.props.screenProps.profile.bio}
        location={this.props.screenProps.profile.location}
        email={this.props.screenProps.profile.email}
        site={this.props.screenProps.profile.blog}
        joinDate={this.props.screenProps.profile.createdAt}
        following={this.props.screenProps.profile.following}
        followers={this.props.screenProps.profile.followers}
        numRepos={this.props.screenProps.profile.publicRepositories}
        navigate={this.props.navigation.navigate}
        viewerIsFollowing={this.props.screenProps.profile.viewerIsFollowing}
        viewerCanFollow={this.props.screenProps.profile.viewerCanFollow}
        setFollowing={this.props.screenProps.setFollowing}
        setActiveTab={this.props.setActiveTab}
      />
    );
  }
}
