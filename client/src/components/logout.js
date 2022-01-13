import React, { useContext } from 'react';
import axios from 'axios';
import { CredentialsContext } from '../context';
import { useHistory, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

class Logout extends React.Component {
  static contextType = CredentialsContext;
  constructor(props) {
    super(props);
    this.state = {};

    this.clearUser = this.clearUser.bind(this);
  }

  clearUser = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8082/logout', {}, {
        headers: {
          'Authorization': `Basic ${this.context[0].username}:${this.context[0].password}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }).then(() => {
        this.context[0].username = "";
      });

    this.props.history.push('/login')
  }

  render() {
    return (
      <button type="submit" onClick={this.clearUser} >
        Log out
      </button>
    )
  }
}

export default withRouter(Logout);