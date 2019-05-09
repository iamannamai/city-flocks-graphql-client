import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Card, CardItem, Header, H2, List, Content, Icon, Left, Body } from 'native-base';

import { getEventsThunk, setSelectedEvent } from '../store/event';
import EventsListItem from '../components/EventsListItem';
import SingleEventModal from '../components/SingleEventModal';

class EventsScreen extends Component {
  state = {
    isModalVisible: false
  };
  componentDidMount() {
    this.props.getEvents();
  }

  render() {
    let { allEvents } = this.props.events;

    return (
      <Content>
        {this.state.isModalVisible && (
          <SingleEventModal
            isModalVisible={this.state.isModalVisible}
            hideModal={this._hideModal}
          />
        )}
        <Header style={{ marginVertical: 50 }}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('Main')}
            >
              <Icon name="arrow-back" />
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
                    <EventsListItem
                      key={event.id}
                      event={event}
                      handleOnPress={this._showModal}
                      buttonText="Join" />
                  ))}
              </List>
            </Content>
          </CardItem>
        </Card>
      </Content>
    );
  }

  _showModal = eventId => {
    this.props.setSelectedEvent(eventId);
    this.setState({ isModalVisible: true });
  };

  _hideModal = () => {
    this.setState({ isModalVisible: false });
  };
}

const mapState = state => {
  return {
    events: state.event
  };
};

const mapDispatch = dispatch => {
  return {
    getEvents: () => dispatch(getEventsThunk()),
    setSelectedEvent: id => dispatch(setSelectedEvent(id))
  };
};

export default connect(
  mapState,
  mapDispatch
)(EventsScreen);
