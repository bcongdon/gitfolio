import React from "react";
import { Footer, FooterTab, Button, Icon } from "native-base";
import { NavigationActions } from "react-navigation";

/**
 * Footer tab bar at the bottom of the application
 */
export default class RootTabBar extends React.Component {
  /**
   * Navigates to the search tab
   * Always navigates to the "root" of the search tab
   *   (i.e. any nested views are popped)
   */
  navigateToSearch() {
    const navigateAction = NavigationActions.navigate({
      routeName: "SearchRoot",
      action: NavigationActions.popToTop()
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    return (
      <Footer>
        <FooterTab>
          <Button
            vertical
            active={this.props.navigationState.index === 0}
            onPress={() => this.props.navigation.navigate("Profile")}
          >
            <Icon type="Octicons" ios="person" name="person" />
          </Button>
          <Button
            vertical
            active={this.props.navigationState.index === 1}
            onPress={() => this.navigateToSearch()}
          >
            <Icon type="Octicons" ios="search" name="search" />
          </Button>
          <Button
            vertical
            active={this.props.navigationState.index === 2}
            onPress={() => this.props.navigation.navigate("Notifications")}
          >
            <Icon type="Octicons" ios="bell" name="bell" />
          </Button>
          <Button
            vertical
            active={this.props.navigationState.index === 3}
            onPress={() => this.props.navigation.navigate("Settings")}
          >
            <Icon type="Octicons" ios="gear" name="gear" />
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}
