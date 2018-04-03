import React from "react";
import client from "../client";
import { Linking } from "react-native";
import {
  Container,
  Content,
  Text,
  Header,
  Body,
  Title,
  List,
  ListItem,
  Spinner,
  Icon,
  Left,
  Right
} from "native-base";
import moment from "moment";

/**
 * Icon names for notification subjects
 */
const SUBJECT_ICONS = {
  Issue: "issue-opened",
  Commit: "git-commit",
  PullRequest: "git-pull-request"
};

/**
 * Icon colors by notification subject
 */
const ICON_COLORS = {
  Issue: "#00a74c",
  PullRequest: "#00a74c"
};

export default class NotificationsListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      loading: true
    };
  }

  componentWillMount() {
    client.getNotifications().then(data => {
      this.setState({
        notifications: data.data,
        loading: false
      });
    });
  }

  /**
   * Renders an individual notification as a ListItem
   * @param  {object}  notification The object representing the notification
   * @return {ListItem}             The rendered notification
   */
  renderNotification(notification) {
    let iconName = SUBJECT_ICONS[notification.subject.type] || "bell";
    let iconColor = ICON_COLORS[notification.subject.type] || "#c8c9cb";
    return (
      <ListItem
        button
        key={notification.id}
        onPress={() => Linking.openURL(notification.repository.html_url)}
      >
        <Left>
          <Icon
            style={{ color: iconColor, fontSize: 20 }}
            type="Octicons"
            name={iconName}
            ios={iconName}
          />
          <Text style={{ paddingLeft: 10 }}>
            {notification.subject.title}
            {"\n"}
            <Text note>{notification.repository.full_name}</Text>
          </Text>
        </Left>
        <Right style={{ flex: 0.5 }}>
          <Text note>{moment(notification.updated_at).fromNow()}</Text>
        </Right>
      </ListItem>
    );
  }

  render() {
    var notifications;

    // Display a loading spinner if the component is in the loading state
    if (this.state.loading) {
      notifications = <Spinner />;
    } else if (this.state.notifications.length > 0) {
      // Display the list of notifications if the component has notifications to show
      notifications = (
        <List>{this.state.notifications.map(this.renderNotification)}</List>
      );
    } else {
      // Display a message if there are no notifications
      notifications = <Text style={{paddingTop: 10, textAlign: 'center' }} note>No new notifications</Text>;
    }

    return (
      <Container>
        <Header>
          <Body>
            <Title>Notifications</Title>
          </Body>
        </Header>
        <Content>{notifications}</Content>
      </Container>
    );
  }
}
