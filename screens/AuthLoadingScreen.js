import React from 'react';
import { connect } from 'react-redux';

import { ActivityIndicator, StatusBar, View } from 'react-native';

import { me } from '../store/user';

class AuthLoadingScreen extends React.Component {
  async componentDidMount() {
    await this.props.me();
    this._bootstrapAsync();
  }

  // componentDidUpdate(prevProps,prevState){
  //   console.log(this.props.user)
  //   if(this.state.getSessionAttempt)
  // }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    this.props.navigation.navigate(this.props.user.username ? 'Main' : 'Auth');
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const mapState = state => {
  return {
    user: state.user
  };
};

const mapDispatch = dispatch => {
  return {
    me() {
      dispatch(me);
    }
  };
};

export default connect(
  mapState,
  mapDispatch
)(AuthLoadingScreen);
