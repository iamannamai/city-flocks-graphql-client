import React from 'react';
import { Card, CardItem, Content, List, Text } from 'native-base';
import TeamListItem from './TeamListItem';

const AvailablePlayersCard = props => {
  const { availableUsers, handleAddUser, teamId } = props;
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
                addToTeam={() =>
                  handleAddUser(teamId, player.id)
                }
                user={player}
              />
            ))}
          </List>
        </Content>
      </CardItem>
    </Card>
  );
};

export default AvailablePlayersCard;
