import NotificationsListView from "../NotificationsListView";
import React from "react";
import { Spinner, ListItem } from "native-base";
import client from "../../client";

import renderer from "react-test-renderer";

it("renders without crashing", () => {
  let component = <NotificationsListView />;

  const rendered = renderer.create(component).toJSON();
  expect(rendered).toBeTruthy();
});

it("calls API on component mount", () => {
  client.getNotifications = jest
    .genMockFn()
    .mockReturnValue(new Promise(() => {}));

  let component = <NotificationsListView />;
  renderer.create(component);

  expect(client.getNotifications).toBeCalled();
  expect(client.getNotifications.mock.calls.length).toEqual(1);
});

it("should pass snapshot test with notifications", () => {
  let component = <NotificationsListView />;

  let dummyNotification = {
    subject: {
      type: "Issue",
      title: "Issue title"
    },
    repository: { full_name: "some_repo" },
    id: 123
  };

  const renderTree = renderer.create(component);
  const rendered = renderTree.root;
  rendered.instance.setState({
    notifications: [dummyNotification],
    loading: false
  });

  jest.runAllTicks();
  const list = rendered.findByType(ListItem);

  expect(list).toBeTruthy();
  expect(renderTree.toJSON()).toMatchSnapshot();
});

it("should display a loading spinner on mount", () => {
  let component = <NotificationsListView />;
  const renderTree = renderer.create(component);
  let rendered = renderTree.root;

  expect(rendered.instance.state.loading).toBeTruthy();
  expect(rendered.findByType(Spinner)).toBeTruthy();
});
