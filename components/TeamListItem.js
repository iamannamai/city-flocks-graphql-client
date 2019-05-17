import React from 'react';
import {
  Body,
  Text,
  ListItem,
  Left,
  Thumbnail,
  Right,
  Button
} from 'native-base';

import { avataaars } from '../assets/images/avataaars';

export default function TeamListItem(props) {
  return (
    <ListItem avatar>
      <Left>
        <Thumbnail source={avataaars[props.user.id]} />
      </Left>
      <Body>
        <Text>{props.user.username}</Text>
      </Body>
      {props.addToTeam ? (
        <Right>
          <Button onPress={props.addToTeam}>
            <Text>Add</Text>
          </Button>
        </Right>
      ) : null}
    </ListItem>
  );
}
