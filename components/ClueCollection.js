import React, { Component } from 'react';
import { Alert } from  'react-native';

import { Content, Card, CardItem, Text, Input, Button, Item, Body, Right, Container } from 'native-base';

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

// Dummy data
const dummyRiddle =
	'What would you chase after if you had the stones to bear it?';
const dummyClues = ['U', 'B', 'L', 'M', 'K'];
const dummySolution = 'BULL MARKET';
const answerBonus = 1000;
const pointMultiplier = 30;
const inputPlaceholder = (secondsRemaining, bonus) =>
	`Answer for ${pointMultiplier * secondsRemaining + bonus} points!`;

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

		this.solution = this.props.solution || dummySolution;
		this.pointMultiplier = this.props.pointMultiplier || pointMultiplier;
		this.answerBonus = this.props.answerBonus || answerBonus;
		this.currentClues = this.clues || dummyClues;

		this.handleSolutionInput = this.handleSolutionInput.bind(this);
	}

	componentDidMount() {

	}

	handleSolutionInput(e) {
		this.setState({
			solution: e.nativeEvent.text
		});
	}

	checkSolution(secondsRemaining) {
		const hasCorrectGuess =
			lowercaseTrimmer(this.state.solution) === lowercaseTrimmer(this.solution);
		if (hasCorrectGuess) {
			const bonus = secondsRemaining * this.pointMultiplier + this.answerBonus;
			Alert.alert(
				`You Win!`,
				`You've guessed the final riddle and received a bonus of ${bonus} points!`,
				[{
				text: 'End Game',
				// onPress: this._endGame,
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
		const secondsRemaining = this.props.secondsRemaining || 720;
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
							this.currentClues.map((clue, i) => {
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
						<Text style={riddleStyle}>{dummyRiddle}</Text>
					</CardItem>
					<CardItem style={{flexDirection: 'column'}}>
						<Item regular>
							<Input
								placeholder={inputPlaceholder(secondsRemaining, this.answerBonus)}
								value={this.state.solution}
								onChange={this.handleSolutionInput} />
						</Item>
						<Button full onPress={() => this.checkSolution(secondsRemaining)}>
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

export default ClueCollection;
