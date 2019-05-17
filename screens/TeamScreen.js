import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Content, Card, CardItem, Text, H1, H2, Input, Item, Button, List } from 'native-base';
import _ from 'lodash';

import TeamListItem from '../components/TeamListItem';
import { getTeamDataThunk, createTeamThunk, getAvailableUsersThunk, addUserToTeamThunk, me } from '../store';

class TeamScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			teamNameInput: ''
		};

		this.handleInputChange = this.handleInputChange.bind(this);
	}

	componentDidMount() {
		if (this.props.user.teamId) {
			this.props.getTeamData(this.props.user.teamId);
			this.props.getAvailableUsers();
		}
	}

	componentDidUpdate(prevProps) {
		let userChangedTeam = prevProps.user.teamId !== this.props.user.teamId;
		let teamDataChanged = !_.isEqual(prevProps.team.users, this.props.team.users);
		if (userChangedTeam || teamDataChanged) {
			this.props.getTeamData(this.props.user.teamId);
			this.props.getAvailableUsers();
		}
	}

	handleInputChange(e) {
		this.setState({
			teamNameInput: e.nativeEvent.text
		});
	}

	async createTeam() {
		await this.props.createTeam(this.state.teamNameInput);
		this.props.getUserData();
	}

	render() {
		const { user, team, availableUsers } = this.props;
		return (
			<Content style={{ marginTop: '20%' }}>
				<H1 style={{ textAlign: 'center', fontWeight: '900' }}>Team</H1>
				<Card>
					{user.teamId ? (
						<CardItem style={{ flexDirection: 'column' }}>
							<H2>{team.name}</H2>
							<Text>{user.username}</Text>
						</CardItem>
					) : (
						<CardItem style={{ flexDirection: 'column' }}>
							<H2 style={{ textAlign: 'center' }}>Create New Team</H2>
							<Item regular>
								<Input
									placeholder="Enter team name"
									value={this.state.teamNameInput}
									onChange={this.handleInputChange}
								/>
							</Item>
							<Button onPress={() => this.createTeam()}>
								<Text>Create Team</Text>
							</Button>
						</CardItem>
					)}
				</Card>

				{team.users && (
					<Card>
						<CardItem header bordered>
							<Text>My Team Members</Text>
						</CardItem>
						<CardItem>
							<Content>
								<List>
									{team.users.map((teammate) => <TeamListItem key={teammate.id} user={teammate} />)}
								</List>
							</Content>
						</CardItem>
					</Card>
				)}

				{availableUsers.length > 0 && (
					<Card>
						<CardItem header bordered>
							<Text>Add a Player</Text>
						</CardItem>
						<CardItem>
							<Content>
								<List>
									{availableUsers.map((player) => (
										<TeamListItem
											key={player.id}
											addToTeam={() => this.props.addUser(user.teamId, player.id)}
											user={player}
										/>
									))}
								</List>
							</Content>
						</CardItem>
					</Card>
				)}

				<Button onPress={() => this.props.navigation.navigate('Main')}>
					<Text>Back</Text>
				</Button>
			</Content>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		team: state.team.myTeam,
		availableUsers: state.team.potentialTeammates
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getTeamData: (teamId) => dispatch(getTeamDataThunk(teamId)),
		createTeam: (teamName) => dispatch(createTeamThunk(teamName)),
		getUserData: () => dispatch(me()),
		getAvailableUsers: () => dispatch(getAvailableUsersThunk()),
		addUser: (teamId, userId) => dispatch(addUserToTeamThunk(teamId, userId))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamScreen);
