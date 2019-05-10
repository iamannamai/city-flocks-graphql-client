import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import AuthNavigator from '../screens/SignInScreen';
import UserScreen from '../screens/UserScreen';
import EventsScreen from '../screens/EventsScreen';
import GameMapViewScreen from '../screens/GameMapViewScreen';

export default createAppContainer(
	createSwitchNavigator(
		{
			// You could add another route here for authentication.
			// Read more at https://reactnavigation.org/docs/en/auth-flow.html
			AuthLoading: AuthLoadingScreen,
			Auth: AuthNavigator,
			Main: UserScreen,
			Events: EventsScreen,
			GameMap: GameMapViewScreen
		},
		{
			initialRouteName: 'AuthLoading'
		}
	)
);
