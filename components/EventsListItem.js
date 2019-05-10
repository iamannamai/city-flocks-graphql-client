import React from 'react';
import { Button, Body, Text, Icon, ListItem, Left, Right } from 'native-base';

export const EventsListItem = props => {
  const { event, handleOnPress } = props;
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
        <Button onPress={() => handleOnPress(event.id)}>
          <Text>View</Text>
        </Button>
      </Right>
    </ListItem>
  );
};

export default EventsListItem;
