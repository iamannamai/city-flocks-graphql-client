import React from 'react';
import { Button, Card, CardItem, H2, Text, Thumbnail } from 'native-base';

import { avataaars } from '../assets/images/avataaars';

const UserMainCard = (props) => {
  const {user, team, handleSignout} = props;
  return (
    <Card style={{ paddingTop: 32 }}>
      <CardItem
        style={{
          flexDirection: 'column'
        }}
      >
        <Thumbnail
          source={avataaars[user.id % 17]}
          style={{ width: 200, height: 200 }}
        />
        <H2>{`Welcome Back ${user.username}!`}</H2>
        <Text>{team && team.myTeam.name}</Text>
      </CardItem>
      <CardItem style={{ justifyContent: 'center' }}>
        <Button onPress={handleSignout}>
          <Text>Sign out</Text>
        </Button>
      </CardItem>
    </Card>
  );
};

export default UserMainCard;
