import React from "react";
import { Text, Right, Button, ListItem, Left, Icon } from "native-base";
import moment from "moment";
import nodeEmoji from "node-emoji";
import GitHubColors from "github-colors";

/*
  RepositoriesView is the component that displays a users list of public repositories
 */
export default class RepositoriesListItem extends React.Component {
  componentWillMount() {
    this.setState({ starred: this.props.viewerHasStarred });
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
  getStarButton(starred, onPress) {
    let buttonType = starred ? "star" : "star-o";
    return (
      <Button transparent dark onPress={onPress}>
        <Icon
          style={{ color: "#fee067" }}
          type="FontAwesome"
          name={buttonType}
          ios={buttonType}
        />
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
      <ListItem button onPress={() => this.props.onPress()}>
        <Left>
          <Text>
            {this.props.name}
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
        </Left>
        <Right>
          {this.getStarButton(this.state.starred, () => this.toggleRepoStar())}
        </Right>
      </ListItem>
    );
  }
}
