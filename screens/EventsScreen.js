import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    Button,
    Card,
    CardItem,
    Text,
    Header,
    H2,
    List,
    Content,
    Icon,
    Left,
    Body
  } from 'native-base';

import { getEventsThunk } from '../store/event';
import EventsListItem from '../components/EventsListItem';

class UserScreen extends Component {

  componentDidMount() {
    this.props.getEvents();
  }

  render() {
	let { allEvents } = this.props.events;

    return (
      <Content>
        <Header style={({marginVertical: 50})}>
            <Left>
                <Button transparent onPress={()=>this.props.navigation.navigate("Main")}>
                <Icon name='arrow-back' />
                </Button>
            </Left>
          <Body>
            <H2>All Our Events</H2>
          </Body>
        </Header>
        <Card>
          <CardItem>
            <Content>
              <List>
                {allEvents &&
                  allEvents.map(event => (
                    <EventsListItem key={event.id} event={event} />
                  ))}
              </List>
            </Content>
          </CardItem>
        </Card>
      </Content>
    );
  }
}

const mapState = state => {
  return {
	events: state.event
  };
};

const mapDispatch = dispatch => {
  return {
	getEvents: () => dispatch(getEventsThunk())
  };
};

export default connect(mapState, mapDispatch)(UserScreen);
