import SearchView from "../SearchView";
import React from "react";
import { Tabs, Spinner, Picker } from "native-base";
import client from "../../client";
import UserListView from "../UserListView";
import RepositoriesView from "../RepositoriesView";

import renderer from "react-test-renderer";

it("renders without crashing", () => {
  let component = <SearchView navigate={{}} />;

  const rendered = renderer.create(component).toJSON();
  expect(rendered).toBeTruthy();
});

it("should pass snapshot test", () => {
  let component = <SearchView navigate={{}} />;

  const rendered = renderer.create(component).toJSON();
  expect(rendered).toMatchSnapshot();
});

it("should change tabs correctly", () => {
  let component = <SearchView navigate={{}} />;
  const rendered = renderer.create(component).root;

  rendered.findByType(Tabs).props.onChangeTab({ i: 1 });
  expect(rendered.instance.state.searchType).toEqual("repos");

  rendered.findByType(Tabs).props.onChangeTab({ i: 0 });
  expect(rendered.instance.state.searchType).toEqual("users");
});

it("should display spinner when loading", () => {
  let component = <SearchView navigate={{}} />;
  const rendered = renderer.create(component).root;

  rendered.instance.setState({ loadingUsers: true });
  expect(rendered.findByType(Spinner)).toBeTruthy();

  rendered.findByType(Tabs).props.onChangeTab({ i: 1 });

  rendered.instance.setState({ loadingRepos: true });
  expect(rendered.findByType(Spinner)).toBeTruthy();
});

it("should display message when no results found", () => {
  let component = <SearchView navigate={{}} />;
  const rendered = renderer.create(component);
  rendered.root.instance.setState({ hasSearched: true });

  expect(rendered.toJSON()).toMatchSnapshot();
});

it("should display user results correctly", () => {
  let component = <SearchView navigate={{}} />;
  const rendered = renderer.create(component).root;

  const exampleUser = { name: "benjamin", login: "bcongdon" };
  rendered.instance.setState({
    hasSearched: true,
    userSearchResults: [exampleUser]
  });

  expect(rendered.findByType(UserListView)).toBeTruthy();
  expect(rendered.findByType(UserListView).instance.props.users[0]).toEqual(
    exampleUser
  );
});

it("should display repo results correctly", () => {
  let component = <SearchView navigate={{}} />;
  const renderTree = renderer.create(component);
  let rendered = renderTree.root;

  const exampleRepo = { name: "repo", owner: { login: "bcongdon" } };
  rendered.instance.setState({
    hasSearched: true,
    repoSearchResults: [exampleRepo]
  });

  renderTree.root.findByType(Tabs).instance.goToPage(1);
  jest.runAllTicks();

  expect(rendered.findByType(RepositoriesView)).toBeTruthy();
  expect(rendered.findByType(RepositoriesView).instance.props.repos[0]).toEqual(
    exampleRepo
  );
});

it("should display filter picker correctly", () => {
  let component = <SearchView navigate={{}} />;
  const renderTree = renderer.create(component);
  let rendered = renderTree.root;

  let picker = rendered.findByType(Picker);
  expect(picker).toBeTruthy();
  expect(picker.instance.props.children.length).toEqual(3);

  let child = picker.instance.props.children[1];
  expect(child.props.label).toEqual("Followers (ascending)");

  rendered.instance.setState({
    searchType: "repos"
  });
  jest.runAllTicks();

  picker = rendered.findByType(Picker);
  expect(picker).toBeTruthy();
  expect(picker.instance.props.children.length).toEqual(3);

  child = picker.instance.props.children[1];
  expect(child.props.label).toEqual("Stars (ascending)");
});

it("should update search filters correctly", () => {
  let component = <SearchView navigate={{}} />;
  const renderTree = renderer.create(component);
  let rendered = renderTree.root;

  rendered.instance.updateFilterType("foo");
  expect(rendered.instance.state.userSearchFilter).toEqual("foo");

  rendered.instance.setState({ searchType: "repos" });
  rendered.instance.updateFilterType("bar");
  expect(rendered.instance.state.repoSearchFilter).toEqual("bar");
});

it("correctly call API when search is requested", () => {
  client.searchUsers = jest.genMockFn().mockReturnValue(new Promise(() => {}));
  client.searchRepos = jest.genMockFn().mockReturnValue(new Promise(() => {}));

  let component = <SearchView navigate={{}} />;
  const renderTree = renderer.create(component);
  let rendered = renderTree.root;

  rendered.instance.setState({ query: "test query" });
  rendered.instance.onSearch();

  expect(client.searchUsers).toBeCalled();
  expect(client.searchUsers.mock.calls[0][0]).toEqual(
    "test query sort:relevance"
  );

  expect(client.searchRepos).toBeCalled();
  expect(client.searchRepos.mock.calls[0][0]).toEqual(
    "test query sort:relevance"
  );
});
