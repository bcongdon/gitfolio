import React from "react";
import { StyleSheet, View } from "react-native";
import Hyperlink from "react-native-hyperlink";
import {
  Container,
  Button,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Icon,
  Left,
  Body,
  Right,
  List,
  ListItem,
  Col,
  Grid
} from "native-base";
import moment from "moment";
import Expo from "expo";
import { GITHUB_LIGHT_GRAY, GITHUB_DARK_GRAY } from "./constants";

/**
 * UserProfile is the component for the user-information-displaying portion of the overall profile view
 */
export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewerIsFollowing: this.props.viewerIsFollowing
    };
  }

  /**
   * Renders a single line of the profile card. This line contains an icon and associated text
   * Returns null if no text is supplied.
   * @param  {object} iconOpts Options for the profile card item icon
   * @param  {string} text     Text to be displayed in the profile card item
   */
  renderProfileCardItem(iconOpts, text) {
    if (!text) {
      return null;
    }
    if (!iconOpts.style) {
      iconOpts.style = styles.profileIcon;
    }

    return (
      <Grid>
        <Col style={{ width: 45 }}>
          <View style={styles.profileIconContainer}>
            <Icon {...iconOpts} />
          </View>
        </Col>
        <Col>
          <Hyperlink linkDefault={true} linkStyle={{ color: "#2980b9" }}>
            <Text style={styles.profileText}>{text}</Text>
          </Hyperlink>
        </Col>
      </Grid>
    );
  }

  /**
   * Renders the user "Follow"/"Unfollow" button
   */
  getFollowerButton() {
    if (!this.props.viewerCanFollow) {
      return null;
    }

    let buttonText = this.state.viewerIsFollowing ? "Following" : "Follow";
    return (
      <Button
        style={{ borderColor: GITHUB_DARK_GRAY }}
        small
        iconLeft
        dark
        bordered
        onPress={() => this.onToggleFollowing()}
      >
        <Text style={{ color: GITHUB_DARK_GRAY }}>{buttonText}</Text>
      </Button>
    );
  }

  /**
   * Callback for when the user clicks the "Follow"/"Unfollow" button
   */
  onToggleFollowing() {
    this.props.setFollowing(this.props.userName, !this.state.viewerIsFollowing);
    this.setState({ viewerIsFollowing: !this.state.viewerIsFollowing });
  }

  /**
   * Renders the profile card of the user.
   * This includes a thumbnail of the user, the user's name / login, and their profile details
   */
  renderProfileCard() {
    return (
      <Card>
        <CardItem>
          <Left>
            <Thumbnail large source={{ uri: this.props.avatarURL }} />
            <Body>
              <Text>{this.props.name}</Text>
              <Text note>{this.props.userName}</Text>
            </Body>
          </Left>
          <Right>{this.getFollowerButton()}</Right>
        </CardItem>
        <CardItem cardBody>
          <Body>
            {this.renderProfileCardItem(
              { type: "Octicons", name: "person", ios: "person" },
              this.props.profileDescription
            )}
            {this.renderProfileCardItem(
              { type: "Octicons", name: "location", ios: "location" },
              this.props.location
            )}
            {this.renderProfileCardItem(
              { type: "Octicons", name: "mail", ios: "mail" },
              this.props.email
            )}
            {this.renderProfileCardItem(
              { type: "Octicons", name: "link", ios: "link" },
              this.props.site
            )}
            {this.renderProfileCardItem(
              { type: "Octicons", name: "calendar", ios: "calendar" },
              moment(this.props.joinDate).fromNow()
            )}
          </Body>
        </CardItem>
        {/* Small hack to add padding to the bottom of the card */}
        <CardItem />
      </Card>
    );
  }

  /**
   * Renders a list item link for a section of the user's profile (i.e. repositories, followers)
   * @param  {number} linkQuantity The quantity of the link type (i.e. number of repositories, followers)
   * @param  {string} linkLabel    The label of the link (i.e. repositories, followers)
   * @param  {string} linkIcon     The type of the icon to use for the link
   * @param  {string} linkRoute    The route of the view to push when the link is clicked
   */
  renderUserLink(linkQuantity, linkLabel, linkIcon, tabIndex) {
    return (
      <ListItem button icon onPress={() => this.props.setActiveTab(tabIndex)}>
        <Left>
          <Icon type="Octicons" name={linkIcon} ios={linkIcon} />
        </Left>
        <Body>
          <Text>
            {linkQuantity ? `${linkQuantity} ` : null}
            {linkLabel}
          </Text>
        </Body>
        <Right>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
    );
  }

  /**
   * Renders the section of the user profile that contains links to their other sections.
   * Reports the number of repositories, followers, and users that the current user follows
   */
  renderUserLinks() {
    return (
      <List button>
        {this.renderUserLink(this.props.numRepos, "Repositories", "repo", 1)}
        {this.renderUserLink(
          this.props.following,
          "Following",
          "organization",
          2
        )}
        {this.renderUserLink(this.props.followers, "Followers", "megaphone", 3)}
      </List>
    );
  }

  render() {
    return (
      <Container>
        <Content>
          {this.renderProfileCard()}
          {this.renderUserLinks()}
        </Content>
      </Container>
    );
  }

  /**
   * Boilerplate method to load Expo fonts
   */
  componentWillMount() {
    Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
  }
}

const styles = StyleSheet.create({
  profileIcon: {
    fontSize: 20,
    color: GITHUB_LIGHT_GRAY
  },
  profileIconContainer: {
    width: 45,
    height: 18,
    paddingLeft: 10,
    paddingRight: 5,
    alignContent: "center"
  },
  profileText: {
    color: GITHUB_DARK_GRAY,
    lineHeight: 22
  }
});
