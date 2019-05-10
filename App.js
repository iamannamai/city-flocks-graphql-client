import React from 'react';
import { Provider } from 'react-redux';

import { Platform, StatusBar, StyleSheet, View, Image } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import { Root } from 'native-base';

import store from './store';
import AppNavigator from './navigation/AppNavigator';

export default class App extends React.Component {
  state = {
    isSplashReady: false,
    isLoadingComplete: false
  };

  render() {
    if (!this.state.isSplashReady) {
      return (
        <AppLoading
          startAsync={this._loadSplashResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={() => this.setState({ isSplashReady: true })}
        />
      );
    } else if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <View
          style={styles.splashContainer}
        >
          <Image
            source={require('./assets/images/splash.png')}
            onLoad={this._loadResourcesAsync}
            onError={this._handleLoadingError}
          />
        </View>
      );
    } else {
      return (
        <Provider store={store}>
          <Root>
            <View style={styles.container}>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <AppNavigator />
            </View>
          </Root>
        </Provider>
      );
    }
  }

  _loadSplashResourcesAsync = () => {
    return Asset.loadAsync(require('./assets/images/splash.png'));
  };

  _loadResourcesAsync = async () => {
    await Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png')
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf')
      })
    ]);
    this.setState({ isLoadingComplete: true });
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
