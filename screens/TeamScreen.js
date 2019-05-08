import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Content,
	Card,
	CardItem,
	Body,
	Text,
	Icon,
	H1,
	Input,
	Button,
	List,
	ListItem,
	Left,
	Thumbnail
} from 'native-base';
import TeamListItem from '../components/TeamListItem'

class TeamScreen extends Component {
	render() {
		return (
			<Content>
				<H1>
					Team
				</H1>
				<Text>
					{this.props.user.username}
				</Text>
				<Card>
					<CardItem>
						<Text>Almond Lima</Text>
					</CardItem>
					<CardItem>
						<Text>Team Name:</Text>
						<Input placeholder="team name" />
						<Button><Text>Create Team</Text></Button>
					</CardItem>
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
				<Button onPress={() => this.props.navigation.navigate('Main')}><Text>Back</Text></Button>
			</Content>
		);
	}
}


const mapStateToProps = state => {
	return {
		user: state.user
	}
}

// const mapDispatchToProps = dispatch => {

// }

export default connect(mapStateToProps, null)(TeamScreen)