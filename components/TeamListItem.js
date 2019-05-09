import React from 'react';
import {
    Body,
    Text,
    ListItem,
    Left,
    Thumbnail,
    Right,
    Button
} from 'native-base';
const avatar = require('../assets/images/avataaars.png');
export default function TeamListItem(props) {
    return (
        <ListItem avatar>
            <Left>
                <Thumbnail source={avatar} />
            </Left>
            <Body>
                <Text>
                    {props.user.username}
		        </Text>
            </Body>
            {props.addToTeam ? (
                <Right>
                    <Button>
                        <Text>
                            Add
                         </Text>
                    </Button>
                </Right>
            ) : null
            }
        </ListItem>
    )
}
