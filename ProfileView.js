import React from "react";
import { AsyncStorage } from "react-native";
import UserProfileContainer from "./UserProfileContainer";
import { Spinner } from "native-base";
import RepositoriesView from "./components/RepositoriesView";
import FollowersView from "./components/FollowersView";
import FollowingView from "./components/FollowingView";
import ProfileTabBar from "./components/ProfileTabBar";
import client from "./client";

/**
 * Component for the overall Profile view.
 * Handles fetching data from the Github API and passing it to the subviews.
 */
export default class ProfileView extends React.Component {
  /**
   * Sets up the default state and creats a GraphQL client for the Github API
   */
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      repos: [],
      followers: [],
      following: [],
      activeTab: 0
    };
  }

  /**
   * Creates an object representing a user profile
   * @param  {Object} queryResult The query results from the github api
   */
  constructProfile(queryResult) {
    return {
      name: queryResult.name,
      login: queryResult.login,
      bio: queryResult.bio,
      createdAt: queryResult.createdAt,
      location: queryResult.location,
      email: queryResult.email,
      websiteUrl: queryResult.websiteUrl,
      viewerIsFollowing: queryResult.viewerIsFollowing,
      viewerCanFollow: queryResult.viewerCanFollow,
      publicRepositories: queryResult.repositories.totalCount,
      avatarUrl: queryResult.avatarUrl,
      followers: queryResult.followers.totalCount,
      following: queryResult.following.totalCount
    };
  }

  /**
   * Pulls Github data from the Github API and sets states accordingly
   */
  pullGithubProfile() {
    console.log("Pulling from Github API");
    client
      .getProfile(this.getUsername())
      .then(data =>
        this.setState(
          {
            repos: data.data.user.repositories.nodes,
            followers: data.data.user.followers.nodes,
            following: data.data.user.following.nodes,
            profile: this.constructProfile(data.data.user)
          },
          () => this.updateAsyncStorage()
        )
      )
      .catch(error => console.log(error));
  }

  /**
   * Validates if a result pulled from AsyncStorage is complete
   * @param  {object} result The result object to validate
   */
  resultIsComplete(result) {
    return (
      result &&
      Object.keys(result.profile).length > 0 &&
      result.repos.length > 0 &&
      result.followers.length > 0 &&
      result.following.length > 0
    );
  }

  /**
   * On component mount, fetch necessary Github data or load from AsyncStorage
   */
  componentWillMount() {
    AsyncStorage.getItem(this.getUsername()).then(result => {
      if (result && this.resultIsComplete(JSON.parse(result))) {
        console.log("Data found in AsyncStorage");
        this.setState(JSON.parse(result));
      } else {
        this.pullGithubProfile();
      }
    });
  }

  /**
   * Returns the username of the current user
   */
  getUsername() {
    return this.props.navigation.getParam("username", "bcongdon");
  }

  /**
   * On component updates, save the state to AsyncStorage
   */
  updateAsyncStorage() {
    AsyncStorage.setItem(this.getUsername(), JSON.stringify(this.state));
  }

  /**
   * Sets whether or not the current user is starting the provided repo
   * @param {string} owner    The repo owner's login
   * @param {string} repo     The repo name
   * @param {bool}   newValue Whether or not the current user should be starring the given repo
   */
  setStarringRepository(owner, repo, newValue) {
    client.setStarringRepository(owner, repo, newValue);

    let repos = this.state.repos;
    for (var i = 0; i < repos.length; i++) {
      if (repos[i].owner.login === owner && repos[i].name == repo) {
        repos[i].viewerHasStarred = newValue;
        break;
      }
    }
    this.setState({ repos });
    this.updateAsyncStorage();
  }

  /**
   * Sets whether or not the current user is following the provided user
   * @param {string} user     The user to follow/unfollow
   * @param {string} newValue Whether or not the current user should be following the provided user
   */
  setFollowingUser(user, newValue) {
    client
      .setFollowingUser(user, newValue)
      .then(() => this.pullGithubProfile());
  }

  /**
   * Sets the current active tab in the upper tab bar of the view
   * @param {number} tab The index of the active tab
   */
  setActiveTab(tab) {
    this.setState({ activeTab: tab });
  }

  render() {
    // Render a spinner until Github API requests finish
    if (!this.state.profile.publicRepositories) {
      return <Spinner />;
    }

    let screenProps = {
      profile: this.state.profile,
      repos: this.state.repos,
      followers: this.state.followers,
      following: this.state.following,
      rootNavigate: this.props.navigation,
      setStarred: this.setStarringRepository.bind(this),
      setFollowing: this.setFollowingUser.bind(this)
    };

    let childProps = {
      screenProps,
      navigation: this.props.navigation
    };

    return (
      <ProfileTabBar
        activeTab={this.state.activeTab}
        profileView={
          <UserProfileContainer
            setActiveTab={this.setActiveTab.bind(this)}
            {...childProps}
          />
        }
        repositoriesView={
          <RepositoriesView
            repos={this.state.repos}
            setStarred={this.setStarringRepository.bind(this)}
          />
        }
        followersView={<FollowersView {...childProps} />}
        followingView={<FollowingView {...childProps} />}
        onChangeTab={opts => this.setState({ activeTab: opts.i })}
      />
    );
  }
}

ProfileView.navigationOptions = ({ navigation }) => {
  const { params } = navigation.state;

  return {
    title: params ? params.username : "GitFolio"
  };
};
