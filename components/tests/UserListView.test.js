import UserListView from "../UserListView";
import { Text, List, ListItem, Thumbnail } from "native-base";
import React from "react";

import renderer from "react-test-renderer";

it("renders without crashing", () => {
  let component = <UserListView users={[]} />;

  const rendered = renderer.create(component).toJSON();
  expect(rendered).toBeTruthy();
});

it("renders users correctly", () => {
  let user = {
    login: "bcongdon",
    name: "Ben Congdon",
    avatarUrl: "foo.bar"
  };

  let component = <UserListView users={[user]} />;

  const rendered = renderer.create(component).root;
  expect(rendered.findByType(List)).toBeTruthy();
  expect(rendered.findByType(ListItem)).toBeTruthy();

  const userItem = rendered.findByType(ListItem);
  expect(userItem.findByType(Thumbnail).props.source.uri).toEqual("foo.bar");

  const userText = userItem.findAllByType(Text);
  expect(userText[0].props.children[0]).toEqual("Ben Congdon");
  expect(userText[1].props.children).toEqual("bcongdon");
});

it("renders should navigate on user click", () => {
  let user = {
    login: "bcongdon",
    name: "Ben Congdon",
    avatarUrl: "foo.bar"
  };

  const pushMock = jest.fn();

  let component = (
    <UserListView users={[user]} navigation={{ push: pushMock }} />
  );

  const rendered = renderer.create(component).root;
  rendered.findByType(ListItem).props.onPress();
  expect(pushMock.mock.calls.length).toBe(1);

  expect(pushMock.mock.calls[0][0]).toEqual("ProfileView");
  expect(pushMock.mock.calls[0][1]).toEqual({ username: "bcongdon" });
});
