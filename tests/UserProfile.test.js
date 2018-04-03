import UserProfile from "../UserProfile";
import { ListItem } from "native-base";
import React from "react";
import moment from "moment";

import renderer from "react-test-renderer";

it("renders without crashing", () => {
  let component = <UserProfile />;

  const rendered = renderer.create(component).toJSON();
  expect(rendered).toBeTruthy();
});

it("should pass snapshot test", () => {
  let component = (
    <UserProfile
      avatarURL={"github.com/foo"}
      name={"Ben Congdon"}
      userName={"bcongdon"}
      profileDescription={"description"}
      location={"location"}
      email={"email"}
      site={"website"}
      joinDate={moment.utc([2010, 1, 14, 15, 25, 50, 125])}
      following={10}
      followers={11}
      numRepos={12}
      viewerIsFollowing={true}
      viewerCanFollow={true}
      setFollowing={{}}
      setActiveTab={() => {}}
    />
  );

  const rendered = renderer.create(component).toJSON();
  expect(rendered).toMatchSnapshot();
});

it("should render correctly without follower button", () => {
  let component = (
    <UserProfile
      avatarURL={"github.com/foo"}
      name={"Ben Congdon"}
      userName={"bcongdon"}
      profileDescription={"description"}
      location={"location"}
      email={"email"}
      site={"website"}
      joinDate={moment.utc([2010, 1, 14, 15, 25, 50, 125])}
      following={10}
      followers={11}
      numRepos={12}
      viewerIsFollowing={false}
      viewerCanFollow={false}
      setFollowing={{}}
    />
  );

  const rendered = renderer.create(component).toJSON();
  expect(rendered).toMatchSnapshot();
});

it("should set active tab when ListItems are clicked", () => {
  let setActiveTabFn = jest.fn();
  let component = (
    <UserProfile
      avatarURL={"github.com/foo"}
      name={"Ben Congdon"}
      userName={"bcongdon"}
      profileDescription={"description"}
      location={"location"}
      email={"email"}
      site={"website"}
      joinDate={moment.utc([2010, 1, 14, 15, 25, 50, 125])}
      following={10}
      followers={11}
      numRepos={12}
      viewerIsFollowing={true}
      viewerCanFollow={true}
      setFollowing={{}}
      setActiveTab={setActiveTabFn}
    />
  );

  const rendered = renderer.create(component).root;
  rendered.findAllByType(ListItem)[0].props.onPress();
  expect(setActiveTabFn).toBeCalled();
  expect(setActiveTabFn.mock.calls[0][0]).toEqual(1);
});
