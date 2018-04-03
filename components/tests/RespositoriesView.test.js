import RepositoriesView from "../RepositoriesView";
import React from "react";

import renderer from "react-test-renderer";

it("renders without crashing", () => {
  let component = <RepositoriesView repos={[]} />;

  const rendered = renderer.create(component).toJSON();
  expect(rendered).toBeTruthy();
});

it("should pass snapshot test", () => {
  let component = (
    <RepositoriesView
      repos={[
        { name: "test repo", description: "foo bar", owner: { login: "foo" } }
      ]}
    />
  );

  const rendered = renderer.create(component).toJSON();
  expect(rendered).toMatchSnapshot();
});
