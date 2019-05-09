import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import {
  Button,
  Body,
  Text,
  Icon,
  ListItem,
  Left,
  Right,
} from "native-base";

export const EventsListItem = props => {
  const { event } = props;
  return (
    <ListItem thumbnail>
      <Left>
        <Icon type="MaterialIcons" name="event-note" />
      </Left>
      <Body>
        <Text>{event.name}</Text>
        <Text note>{`${event.duration / 3600} hrs`}</Text>
        <Text note numberOfLines={1}>
          {event.description}
        </Text>
      </Body>
      <Right>
        <Button>
          <Text>View</Text>
        </Button>
      </Right>
    </ListItem>
  );
};

export default EventsListItem;