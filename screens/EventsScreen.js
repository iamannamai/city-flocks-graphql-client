import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Card,
  CardItem,
  Header,
  H2,
  List,
  Content,
  Icon,
  Left,
  Body,
  Toast
} from 'native-base';
import { getEventsThunk, joinEventThunk, setSelectedEvent } from '../store/event';
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
            handleOnPress={() => this._handleJoinEvent(this.props.selectedEventId, this.props.teamId)}
            buttonText="Join Event"
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
                    />
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

  _handleJoinEvent = (eventId, teamId) => {
    this.props.joinEvent(eventId, teamId);
    this.setState({ isModalVisible: false});
    const eventName = this.props.events.allEvents.filter(event => eventId === event.id)[0].name;
    Toast.show({
      text: `You just signed your team up for ${eventName}!`,
      type: 'success',
      duration: 2000
    });
  }
}

const mapState = state => {
  return {
    events: state.event,
    selectedEventId: state.event.selectedEventId,
    teamId: state.user.teamId
  };
};

const mapDispatch = dispatch => {
  return {
    getEvents: () => dispatch(getEventsThunk()),
    setSelectedEvent: id => dispatch(setSelectedEvent(id)),
    joinEvent: (eventId, teamId) => dispatch(joinEventThunk(eventId, teamId))
  };
};

export default connect(
  mapState,
  mapDispatch
)(EventsScreen);
