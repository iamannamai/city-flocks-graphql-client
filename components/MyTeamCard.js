import React from 'react';
import { Card, CardItem, Content, List, Spinner, Text } from 'native-base';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import TeamListItem from './TeamListItem';

const teamQuery = teamId => gql`
	{
		team(id: ${teamId}) {
			name
			users {
				id
				username
			}
		}
	}
`;

const MyTeamCard = props => {
  const { teamId } = props;
  return (
    <Query query={teamQuery(teamId)}>
      {
        ({ loading, error, data }) => {
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
        }
      }
    </Query>
  );
};

export default MyTeamCard;
