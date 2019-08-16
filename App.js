import React from 'react';
import { Provider } from 'react-redux';

import { Platform, StatusBar, StyleSheet, View, Image } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import { Root } from 'native-base';

import store from './store';
import TaskManager from './taskManager';
import socket from './socket';
import AppNavigator from './navigation/AppNavigator';
import Layout from './constants/Layout';
import { avataaars } from './assets/images/avataaars';
import { BASE_URL } from './constants/constants';

// Apollo GraphQL Implementation
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';

const httpLink = createHttpLink({
  uri: BASE_URL + '/graphql',
  credentials: 'include'
});

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message));
});

const client = new ApolloClient({
  link: errorLink.concat(httpLink),
  cache: new InMemoryCache({
    // To normalize the data so any node can be fetched from apollo cache no matter which query initiated the read
    dataIdFromObject: object => `${object.__typename}_${object.id}`
  }),
  addTypename: true
});

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
        <View style={styles.splashContainer}>
          <Image
            source={require('./assets/images/splash.png')}
            onLoad={this._loadResourcesAsync}
            onError={this._handleLoadingError}
            style={{ resizeMode: 'contain', width: Layout.window.width }}
          />
        </View>
      );
    } else {
      return (
        <Provider store={store}>
          <ApolloProvider client={client}>
            <Root>
              <View style={styles.container}>
                {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                <AppNavigator />
              </View>
            </Root>
          </ApolloProvider>
        </Provider>
      );
    }
  }

  _loadSplashResourcesAsync = () => {
    return Asset.loadAsync(require('./assets/images/splash.png'));
  };

  _loadResourcesAsync = async () => {
    await Promise.all([
      Asset.loadAsync(avataaars),
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
