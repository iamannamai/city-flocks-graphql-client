import React from 'react';
import { Body, Text, ListItem, Left, Thumbnail, Button } from 'native-base';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { avataaars } from '../assets/images/avataaars';

// TODO: refactor into graphql file. This query is also in AvailablePlayersCard.js
const GET_AVAILABLE_USERS = gql`
  query GetAvailableUsers {
    availableUsers {
      id
      username
      __typename
    }
  }
`;

// TODO: refactor into graphql file. This query is also in MyTeamCard.js
export const TEAM_USERS_FRAG = gql`
  fragment myTeam on Team {
    users {
      id
      username
      __typename
    }
    __typename
  }
`;

const ADD_TO_TEAM = gql`
  mutation AddToTeam($teamId: ID!, $userId: ID!) {
    addUserToTeam(teamId: $teamId, userId: $userId) {
      id
      username
      __typename
    }
  }
`;

export default function TeamListItem(props) {
  const { teamId, userId, addToTeam, user } = props;
  return (
    <Mutation
      mutation={ADD_TO_TEAM}
      // update availableUsers (or just refetch?)
      update={(cache, { data: { addUserToTeam }, error }) => {
        const FRAG_ID = `Team_${teamId}`;
        const { availableUsers } = cache.readQuery({
          query: GET_AVAILABLE_USERS
        });
        const team = cache.readFragment({
          id: FRAG_ID,
          fragment: TEAM_USERS_FRAG
        });

        cache.writeQuery({
          query: GET_AVAILABLE_USERS,
          data: {
            availableUsers: availableUsers.filter(
              user => user.id !== addUserToTeam.id
            )
          }
        });
        cache.writeFragment({
          id: FRAG_ID,
          fragment: TEAM_USERS_FRAG,
          data: {
            __typename: team.__typename,
            users: [...team.users, addUserToTeam]
          }
        });
      }}
      variables={{
        teamId,
        userId
      }}
    >
      {(addUserToTeam, { loading, error, data }) => {
        return (
          <ListItem avatar>
            <Left>
              <Thumbnail source={avataaars[props.user.id % 17]} />
            </Left>
            <Body>
              <Text>{user.username}</Text>
              {/* check if button should be rendered, since component is reused */}
              {addToTeam ? (
                <Button small onPress={() => addUserToTeam()}>
                  <Text>Add</Text>
                </Button>
              ) : null}
            </Body>
          </ListItem>
        );
      }}
    </Mutation>
  );
}
