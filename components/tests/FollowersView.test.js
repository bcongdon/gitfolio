import FollowersView from "../FollowersView";
import UserListView from "../UserListView";
import React from "react";

import renderer from "react-test-renderer";

it("renders without crashing", () => {
  let component = <FollowersView screenProps={{ followers: [] }} />;

  const rendered = renderer.create(component).toJSON();
  expect(rendered).toBeTruthy();
});

it("renders users correctly", () => {
  let user = {
    login: "bcongdon",
    name: "Ben Congdon",
    avatarUrl: "foo.bar"
  };

  let component = <FollowersView screenProps={{ followers: [user] }} />;

  const rendered = renderer.create(component).root;
  expect(rendered.findByType(UserListView)).toBeTruthy();
  const userListView = rendered.findByType(UserListView);
  expect(userListView.props.users[0]).toEqual(user);
});
