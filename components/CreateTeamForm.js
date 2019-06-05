import React, { Component } from 'react';
import { Button, CardItem, H2, Item, Input, Text} from 'native-base';

class CreateTeamForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamNameInput: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e) {
    this.setState({
      teamNameInput: e.nativeEvent.text
    });
  }

  render() {
    return (
      <CardItem style={{ flexDirection: 'column' }}>
        <H2 style={{ textAlign: 'center' }}>Create New Team</H2>
        <Item regular>
          <Input
            placeholder="Enter team name"
            value={this.state.teamNameInput}
            onChange={this.handleInputChange}
          />
        </Item>
        <Button onPress={() => this.props.createTeam(this.state.teamNameInput)}>
          <Text>Create Team</Text>
        </Button>
      </CardItem>
    );
  }
}

export default CreateTeamForm;
