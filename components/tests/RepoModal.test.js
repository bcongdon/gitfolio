import { Spinner } from "native-base";
import RepoModal from "../RepoModal";
import React from "react";
import client from "../../client";
import { VictoryLine } from "victory-native";

import renderer from "react-test-renderer";

const createDummyEndpoint = () =>
  jest.genMockFn().mockReturnValue(new Promise(() => {}));

it("renders without crashing", () => {
  client.getCommitActivity = createDummyEndpoint();
  let component = (
    <RepoModal
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
  client.getCommitActivity = createDummyEndpoint();
  let component = (
    <RepoModal
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
  client.getCommitActivity = createDummyEndpoint();
  let component = (
    <RepoModal
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
  client.getCommitActivity = createDummyEndpoint();
  let component = (
    <RepoModal
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

it("requests commit activity on mount", () => {
  client.getCommitActivity = createDummyEndpoint();
  let component = (
    <RepoModal
      name="repo"
      language="Python"
      description="a repo"
      owner={{ login: "owner" }}
      stars={2}
      forks={10}
      viewerHasStarred={false}
    />
  );

  renderer.create(component).root;
  expect(client.getCommitActivity).toBeCalled();
  expect(client.getCommitActivity.mock.calls[0][0]).toEqual({ login: "owner" });
  expect(client.getCommitActivity.mock.calls[0][1]).toEqual("repo");
});

it("renders spinner while waiting for commit activity", () => {
  client.getCommitActivity = createDummyEndpoint();
  let component = (
    <RepoModal
      name="repo"
      language="Python"
      description="a repo"
      owner={{ login: "owner" }}
      stars={2}
      forks={10}
      viewerHasStarred={false}
    />
  );

  const rendered = renderer.create(component).root;
  expect(rendered.findByType(Spinner)).toBeTruthy();
});

it("renders VictoryLine after receiving commit activity", () => {
  client.getCommitActivity = createDummyEndpoint();
  let component = (
    <RepoModal
      name="repo"
      language="Python"
      description="a repo"
      owner={{ login: "owner" }}
      stars={2}
      forks={10}
      viewerHasStarred={false}
    />
  );

  const rendered = renderer.create(component).root;
  rendered.instance.setState({ contributionStats: [1, 2, 3] });
  jest.runAllTicks();

  expect(rendered.findByType(VictoryLine)).toBeTruthy();
});
