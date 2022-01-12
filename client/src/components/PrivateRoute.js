import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Redirect, Route } from 'react-router';
import Logout from './logout';
import styled from 'styled-components';
import Layout from './Layout';

class PrivateRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isLoaded: false,
      redirect: false
    }
  }

  async componentDidMount() {
    axios.get('/api', {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }).then((res) => {
      console.log('data ', res);
      if (typeof res.data == 'string') {
        this.setState({ isLoggedIn: true }, () => {
          this.setState({ isLoggedIn: true, isLoaded: true, navigate: false })
        });
      } else {
        this.setState({ navigate: true }, () => {
          this.setState({ isLoggedIn: false, isLoaded: false, navigate: true })
        })
      }
    })

  }

  render() {
    const { isLoggedIn } = this.state;
    const { isLoaded } = this.state;
    const nav = this.state.navigate;

    if (nav) {
      return (
        <Redirect to='/login' />
      );
    }

    if (isLoaded) {
      if (isLoggedIn) {
        return (
          <div>
            <Layout>
              <this.props.component />
            </Layout>
          </div>
        )
      } else {
        return (
          <Redirect to='/login' />
        )
      }
    } else {
      return (
        <div>loading</div>
      )
    };

  }

}

export default PrivateRoute;