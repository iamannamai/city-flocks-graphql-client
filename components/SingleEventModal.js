import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TouchableHighlight, StyleSheet, View } from 'react-native';
import { MapView } from 'expo';
import { Container, Header, Content, Footer, Text } from 'native-base';
import Modal from 'react-native-modal';

import Layout from '../constants/Layout';

class SingleEventModal extends Component {
  // this.props.event is an object
  _getInitialRegion = () => {

  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        isV isible={this.props.isModalVisible}
        onRequestClose={this.props.hideModal}
      >
        <Container
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'stretch',
            // height: Layout.window.width * 0.8,
            // width: Layout.window.width * 0.8,
            // backgroundColor: 'rgba(0,0,0,0.8)',
            marginHorizontal: 'auto'
          }}
          >
          <Header>
            <Text>{this.props.event.name}</Text>
          </Header>
          <Content contentContainerStyle={{
            width: Layout.window.width * 0.8,
            height: Layout.window.height * 0.8
          }}>
            <Text>{this.props.event.name}</Text>
            <View
              style={{
                width: Layout.window.width,
                height: Layout.window.width
              }}
            >
              <MapView
                  showsUserLocation={true}
                  // style={}
                  initialRegion={{
                    latitude: 40.7054428,
                    longitude: -74.013037,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02
                  }}
                />
            </View>
            <View>
              <Text>{this.props.event.location}</Text>
              <Text>{this.props.event.description}</Text>
            </View>
          </Content>
          <Footer>
            <TouchableHighlight
              onPress={this.props.hideModal}>
              <Text>Hide</Text>
            </TouchableHighlight>
          </Footer>
        </Container>
      </Modal>
    );
  }
}

const mapState = state => ({
  event: state.event.allEvents.filter(event => event.id === state.event.selectedEventId)[0]
});

export default connect(mapState)(SingleEventModal);

const styles = StyleSheet.create({

});
