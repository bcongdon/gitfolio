import React from "react";
import { Text, Button, Icon, Card, CardItem, H3, Spinner } from "native-base";
import moment from "moment";
import { Linking, StyleSheet, View } from "react-native";
import nodeEmoji from "node-emoji";
import GitHubColors from "github-colors";
import { GITHUB_DARK_GRAY } from "../constants";
import { VictoryLine } from "victory-native";
import client from "../client";

export default class RepoModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // A list of numbers which represent the average weekly number of commits to the repo
      contributionStats: []
    };
  }

  componentWillMount() {
    this.setState({ starred: this.props.viewerHasStarred });
    this.fetchCommitStats(1000);
  }

  /**
   * Fetches commit statistics from the Github API and updates component state accordingly
   * @param  {number} delay The delay to wait before trying to load commit stats again, if the request fails
   */
  fetchCommitStats(delay) {
    client.getCommitActivity(this.props.owner, this.props.name).then(resp => {
      if (resp.status == 202) {
        setTimeout(() => this.fetchCommitStats(1000 * 1.5), delay);
        return;
      }

      const days = resp.data
        .map(week => week.days.reduce((acc, val) => acc + val), 0)
        .map(weekSum => weekSum / 7);
      this.setState({ contributionStats: days });
    });
  }

  /**
   * Renders an icon tag for a repository
   * @param  {Object} iconOpts Options object to apply to the icon
   * @param  {String} text     Text to display next to the icon
   */
  getRepoIconTag(iconOpts, text) {
    return (
      <Text>
        <Icon {...iconOpts} /> {text}
      </Text>
    );
  }

  /**
   * Renders an icon tag for the provided language
   * @param  {String} language The language
   */
  getLanguageTag(language) {
    const color = GitHubColors.get(language);
    if (!language || !color) {
      return null;
    }

    return this.getRepoIconTag(
      {
        style: { color: color.color, fontSize: 16 },
        type: "MaterialCommunityIcons",
        name: "checkbox-blank-circle"
      },
      language
    );
  }

  /**
   * Renders an icon tag with the provided number of stars
   * @param  {number} stars The number of stars
   */
  getStarsTag(stars) {
    return this.getRepoIconTag(
      {
        style: { fontSize: 16 },
        type: "Octicons",
        name: "star",
        ios: "star"
      },
      stars
    );
  }

  /**
   * Renders an icon tag with the provided number of forks
   * @param  {number} forks The number of forks
   */
  getForksTag(forks) {
    return this.getRepoIconTag(
      {
        style: { fontSize: 16 },
        type: "Octicons",
        name: "repo-forked",
        ios: "repo-forked"
      },
      forks
    );
  }

  /**
   * Renders an icon tag with the the given updated date
   * @param  {Date} pushed_at The "updated_at" date of the repo
   */
  getUpdatedTag(pushed_at) {
    return this.getRepoIconTag(
      {
        style: { fontSize: 16 },
        type: "Octicons",
        name: "calendar",
        ios: "calendar"
      },
      moment(pushed_at).fromNow()
    );
  }

  /**
   * Renders the "star" button for the repo modal
   * @param  {boolean} starred Whether or not the user has starred this repo
   */
  getStarButton(starred) {
    let buttonText = starred ? "Unstar" : "Star";
    return (
      <Button
        style={{ borderColor: GITHUB_DARK_GRAY }}
        small
        iconLeft
        dark
        bordered
        onPress={() => this.toggleRepoStar()}
      >
        <Text style={{ color: GITHUB_DARK_GRAY }}>{buttonText}</Text>
      </Button>
    );
  }

  /**
   * Toggle whether or not the user is starring the current repo
   */
  toggleRepoStar() {
    this.props.onSetStarred(!this.state.starred);
    this.setState({ starred: !this.state.starred });
  }

  /**
   * Renders a button to view the repo in the Github mobile website
   */
  getViewButton() {
    return (
      <Button
        style={{ borderColor: GITHUB_DARK_GRAY, marginRight: 10 }}
        small
        iconLeft
        dark
        bordered
        onPress={() => Linking.openURL(this.props.url)}
      >
        <Text style={{ color: GITHUB_DARK_GRAY }}>{"View"}</Text>
      </Button>
    );
  }

  /**
   * Renders a VictoryLine chart with the contribution statistics
   */
  getCommitsChart() {
    // Return a spinner if no contribution stats have been loaded
    if (this.state.contributionStats.length == 0) {
      return (
        <View style={styles.container}>
          <Spinner />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <VictoryLine
          height={200}
          interpolation="cardinal"
          style={{
            data: { stroke: "#d6ecb2" }
          }}
          data={this.state.contributionStats.map((val, idx) => {
            return { x: idx, y: val };
          })}
        />
      </View>
    );
  }

  /**
   * Renders a repository as a ListItem
   */
  render() {
    // Conditionally render fields as necessary
    let languageTag = this.props.language
      ? this.getLanguageTag(this.props.language)
      : null;
    let starsTag =
      this.props.stars > 0 ? this.getStarsTag(this.props.stars) : null;
    let forksTag =
      this.props.forks > 0 ? this.getForksTag(this.props.forks) : null;

    return (
      <Card style={{ flex: 0.5 }}>
        <CardItem>
          <Text>
            <H3>{this.props.name}</H3>
            {"\n"}

            <Text note>{nodeEmoji.emojify(this.props.description)}</Text>
            {"\n\n"}

            {languageTag}
            {languageTag ? "  " : null}

            {starsTag}
            {starsTag ? "  " : null}

            {forksTag}
            {forksTag ? "  " : null}

            {this.getUpdatedTag(this.props.pushedAt)}
          </Text>
        </CardItem>
        <CardItem>{this.getCommitsChart()}</CardItem>
        <CardItem>
          {this.getViewButton()}
          {this.getStarButton(this.state.starred)}
        </CardItem>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25
  }
});
