import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TouchableHighlight, StyleSheet, View } from 'react-native';
import { MapView } from 'expo';
import { Body, Button, Container, H3, Header, Content, Footer, Right, Text } from 'native-base';
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
        isVisible={this.props.isModalVisible}
        onBackButtonPress={this.props.hideModal}
        onBackdropPress={this.props.hideModal}
        onSwipeComplete={this.props.hideModal}
        animationIn="fadeIn"
        animationOut="fadeOut"
        swipeDirection={['up', 'left', 'right', 'down']}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'stretch',
          width: '80%',
          // height: Layout.window.height * 0.5,
          marginLeft: '10%'
        }}
        backgroundColor="rgba(255,255,255,1)"
      >
        <Container
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'stretch',
            // width: Layout.window.width * 0.8,
            height: Layout.window.height * 0.6
          }}
          >
          <Header>
            <Body>
              <H3>{this.props.event.name}</H3>
            </Body>
            <Right>
              <Button small>
                <Text>{this.props.buttonText || 'Start Game'}</Text>
              </Button>
            </Right>
          </Header>
          <Content
            // contentContainerStyle={{
            //   width: Layout.window.width * 0.7,
            //   height: Layout.window.height * 0.6
            // }}
            >
            <View
              // style={{
              //   width: Layout.window.width * 0.7,
              //   height: Layout.window.width * 0.7
              // }}
            >
              <MapView
                  showsUserLocation={true}
                  style={{
                    width: Layout.window.width * 0.8,
                    height: Layout.window.width * 0.8
                  }}
                  initialRegion={{
                    latitude: 40.7054428,
                    longitude: -74.013037,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02
                  }}
                />
            </View>
            <View style={{
              paddingHorizontal: 5
            }}>
              <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',

              }}>
                <Text>{this.props.event.location}</Text>
                <Text>{`${this.props.event.duration / 60 / 60} hr`}</Text>
              </View>
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
