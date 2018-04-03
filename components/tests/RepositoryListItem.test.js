import { ListItem } from "native-base";
import RepositoryListItem from "../RepositoryListItem";
import React from "react";

import renderer from "react-test-renderer";

it("renders without crashing", () => {
  let component = (
    <RepositoryListItem
      name="repo"
      language="Python"
      description="a repo"
      stars={2}
      forks={10}
      viewerHasStarred={false}
    />
  );

  const rendered = renderer.create(component).toJSON();
  expect(rendered).toBeTruthy();
});

it("should snapshot correctly with forks and stars", () => {
  let component = (
    <RepositoryListItem
      name="repo"
      language="Python"
      description="a repo"
      stars={2}
      forks={10}
      viewerHasStarred={false}
    />
  );

  const rendered = renderer.create(component).toJSON();
  expect(rendered).toMatchSnapshot();
});

it("should snapshot correctly without stars", () => {
  let component = (
    <RepositoryListItem
      name="repo"
      language="Python"
      description="a repo"
      stars={0}
      forks={10}
      viewerHasStarred={false}
    />
  );

  const rendered = renderer.create(component).toJSON();
  expect(rendered).toMatchSnapshot();
});

it("should snapshot correctly without forks", () => {
  let component = (
    <RepositoryListItem
      name="repo"
      language="Python"
      description="a repo"
      stars={2}
      forks={10}
      viewerHasStarred={false}
    />
  );

  const rendered = renderer.create(component).toJSON();
  expect(rendered).toMatchSnapshot();
});

it("calls onPress when pressed", () => {
  const onPress = jest.fn();
  let component = (
    <RepositoryListItem
      name="repo"
      language="Python"
      description="a repo"
      stars={2}
      forks={10}
      viewerHasStarred={false}
      url={"repo.example.com"}
      onPress={onPress}
    />
  );

  const rendered = renderer.create(component).root;
  const listItem = rendered.findByType(ListItem);
  listItem.props.onPress();
  expect(onPress).toBeCalled();
});
