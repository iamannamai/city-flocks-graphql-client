import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Content,
	Card,
	CardItem,
	Text,
	H1,
	H2,
	Input,
	Button,
	List
} from 'native-base';
import TeamListItem from '../components/TeamListItem';
import { getTeamDataThunk, createTeamThunk } from '../store/team';
import { me } from '../store/user';

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
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.user.teamId !== this.props.user.teamId) {
			this.props.getTeamData(this.props.user.teamId);
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
		const { user, team } = this.props;
		return (
			<Content style={{marginTop: '20%'}}>
				<H1 style={{textAlign: 'center', fontWeight: '900'}}>
					Team
				</H1>
				<Card>
					{
						user.teamId ?
						<CardItem style={{flexDirection: 'column'}}>
							<H2>{team.name}</H2>
							<Text>
								{user.username}
							</Text>
						</CardItem>
						:
						<CardItem>
							<H2 style={{textAlign: 'center'}}>
								Create New Team
							</H2>
							<Text>Team Name:</Text>
							<Input
								placeholder="team name"
								value={this.state.teamNameInput}
								onChange={this.handleInputChange} />
							<Button onPress={() => this.createTeam()}>
								<Text>Create Team</Text>
							</Button>
						</CardItem>
					}
				</Card>

				<Card>
					<CardItem header bordered>
						<Text>
							My Teammates
						</Text>
					</CardItem>
					<CardItem>
						<Content>
							<List>
								<TeamListItem />
								<TeamListItem />
							</List>
						</Content>
					</CardItem>
				</Card>
				<Card>
					<CardItem header bordered>
						<Text>
							Search for Player
						</Text>
					</CardItem>
					<CardItem>
						<Content>
							<List>
								<TeamListItem addToTeam={true} />
								<TeamListItem addToTeam={true} />
							</List>
						</Content>
					</CardItem>
				</Card>
				<Button onPress={() => this.props.navigation.navigate('Main')}>
					<Text>Back</Text>
				</Button>
			</Content>
		);
	}
}


const mapStateToProps = state => {
	return {
		user: state.user,
		team: state.team.myTeam
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getTeamData: (teamId) => dispatch(getTeamDataThunk(teamId)),
		createTeam: (teamName) => dispatch(createTeamThunk(teamName)),
		getUserData: () => dispatch(me())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamScreen);
