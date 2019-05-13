import React from 'react';
import {
	Container,
	Header,
	Text,
	List,
	ListItem,
	Title,
	Subtitle,
	Right,
	Icon
} from 'native-base';
import DIMENSIONS from '../constants/Layout';

const listItemStyle = {
	flexDirection: 'row',
	justifyContent: 'space-between'
};

const taskScoreStyle = {
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'flex-end',
	width: DIMENSIONS.window.width * 0.35
};

const completedItemStyle = {
	textDecorationLine: 'line-through'
};

const headerStyle = {
	flexDirection: 'column',
	alignItems: 'center'
};

const highlight = '#eb10b7';
const gray = '#999';

const TaskList = props => {
	const { event, tasks, teamTasks } = props;
	return event ? (
		<Container>
			<Header style={headerStyle}>
				<Title>Tasks</Title>
				<Subtitle>Event: {event.name}</Subtitle>
			</Header>
			<List avatar>
				{
					(teamTasks.length > 0) && tasks.map(task => {
						const completed = teamTasks
							.filter(teamTask => task.id === teamTask.taskId)[0]
							.completed;
						let iconName = `checkbox-${completed ? 'marked' : 'blank'}-outline`;
						let iconColor = completed ? highlight : gray;

						return (
						<ListItem key={task.id} style={listItemStyle}>
							<Text style={{width: DIMENSIONS.window.width * 0.6}}>
								{task.description}
							</Text>
							<Right style={taskScoreStyle}>
								<Text note>{`${task.points} pts`}</Text>
								<Icon
									style={{color: iconColor}}
									type="MaterialCommunityIcons"
									name={iconName} />
							</Right>
						</ListItem>);
					})
				}

				<ListItem style={listItemStyle}>
					<Text style={{textAlign: 'right'}}>
						TOTAL POINTS:
					</Text>
					<Right style={taskScoreStyle}>
						<Text>190 pts</Text>
					</Right>
				</ListItem>
			</List>
		</Container>
	) : null;
};

export default TaskList;
