import ProfileView from "../ProfileView";
import React from "react";
import client from "../client";
import { AsyncStorage } from "react-native";
import renderer from "react-test-renderer";

const profileData = {
  repositories: { nodes: "foo" },
  followers: { nodes: "bar" },
  following: { nodes: "baz" }
};

it("renders without crashing", () => {
  const paramFn = jest.genMockFn().mockReturnValue("bcongdon");
  client.getProfile = jest.fn();

  let component = <ProfileView navigation={{ getParam: paramFn }} />;

  const rendered = renderer.create(component).toJSON();
  expect(rendered).toBeTruthy();
});

it("pulls data from the github API", () => {
  const paramFn = jest.genMockFn().mockReturnValue("bcongdon");
  client.getProfile = jest.genMockFn().mockReturnValue(
    new Promise(resolve => {
      resolve({
        data: { user: profileData }
      });
    })
  );

  let component = <ProfileView navigation={{ getParam: paramFn }} />;

  const rendered = renderer.create(component).root;

  jest.runAllTicks();
  expect(rendered.instance.state.repos).toBe("foo");
  expect(rendered.instance.state.followers).toBe("bar");
  expect(rendered.instance.state.following).toBe("baz");
});

it("checks AsyncStorage before pulling from API", () => {
  const paramFn = jest.genMockFn().mockReturnValue("bcongdon");
  let component = <ProfileView navigation={{ getParam: paramFn }} />;

  AsyncStorage.getItem = jest.genMockFn().mockReturnValue(
    new Promise(resolve => {
      resolve({
        profile: ["foo"],
        repos: ["bar"],
        followers: ["baz"],
        following: ["qux"]
      });
    })
  );

  client.getProfile = jest.fn();

  renderer.create(component).root;

  expect(AsyncStorage.getItem).toBeCalled();
  expect(client.getProfile).not.toBeCalled();
});

it("stores pulled API data in AsyncStorage", () => {
  const paramFn = jest.genMockFn().mockReturnValue("bcongdon");
  let component = <ProfileView navigation={{ getParam: paramFn }} />;

  AsyncStorage.getItem = jest.genMockFn().mockReturnValue(
    new Promise(resolve => {
      resolve(null);
    })
  );

  AsyncStorage.setItem = jest.fn();

  client.getProfile = jest.genMockFn().mockReturnValue(
    new Promise(resolve => {
      resolve({
        data: { user: profileData }
      });
    })
  );

  const rendered = renderer.create(component);

  jest.runAllTicks();
  expect(AsyncStorage.getItem).toBeCalled();
  expect(client.getProfile).toBeCalled();
  rendered.update();
  expect(AsyncStorage.setItem).toBeCalled();
  expect(AsyncStorage.setItem.mock.calls[0][0]).toBe("bcongdon");
  expect(JSON.parse(AsyncStorage.setItem.mock.calls[0][1])).toEqual({
    activeTab: 0,
    followers: "bar",
    following: "baz",
    profile: {},
    repos: "foo"
  });
});
