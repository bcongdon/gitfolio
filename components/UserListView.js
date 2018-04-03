import React from "react";
import {
  Text,
  List,
  ListItem,
  Left,
  Icon,
  Container,
  Content,
  Thumbnail,
  Right
} from "native-base";

/**
 * UserListView is a generic component that renders a list of Github users
 */
export default class UserListView extends React.Component {
  /**
   * Renders the user name/login portion of the Github user list itme
   * @param  {string} userName  The user's real name
   * @param  {string} userLogin The user's login name
   */
  renderUserName(userName, userLogin) {
    // If the user doens't have a "real" name, just render the login name
    if (!userName) {
      return <Text>{userLogin}</Text>;
    } else {
      return (
        <Text>
          {userName}
          {"\n"}
          <Text note>{userLogin}</Text>
        </Text>
      );
    }
  }

  /**
   * Handles when a user's list item is clicked
   * @param  {string} userLogin The clicked user's login
   */
  onUserClick(userLogin) {
    this.props.navigation.push("ProfileView", { username: userLogin });
  }

  /**
   * Renders the user list item
   * @param  {object} user The object representing the user
   */
  renderUser(user) {
    let key = `${user.login}|${user.email}`;
    return (
      <ListItem button key={key} onPress={() => this.onUserClick(user.login)}>
        <Thumbnail
          style={{ marginRight: 10 }}
          square
          size={80}
          source={{ uri: user.avatarUrl }}
        />
        <Left>{this.renderUserName(user.name, user.login)}</Left>
        <Right>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
    );
  }

  render() {
    return (
      <Container>
        <Content>
          <List>
            {this.props.users
              .filter(item => item.login)
              .map(item => this.renderUser(item))}
          </List>
        </Content>
      </Container>
    );
  }
}
