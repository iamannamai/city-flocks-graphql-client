import React from 'react';
import { Card, CardItem, Content, H3, Icon, Left, Right, Text } from 'native-base';

const ManageTeamCard = props => {
  const { team, handleLeaveTeam, navigate } = props;
  return (
    <Content>
      <Card>
        <CardItem header bordered>
          <Text>Team</Text>
        </CardItem>
        <CardItem>
          <H3>{team && team.name}</H3>
        </CardItem>
        <CardItem>
          <Left>
            <Icon type="FontAwesome" name="group" />
            <Text onPress={() => navigate('Teams')}>Manage teammates</Text>
          </Left>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </CardItem>
        <CardItem>
          <Left>
            <Icon type="FontAwesome" name="sign-out" />
            <Text onPress={handleLeaveTeam}>Leave Team</Text>
          </Left>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </CardItem>
      </Card>
    </Content>
  );
};

export default ManageTeamCard;
