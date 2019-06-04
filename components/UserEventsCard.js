import React from 'react';
import { TouchableOpacity } from 'react-native';
import {
  Body,
  Card,
  CardItem,
  Content,
  Icon,
  Left,
  List,
  ListItem,
  Right,
  Text
} from 'native-base';
import EventsListItem from './EventsListItem';

const UserEventsCard = props => {
  const {events, handleShowModal, navigate} = props;
  return (
    <Card>
      <CardItem header bordered>
        <Text>Events</Text>
      </CardItem>
      <CardItem>
        <Content>
          <List>
            {events.length > 0 ? (
              events.map(event => (
                <EventsListItem
                  key={event.id}
                  event={event}
                  handleOnPress={handleShowModal}
                />
              ))
            ) : (
              <ListItem>
                <Body>
                  <Text note>Your team is not signed up for any events</Text>
                </Body>
              </ListItem>
            )}
          </List>
        </Content>
      </CardItem>
      <TouchableOpacity onPress={() => navigate('Events')}>
        <CardItem thumbnail>
          <Left>
            <Icon type="Entypo" name="open-book" />
            <Text>View More!!!</Text>
          </Left>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </CardItem>
      </TouchableOpacity>
    </Card>
  );
};

export default UserEventsCard;
