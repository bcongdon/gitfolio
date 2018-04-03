import { ApolloClient } from "apollo-client";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";
import gql from "graphql-tag";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import schema from "./github_graphql_schema";
import axios from "axios";
import { AUTH_TOKEN } from "./secrets";

/**
 * authLink sets up the Authentication necessary to make requests to the Github GraphQL API
 */
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: AUTH_TOKEN ? `Bearer ${AUTH_TOKEN}` : ""
    }
  };
});

/**
 * The query for pulling a complete Github profile (user data, repos, followers / following)
 */
const PullGithubProfileQuery = gql`
  query PullGithubProfileQuery($username: String!) {
    user(login: $username) {
      name
      login
      bio
      createdAt
      location
      email
      websiteUrl
      viewerCanFollow
      viewerIsFollowing
      avatarUrl
      repositories(
        first: 100
        privacy: PUBLIC
        affiliations: OWNER
        orderBy: { direction: DESC, field: PUSHED_AT }
      ) {
        nodes {
          name
          description
          viewerHasStarred
          primaryLanguage {
            name
          }
          stargazers {
            totalCount
          }
          forkCount
          pushedAt
          owner {
            login
          }
          url
        }
        totalCount
      }
      followers(first: 100) {
        nodes {
          login
          name
          avatarUrl
          url
          viewerIsFollowing
        }
        totalCount
      }
      following(first: 100) {
        nodes {
          login
          name
          avatarUrl
          url
          viewerIsFollowing
        }
        totalCount
      }
    }
  }
`;

const SearchRepositories = gql`
  query SearchRepositories($query: String!) {
    search(query: $query, type: REPOSITORY, first: 25) {
      nodes {
        ... on Repository {
          name
          description
          viewerHasStarred
          primaryLanguage {
            name
          }
          stargazers {
            totalCount
          }
          forkCount
          description
          url
          pushedAt
          owner {
            login
          }
        }
      }
    }
  }
`;

const SearchUsers = gql`
  query SearchUsers($query: String!) {
    search(query: $query, type: USER, first: 25) {
      nodes {
        ... on User {
          name
          login
          bio
          createdAt
          location
          email
          websiteUrl
          viewerCanFollow
          viewerIsFollowing
          avatarUrl
        }
      }
    }
  }
`;

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: schema
});

const apolloClient = new ApolloClient({
  link: authLink.concat(
    createHttpLink({
      uri: "https://api.github.com/graphql"
    })
  ),
  cache: new InMemoryCache({ fragmentMatcher })
});

/**
 * Pulls a Github Profile from the Github GraphQL API
 * @param  {string} username The username of the github user to pull
 * @return {Promise}         A promise with the pulled data
 */
function getProfile(username) {
  return apolloClient.query({
    query: PullGithubProfileQuery,
    variables: { username },
    fetchPolicy: "network-only"
  });
}

function searchUsers(query) {
  return apolloClient.query({
    query: SearchUsers,
    variables: { query },
    fetchPolicy: "network-only"
  });
}

function searchRepos(query) {
  return apolloClient.query({
    query: SearchRepositories,
    variables: { query },
    fetchPolicy: "network-only"
  });
}

/**
 * Sets whether or not the current user is starting the provided repo
 * @param {string} owner    The repo owner's login
 * @param {string} repo     The repo name
 * @param {bool}   newValue Whether or not the current user should be starring the given repo
 */
function setStarringRepository(owner, repo, newValue) {
  let method = newValue ? "PUT" : "DELETE";
  return axios({
    method,
    url: `https://api.github.com/user/starred/${owner}/${repo}`,
    params: {
      access_token: AUTH_TOKEN
    }
  });
}

/**
 * Sets whether or not the current user is following the provided user
 * @param {string} user     The user to follow/unfollow
 * @param {string} newValue Whether or not the current user should be following the provided user
 */
function setFollowingUser(user, newValue) {
  let method = newValue ? "PUT" : "DELETE";
  return axios({
    method,
    url: `https://api.github.com/user/following/${user}`,
    params: {
      access_token: AUTH_TOKEN
    }
  });
}

function getNotifications() {
  return axios({
    url: `https://api.github.com/notifications`,
    params: { access_token: AUTH_TOKEN }
  });
}

function getCommitActivity(owner, repo) {
  return axios({
    url: `https://api.github.com/repos/${
      owner.login
    }/${repo}/stats/commit_activity`,
    params: { access_token: AUTH_TOKEN }
  });
}

export default {
  getProfile,
  setStarringRepository,
  setFollowingUser,
  getNotifications,
  searchRepos,
  searchUsers,
  getCommitActivity
};
