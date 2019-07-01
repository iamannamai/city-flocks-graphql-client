import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  Content,
  Card,
  CardItem,
  Text,
  H1,
  H2,
  Button,
  Spinner
} from 'native-base';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';

import { getTeamDataThunk, createTeamThunk, me } from '../store';

import {
  AvailablePlayersCard,
  CreateTeamForm,
  MyTeamCard
} from '../components';

const USERID_QUERY = gql`
  query UserById($userId: ID!) {
    user(id: $userId) {
      id
      username
      team {
        id
        name
        __typename
      }
      __typename
    }
  }
`;

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
    const { user, navigation } = this.props;
    // const { id: userId } = user;
    return (
      <Query query={USERID_QUERY} variables={{ userId: user.id }}>
        {({ data, error, loading, variables }) => {
          if (error) return <Text>{error}</Text>;
          if (loading) return <Spinner />;
          console.log(variables);
          const { id: myId, team, username } = data.user;
          const { id: teamId, name: teamName } = team;

          return (
            <Content style={{ marginTop: '20%' }}>
              <H1 style={{ textAlign: 'center', fontWeight: '900' }}>Team</H1>
              {teamId ? (
                <Fragment>
                  <Card>
                    <CardItem style={{ flexDirection: 'column' }}>
                      {/* replace this with user - team, or team request from server */}
                      <H2>{teamName}</H2>
                      <Text>{username}</Text>
                    </CardItem>
                  </Card>
                  <MyTeamCard teamId={teamId} />
                  <AvailablePlayersCard teamId={teamId} />
                </Fragment>
              ) : (
                <Card>
                  {/* Pass in a refetch function to refetch user data? */}
                  <CreateTeamForm createTeam={this.createTeam} userId={myId} />
                </Card>
              )}

              <Button onPress={() => navigation.navigate('Main')}>
                <Text>Back</Text>
              </Button>
            </Content>
          );
        }}
      </Query>
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
