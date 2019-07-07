import React from 'react';
import { Card, CardItem, Content, List, Spinner, Text } from 'native-base';
import TeamListItem from './TeamListItem';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

export const GET_AVAILABLE_USERS = gql`
  query GetAvailableUsers {
    availableUsers {
      id
      username
      __typename
    }
  }
`;

const AvailablePlayersCard = props => {
  const { teamId } = props;
  return (
    <Query query={GET_AVAILABLE_USERS} pollInterval={60000}>
      {({ loading, error, data }) => {
        if (loading) return <Spinner />;
        if (error) return <Text>{error}</Text>;

        const { availableUsers } = data;
        return (
          <Card>
            <CardItem header bordered>
              <Text>Add a Player</Text>
            </CardItem>
            <CardItem>
              <Content>
                <List>
                  {availableUsers.map(player => (
                    <TeamListItem
                      key={player.id}
                      teamId={teamId}
                      userId={player.id}
                      user={player}
                      addToTeam={true}
                    />
                  ))}
                </List>
              </Content>
            </CardItem>
          </Card>
        );
      }}
    </Query>
  );
};

export default AvailablePlayersCard;
