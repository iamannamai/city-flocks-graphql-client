import React from 'react';
import { Card, CardItem, Content, List, Spinner, Text } from 'native-base';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import TeamListItem, { TEAM_USERS_FRAG } from './TeamListItem';

export const TEAM_QUERY = gql`
  query Team($teamId: ID!) {
    team(id: $teamId) {
      id
      name
      ...myTeam
      __typename
    }
  }
  ${TEAM_USERS_FRAG}
`;

const MyTeamCard = props => {
  const { teamId } = props;
  return (
    <Query query={TEAM_QUERY} pollInterval={60000} variables={{ teamId }}>
      {({ loading, error, data }) => {
        if (loading) return <Spinner />;
        if (error) return <Text>{error}</Text>;

        return (
          <Card>
            <CardItem header bordered>
              <Text>My Team Members</Text>
            </CardItem>
            <CardItem>
              <Content>
                <List>
                  {data.team.users.map(teammate => (
                    <TeamListItem key={teammate.id} user={teammate} />
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

export default MyTeamCard;
