import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';

import { Content, Card, CardItem, Text, Input, Button, Item, Container } from 'native-base';

/**
 * Returns new string with only lower case letters, with no leading or trailing
 * white space, and any white spaces within converted to a single space.
 * ex: ' Happy   Birthday!   ' ==> 'happy birthday'
 * @param {String} unknownString - string to parse
 */
const lowercaseTrimmer = (unknownString) => {
	return unknownString
		.concat()
		.toLowerCase()
		.trim()
		.replace(/[^a-z ]/gm, '')
		.replace(/\s{2,}/gm, ' ');
};

const inputPlaceholder = (bonus) =>
	`Answer for ${bonus} points, plus a time bonus!`;

// Styles
const riddleStyle = {
	fontStyle: 'italic'
};

const noteStyle = {
	fontStyle: 'italic'
};

const clueStyle = {
	width: 30,
	padding: 6,
	borderWidth: 1,
	borderColor: '#0387ff',
	borderRadius: 2,
	fontWeight: '700',
	textAlign: 'center'
};

class ClueCollection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			solution: ''
		};

		this.solution = this.props.event.masterKey;
		this.pointMultiplier = this.props.event.timeBonusMultiplier;
		this.answerBonus = this.props.event.completionBonus;
		this.endTime = this.props.event;
		this.riddle = this.props.event.masterRiddle;

		this.handleSolutionInput = this.handleSolutionInput.bind(this);
	}

	handleSolutionInput(e) {
		this.setState({
			solution: e.nativeEvent.text
		});
	}

	checkSolution() {
		const end = this.props.endTime;
		const now = new Date().getTime();
		const secondsRemaining = Math.floor((end - now) / 1000);
		const hasCorrectGuess =
			lowercaseTrimmer(this.state.solution) === lowercaseTrimmer(this.solution);
		if (hasCorrectGuess) {
			const bonus = secondsRemaining * this.pointMultiplier + this.answerBonus;
			Alert.alert(
				`You Win!`,
				`You've guessed the final riddle and received a bonus of ${bonus} points!`,
				[{
				text: 'End Game',
				onPress: this.props.endGame(),
				style: 'cancel',
				}],
				{ cancelable: true }
			);
		}
		else {
			Alert.alert(
				`Wrong Guess!`,
				`Try again, maybe when you have more clues to help you.`,
				[{
				text: 'Got It',
				style: 'cancel',
				}],
				{ cancelable: true }
			);
		}
	}

	render() {
		// Construct clue tiles, including all those awarded by completing tasks
		const clueList = new Array(this.solution.length).fill(' ');
		this.clues = this.props.teamTasks.reduce((a, b) => {
			return b.completed ? a.concat(b.keyPiece) : a;
		}, '').split('');
		this.clues.forEach((clue, i) => {
			clueList[i] = clue;
		});

		return (
			<Container>
			<Content>
				<Card>
					<CardItem header bordered style={{flexDirection: 'column'}}>
						<Text>Final Clues</Text>
						<Text note>Unscramble your unlocked clues to find the solution to the following riddle:</Text>
					</CardItem>
					<CardItem style={{justifyContent: 'space-between'}}>
						{
							clueList.map((clue, i) => {
								return (
									<Text
										style={clueStyle}
										key={`${clue}${i * 3}`}>
										{clue}
									</Text>
								);
							})
						}
					</CardItem>
					<CardItem>
						<Text style={riddleStyle}>{this.riddle}</Text>
					</CardItem>
					<CardItem style={{flexDirection: 'column'}}>
						<Item regular>
							<Input
								placeholder={inputPlaceholder(this.answerBonus)}
								value={this.state.solution}
								onChange={this.handleSolutionInput} />
						</Item>
						<Button block onPress={() => this.checkSolution()}>
							<Text>Submit Final Answer!</Text>
						</Button>
					</CardItem>
					<CardItem>
						<Text note style={noteStyle}>
							Note: A correct answer will end the game!
						</Text>
					</CardItem>
				</Card>
			</Content>
			</Container>
		);
	}
}

const mapStateToProps = state => {
	return {
		solution: state.game.masterKey,
		pointMultiplier: state.game.bonusMultiplier,
		answerBonus: state.game.answerBonus,
		endTime: state.game.endTime,
		game: state.game
	};
};

export default connect(mapStateToProps)(ClueCollection);
