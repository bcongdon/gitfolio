import React from "react";
import { List, Container, Content } from "native-base";
import RepositoryListItem from "./RepositoryListItem";
import RepoModal from "./RepoModal";
import Modal from "react-native-modal";
import { View } from "react-native";
/*
  RepositoriesView is the component that displays a users list of public repositories
 */
export default class RepositoriesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedRepo: -1
    };
  }

  /**
   * Renders a single repo ListItem
   * @param  {object} repo The repo object
   */
  renderRepo(repo, idx) {
    let key = `${repo.name}|${repo.owner.login}`;

    return (
      <RepositoryListItem
        key={key}
        name={repo.name}
        description={repo.description}
        language={repo.primaryLanguage ? repo.primaryLanguage.name : 0}
        stars={repo.stargazers ? repo.stargazers.totalCount : 0}
        viewerHasStarred={repo.viewerHasStarred}
        pushedAt={repo.pushedAt}
        url={repo.url}
        owner={repo.owner}
        onSetStarred={newVal =>
          this.props.setStarred(repo.owner.login, repo.name, newVal)
        }
        onPress={() => this.onRepoClick(idx)}
      />
    );
  }

  /**
   * Opens the repository modal for the specified repo
   * @param  {number} repoIdx Index of the clicked repo
   */
  onRepoClick(repoIdx) {
    this.setState({
      modalVisible: true,
      selectedRepo: repoIdx
    });
  }

  /**
   * Renders a repository modal for the provided repo
   * @param  {object} repo The object representing the repo for the modal
   */
  renderRepoModal(repo) {
    if (!repo) {
      return <View />;
    }

    return (
      <RepoModal
        name={repo.name}
        description={repo.description}
        language={repo.primaryLanguage ? repo.primaryLanguage.name : 0}
        stars={repo.stargazers ? repo.stargazers.totalCount : 0}
        viewerHasStarred={repo.viewerHasStarred}
        pushedAt={repo.pushedAt}
        url={repo.url}
        owner={repo.owner}
        onSetStarred={newVal =>
          this.props.setStarred(repo.owner.login, repo.name, newVal)
        }
      />
    );
  }

  /**
   * Renders the list of repositories
   */
  render() {
    return (
      <Container>
        <Content>
          <List>
            {this.props.repos.map((item, idx) => this.renderRepo(item, idx))}
          </List>
        </Content>
        <Modal
          isVisible={this.state.modalVisible}
          onBackdropPress={() => this.setState({ modalVisible: false })}
        >
          {this.renderRepoModal(this.props.repos[this.state.selectedRepo])}
        </Modal>
      </Container>
    );
  }
}
