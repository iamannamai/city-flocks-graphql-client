import React from 'react';
import { Button, Card, CardItem, Left, Right, Text } from 'native-base';
import Countdown from './Countdown';

const ActiveEventCard = props => {
  const {
    endTime,
    handleEndGame,
    handleResumeGame
  } = props;
  return (
    <Card>
      <CardItem style={{ backgroundColor: '#4dad4a' }}>
        <Left>
          <Countdown
            endTime={endTime}
            handleExpire={handleEndGame}
            styling={{
              fontSize: 10,
              flex: 0,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          />
          <Text>Your team has an active event!</Text>
        </Left>
        <Right>
          <Button success outline onPress={handleResumeGame} thumbnail>
            <Text>Resume</Text>
          </Button>
        </Right>
      </CardItem>
    </Card>
  );
};

export default ActiveEventCard;
