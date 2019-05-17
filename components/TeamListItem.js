import React from 'react';
import {
  Body,
  Text,
  ListItem,
  Left,
  Thumbnail,
  Button,
} from 'native-base';

import { avataaars } from '../assets/images/avataaars';

export default function TeamListItem(props) {
  return (
    <ListItem avatar>
      <Left>
        <Thumbnail source={avataaars[(props.user.id % 17) + 1]} />
      </Left>
      <Body>
        <Text>{props.user.username}</Text>
		{props.addToTeam ? (
			<Button small onPress={props.addToTeam}>
			<Text>Add</Text>
			</Button>
			) : null}
      </Body>
    </ListItem>
  );
}
