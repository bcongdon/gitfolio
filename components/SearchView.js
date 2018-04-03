import React from "react";
import {
  Text,
  Icon,
  Container,
  Button,
  Input,
  Header,
  Item,
  Tabs,
  Tab,
  Form,
  Picker,
  Spinner
} from "native-base";
import client from "../client";
import RepositoriesView from "./RepositoriesView";
import UserListView from "./UserListView";

const USER_SEARCH_TYPE = "users";
const REPO_SEARCH_TYPE = "repos";

const USER_RELEVANCE = "sort:relevance";
const USER_FOLLOWER_ASCENDING = "sort:followers-asc";
const USER_FOLLOWER_DESCENDING = "sort:followers-desc";

const REPO_RELEVANCE = "sort:relevance";
const REPO_STAR_ASCENDING = "sort:stars-asc";
const REPO_STAR_DESCENDING = "sort:stars-desc";

/**
 * SearchView is a component to allow the user to search for Github users, and subsequently visit their profiles
 */
export default class SearchView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      searchType: USER_SEARCH_TYPE,
      userSearchFilter: USER_RELEVANCE,
      repoSearchFilter: REPO_RELEVANCE,
      userSearchResults: [],
      repoSearchResults: [],
      loadingUsers: false,
      loadingRepos: false,
      hasSearched: false
    };
  }

  /**
   * Triggers a search to the github API
   * Sends API requests to the user and repo search endpoints simultaneously.
   * Updates component state when API requests return.
   */
  onSearch() {
    this.setState({
      loadingRepos: true,
      loadingUsers: true,
      hasSearched: true,
      userSearchResults: [],
      repoSearchResults: []
    });

    let userQuery = `${this.state.query} ${this.state.userSearchFilter}`;
    client.searchUsers(userQuery).then(data => {
      this.setState({
        userSearchResults: data.data.search.nodes,
        loadingUsers: false
      });
    });

    let repoQuery = `${this.state.query} ${this.state.repoSearchFilter}`;
    client.searchRepos(repoQuery).then(data => {
      this.setState({
        repoSearchResults: data.data.search.nodes,
        loadingRepos: false
      });
    });
  }

  /**
   * Updates the currently selected search filter
   * @param  {string} newFilter The new search filter
   */
  updateFilterType(newFilter) {
    if (this.state.searchType == USER_SEARCH_TYPE) {
      this.setState({ userSearchFilter: newFilter }, this.onSearch);
    } else {
      this.setState({ repoSearchFilter: newFilter }, this.onSearch);
    }
  }

  /**
   * Renders a picker component for search filters
   * Renders based on the current searchType (users vs repos)
   */
  getFilterPicker() {
    var filters;
    if (this.state.searchType == REPO_SEARCH_TYPE) {
      filters = [
        <Item label="Relevance" key={0} value={REPO_RELEVANCE} />,
        <Item label="Stars (ascending)" key={1} value={REPO_STAR_ASCENDING} />,
        <Item label="Stars (descending)" key={2} value={REPO_STAR_DESCENDING} />
      ];
    } else {
      filters = [
        <Item label="Relevance" key={0} value={USER_RELEVANCE} />,
        <Item
          label="Followers (ascending)"
          key={1}
          value={USER_FOLLOWER_ASCENDING}
        />,
        <Item
          label="Followers (descending)"
          key={2}
          value={USER_FOLLOWER_DESCENDING}
        />
      ];
    }

    // Populate the picker with the currently selected search type
    let selectedValue =
      this.state.searchType == REPO_SEARCH_TYPE
        ? this.state.repoSearchFilter
        : this.state.userSearchFilter;

    // Render a "settings" button as the handle for the picker
    let filterButton = opts => (
      <Button transparent onPress={opts.onPress}>
        <Icon type="Octicons" name="settings" ios="settings" />
      </Button>
    );

    return (
      <Form>
        <Picker
          mode="dropdown"
          selectedValue={selectedValue}
          iosHeader="Sort Order"
          onValueChange={newFilter => this.updateFilterType(newFilter)}
          renderButton={filterButton}
        >
          {filters}
        </Picker>
      </Form>
    );
  }

  /**
   * Callback for when the child tab component switches tabs.
   * Updates component sate accordingly
   * @param  {number} tab The new tab
   */
  onChangeTab(tab) {
    if (tab === 0) {
      this.setState({ searchType: USER_SEARCH_TYPE });
    } else if (tab === 1) {
      this.setState({ searchType: REPO_SEARCH_TYPE });
    }
  }

  /**
   * Renders the view for user search results
   */
  getUserResults() {
    if (this.state.loadingUsers) {
      return <Spinner />;
    } else if (
      this.state.hasSearched &&
      this.state.userSearchResults.length == 0
    ) {
      return <Text>{"No matching users"}</Text>;
    } else {
      return (
        <UserListView
          users={this.state.userSearchResults}
          navigation={this.props.navigation}
        />
      );
    }
  }

  /**
   * Renders the view for repository search results
   */
  getRepoResults() {
    if (this.state.loadingRepos) {
      return <Spinner />;
    } else if (
      this.state.hasSearched &&
      this.state.repoSearchResults.length == 0
    ) {
      return <Text>{"No matching repos"}</Text>;
    } else {
      return <RepositoriesView repos={this.state.repoSearchResults} />;
    }
  }

  render() {
    return (
      <Container>
        <Header searchBar rounded hasTabs>
          <Item>
            <Icon name="ios-search" />
            <Input
              placeholder="Search"
              onChangeText={query => this.setState({ query })}
              autoCapitalize={"none"}
              autoCorrect={false}
              onEndEditing={() => this.onSearch()}
              clearButtonMode={"while-editing"}
            />
          </Item>
          {this.getFilterPicker()}
        </Header>
        <Tabs onChangeTab={data => this.onChangeTab(data.i)}>
          <Tab heading={"Users"}>{this.getUserResults()}</Tab>
          <Tab heading={"Repos"}>{this.getRepoResults()}</Tab>
        </Tabs>
      </Container>
    );
  }
}
