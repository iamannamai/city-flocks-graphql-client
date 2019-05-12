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

const listItemStyle = {
	flexDirection: 'row',
	justifyContent: 'space-between'
};

const taskScoreStyle = {
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'flex-end'
};

const completedItemStyle = {
	textDecorationLine: 'line-through'
};

const headerStyle = {
	flexDirection: 'column',
	alignItems: 'center',
	zIndex: 2
};

const highlight = '#eb10b7';
const gray = '#999';

const TaskList = props => {
	const { event, tasks } = props;
	return event ? (
		<Container>
			<Header style={headerStyle}>
				<Title>Tasks</Title>
				<Subtitle>Event: {event.name}</Subtitle>
			</Header>
			<List avatar style={{zIndex: 2}}>
				{
					tasks.map(task => (
						<ListItem key={task.id} style={listItemStyle}>
							<Text style={{width: 200}}>
								{task.description}
							</Text>
							<Right style={taskScoreStyle}>
								<Text note>{`${task.points} pts`}</Text>
								<Icon
									style={{color: gray}}
									type="MaterialCommunityIcons"
									name="checkbox-blank-outline" />
							</Right>
						</ListItem>
					))
				}
				<ListItem style={listItemStyle}>
					<Text>Here's an item to do</Text>
					<Right style={taskScoreStyle}>
						<Text note>50pts</Text>
						<Icon
							style={{color: gray}}
							type="MaterialCommunityIcons"
							name="checkbox-blank-outline" />
					</Right>
				</ListItem>
				<ListItem style={listItemStyle}>
					<Text style={completedItemStyle}>
						Here's something else
					</Text>
					<Right style={taskScoreStyle}>
						<Text note>90pts</Text>
						<Icon
							style={{color: highlight}}
							type="MaterialCommunityIcons"
							name="checkbox-marked-outline" />
					</Right>
				</ListItem>
				<ListItem style={listItemStyle}>
					<Text style={completedItemStyle}>
						Yet another thing to do here
					</Text>
					<Right style={taskScoreStyle}>
						<Text note>100pts</Text>
						<Icon
							style={{color: highlight}}
							type="MaterialCommunityIcons"
							name="checkbox-marked-outline" />
					</Right>
				</ListItem>

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
