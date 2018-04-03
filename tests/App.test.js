import App from "../App";
import React from "react";
import client from "../client";

import renderer from "react-test-renderer";

it("renders without crashing", () => {
  client.getProfile = jest.fn();
  const rendered = renderer.create(<App />).toJSON();
  expect(rendered).toBeTruthy();
});
