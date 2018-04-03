import React from "react";

import ProfileView from "./ProfileView";
import ProfileViewContainer from "./ProfileViewContainer";
import SearchView from "./components/SearchView";
import RootTabBar from "./components/RootTabBar";
import SettingsView from "./components/SettingsView";
import NotificationsListView from "./components/NotificationsListView";
import { StackNavigator, TabNavigator } from "react-navigation";

/**
 * The StackNavigator object for the Search tab
 * @type {StackNavigator}
 */
const RootNavigator = StackNavigator(
  {
    Search: {
      screen: SearchView,
      navigationOptions: { title: "Search Github" }
    },
    ProfileView: {
      screen: ProfileView
    }
  },
  {
    cardStyle: { backgroundColor: "#fff" }
  }
);

/**
 * The TabNavigator object at the root of the application
 * @type {TabNavigator}
 */
const RootTabNavicator = TabNavigator(
  {
    Profile: {
      screen: ProfileViewContainer
    },
    SearchRoot: {
      screen: RootNavigator
    },
    Notifications: {
      screen: NotificationsListView
    },
    Settings: {
      screen: SettingsView
    }
  },
  {
    tabBarComponent: RootTabBar,
    tabBarPosition: "bottom"
  }
);

/**
 * Root component of the App
 */
export default class App extends React.Component {
  render() {
    return <RootTabNavicator />;
  }
}

/**
 * Ignore React deprecation warnings for component lifetime functions
 */
console.ignoredYellowBox = ["Warning: componentWill"];
