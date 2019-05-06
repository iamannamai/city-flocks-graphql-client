import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
	Text,
	View
} from 'react-native';

import {
	Button
} from 'native-base';

import { logout } from '../store';

class UserScreen extends Component {
	_signOutAsync = async () => {
		await this.props.logout();
		this.props.navigation.navigate('Auth');
	}

	render() {
		return (
			<View>
				<Button onPress={this._signOutAsync}>
					<Text>Sign me out :)</Text>
				</Button>


				<Text>{`Welcome Back ${this.props.user.username}`}</Text>
				<Text>Testing</Text>
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
		logout: () => dispatch(logout())
	};
};

export default connect(mapState, mapDispatch)(UserScreen);
