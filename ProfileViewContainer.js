import React from "react";
import { Container, Header, Title, Body } from "native-base";
import ProfileView from "./ProfileView";

/**
 * Container component for a ProfileView to be displayed outside of
 * a StackNavigator context
 */
export default class ProfileViewContainer extends React.Component {
  render() {
    return (
      <Container>
        <Header hasTabs>
          <Body>
            <Title>Profile</Title>
          </Body>
        </Header>
        <ProfileView {...this.props} />
      </Container>
    );
  }
}
