import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Content,
  Card,
  CardItem,
  Text,
  H1,
  H2,
  Button
} from 'native-base';
import _ from 'lodash';

import {
  getTeamDataThunk,
  createTeamThunk,
  getAvailableUsersThunk,
  addUserToTeamThunk,
  me
} from '../store';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { AvailablePlayersCard, CreateTeamForm, MyTeamCard } from '../components';

class TeamScreen extends Component {
  componentDidMount() {
    if (this.props.user.teamId) {
      this.props.getAvailableUsers();
    }
  }

  componentDidUpdate(prevProps) {
    let userChangedTeam = prevProps.user.teamId !== this.props.user.teamId;
    let teamDataChanged = !_.isEqual(
      prevProps.team.users,
      this.props.team.users
    );
    if (userChangedTeam || teamDataChanged) {
      this.props.getTeamData(this.props.user.teamId);
      this.props.getAvailableUsers();
    }
  }

  async createTeam() {
    await this.props.createTeam(this.state.teamNameInput);
    this.props.getUserData();
  }

  render() {
    const { user, team, availableUsers } = this.props;
    return (
      <Content style={{ marginTop: '20%' }}>
        <H1 style={{ textAlign: 'center', fontWeight: '900' }}>Team</H1>
        <Card>
					{user.teamId
						? (
							<CardItem style={{ flexDirection: 'column' }}>
								<H2>{team.name}</H2>
								<Text>{user.username}</Text>
							</CardItem>
						)
						: <CreateTeamForm createTeam={this.createTeam} />
					}
        </Card>

				<MyTeamCard
					teamId={this.props.user.teamId}
				/>

        {availableUsers.length > 0 && (
					<AvailablePlayersCard
						availableUsers={availableUsers}
						handleAddUser={this.props.addUser}
						teamId={user.teamId}
					/>
        )}

        <Button onPress={() => this.props.navigation.navigate('Main')}>
          <Text>Back</Text>
        </Button>
      </Content>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    team: state.team.myTeam,
    availableUsers: state.team.potentialTeammates
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTeamData: teamId => dispatch(getTeamDataThunk(teamId)),
    createTeam: teamName => dispatch(createTeamThunk(teamName)),
    getUserData: () => dispatch(me()),
    getAvailableUsers: () => dispatch(getAvailableUsersThunk()),
    addUser: (teamId, userId) => dispatch(addUserToTeamThunk(teamId, userId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamScreen);
