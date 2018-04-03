import UserProfileContainer from "../UserProfileContainer";
import React from "react";
import moment from "moment";

import renderer from "react-test-renderer";

it("renders without crashing", () => {
  let component = (
    <UserProfileContainer
      navigation={{}}
      screenProps={{
        profile: {
          avatarUrl: "github.com/foo",
          name: "Ben Congdon",
          login: "bcongdon",
          bio: "bio",
          locatiob: "location",
          email: "email",
          blog: "blog",
          createdAt: moment.utc([2010, 1, 14, 15, 25, 50, 125]),
          following: 10,
          followers: 11,
          publicRespositories: 12,
          viewerIsFollowing: true,
          viewerCanFollow: true
        },
        setFollowing: {}
      }}
    />
  );

  const rendered = renderer.create(component).toJSON();
  expect(rendered).toBeTruthy();
});

it("should pass snapshot test", () => {
  let component = (
    <UserProfileContainer
      navigation={{}}
      screenProps={{
        profile: {
          avatarUrl: "github.com/foo",
          name: "Ben Congdon",
          login: "bcongdon",
          bio: "bio",
          locatiob: "location",
          email: "email",
          blog: "blog",
          createdAt: moment.utc([2010, 1, 14, 15, 25, 50, 125]),
          following: 10,
          followers: 11,
          publicRespositories: 12,
          viewerIsFollowing: true,
          viewerCanFollow: true
        },
        setFollowing: {}
      }}
    />
  );

  const rendered = renderer.create(component).toJSON();
  expect(rendered).toMatchSnapshot();
});
