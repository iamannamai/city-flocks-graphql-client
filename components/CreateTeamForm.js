import React, { Component } from 'react';
import { Button, CardItem, H2, Item, Input, Text } from 'native-base';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { TEAM_USERS_FRAG } from './TeamListItem';

const CREATE_TEAM = gql`
  mutation CreateTeam($name: String!, $userId: ID!) {
    createTeam(name: $name, userId: $userId) {
      id
      name
      users {
        id
        username
        __typename
      }
      __typename
    }
  }
`;

const USER_FRAG = gql`
  fragment myUser on User {
    id
    username
    __typename
  }
`;

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
        update={(cache, { data: { createTeam } }) => {
          const user = cache.readFragment({
            id: `User_${userId}`,
            fragment: USER_FRAG
          });
          cache.writeFragment({
            id: `Team_${createTeam.id}`,
            fragment: TEAM_USERS_FRAG,
            data: {
              __typename: createTeam.__typename,
              users: [...createTeam.users, user]
            }
          });
          console.log('cacheeeeee, ', cache);
        }}
      >
        {(createTeam, { loading, error, data }) => {
          if (error) return <Text>{error}</Text>;

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
                  event.preventDefault();
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
