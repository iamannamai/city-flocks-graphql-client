import React, { Component } from 'react';
import { Button, CardItem, H2, Item, Input, Text } from 'native-base';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const CREATE_TEAM = gql`
  mutation CreateTeam($name: String!, $userId: Int!) {
    createTeam(name: $name, userId: $userId) {
      id
      name
      users {
        username
        teamId
      }
    }
  }
`;

// Purpose: to update teamId on user
// maybe be rendered redundant by automatic normalization process
// const USER_FRAGMENT = gql`
//   fragment myUser on User {
//     id
//     username
//     teamId
//   }
// `;

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
    const { userId } = this.props;
    return (
      <Mutation
        mutation={CREATE_TEAM}
        variables={{
          name: this.state.teamNameInput,
          userId
        }}
        // Purpose: to update teamId on user
        // may be rendered redundant by automatic normalization process
        // update={(cache, {data: { createTeam }}) => {
        //   cache.writeFragment({
        //     id: `User_${createTeam.users[0].id}`,
        //     fragment: USER_FRAGMENT,
        //     data: {
        //       teamId: createTeam.id
        //     }
        //   });
        // }}
        >
        {(createTeam, { loading, error, data }) => {
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
              <Button
                onPress={event => {
                  // event.preventDefault();
                  // this.props.createTeam(this.state.teamNameInput);

                  // createTeam can take an object with variables property, but in this case, variables is passed to the Mutation parent component
                  createTeam();
                }}
              >
                <Text>Create Team</Text>
              </Button>
            </CardItem>
          );
        }}
      </Mutation>
    );
  }
}

export default CreateTeamForm;
