import React from "react";
import { Container, Content, Text, Header, Body, Title } from "native-base";

/**
 * Placeholder component for editing app Settings
 */
export default class SettingsView extends React.Component {
  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Settings</Title>
          </Body>
        </Header>
        <Content>
          <Text style={{ textAlign: "center", marginTop: 25 }}>
            Coming soon...
          </Text>
        </Content>
      </Container>
    );
  }
}
