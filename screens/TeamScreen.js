import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Content, Card, CardItem, Text, H1, H2, Button } from 'native-base';
import _ from 'lodash';

import { getTeamDataThunk, createTeamThunk, me } from '../store';

import {
  AvailablePlayersCard,
  CreateTeamForm,
  MyTeamCard
} from '../components';

class TeamScreen extends Component {
  componentDidUpdate(prevProps) {
    let userChangedTeam = prevProps.user.teamId !== this.props.user.teamId;
    let teamDataChanged = !_.isEqual(
      prevProps.team.users,
      this.props.team.users
    );
    if (userChangedTeam || teamDataChanged) {
      this.props.getTeamData(this.props.user.teamId);
    }
  }

  async createTeam(teamName) {
    await this.props.createTeam(teamName);
    this.props.getUserData();
  }

  render() {
    const { user, team } = this.props;
    return (
      <Content style={{ marginTop: '20%' }}>
        <H1 style={{ textAlign: 'center', fontWeight: '900' }}>Team</H1>
        <Card>
          {user.teamId ? (
            <CardItem style={{ flexDirection: 'column' }}>
              {/* replace this with user - team, or team request from server */}
              <H2>{team.name}</H2>
              <Text>{user.username}</Text>
            </CardItem>
          ) : (
            <CreateTeamForm createTeam={this.createTeam} userId={user.id} />
          )}
        </Card>

        <MyTeamCard teamId={this.props.user.teamId} />

        <AvailablePlayersCard teamId={user.teamId} />

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
    team: state.team.myTeam // currently only used to update users and for user's team name
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTeamData: teamId => dispatch(getTeamDataThunk(teamId)),
    createTeam: teamName => dispatch(createTeamThunk(teamName)),
    getUserData: () => dispatch(me())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamScreen);
