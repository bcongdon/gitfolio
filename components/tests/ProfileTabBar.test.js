import ProfileTabBar from "../ProfileTabBar";
import React from "react";

import renderer from "react-test-renderer";

it("renders without crashing", () => {
  let component = <ProfileTabBar navigationState={{}} navigation={{}} />;

  const rendered = renderer.create(component).toJSON();
  expect(rendered).toBeTruthy();
});

it("should pass snapshot test", () => {
  let component = <ProfileTabBar navigationState={{}} navigation={{}} />;

  const rendered = renderer.create(component).toJSON();
  expect(rendered).toMatchSnapshot();
});
