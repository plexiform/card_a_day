import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Logout from './logout';
import axios from 'axios';
import Welcome from './Welcome';
import { Link, NavLink } from 'react-router-dom';

const LayoutStyle = styled.div`
    height:98vh;
  `;

const TopBar = styled.div` 
    display:flex;
    background:#9e9e9e;
    height:5vh;
    align-items: center;
  `;

const LogoutStyle = styled.div`
    display:flex;
    margin-left:auto;
    margin-right:1em;
  `;

const LeftNav = styled.div`
    margin-right:1em;
    
  `;

const BodyContainer = styled.div`
    display:flex;
    height:100%;
  `;

const Sidebar = styled.div`
    overflow:none;
    background:#2c2c2c;
    min-width:15em;
    max-width:15em;
    display:flex;
    flex-direction:column; 
    height:100%;
  `;

const SidebarItem = styled.div`
  padding:1em;
  border-bottom-color:#3c3c3c;
  border-bottom-width:1px;
  border-bottom-style:solid;
  text-transform:uppercase;
  font-size:14px;
  color:#9c9c9c;
  &:hover {
    background-color:#3c3c3c;
  }
`;

const StyledLink = styled(NavLink)`
  text-decoration:none;

  &.active {
    background-color:#1f1f1f;
    border-left-width:3px;
    border-left-style:solid;
    border-left-color:brown;
  }

`
const ContentStyle = styled.div`
    flex:1;
    max-width:90vw;
  `;

export default function Layout({ children }) {
  const [isLoggedIn, setLog] = useState(false);
  const [render, setRender] = useState(false);

  return (
    <div>
      <LayoutStyle>
        <TopBar>
          <Link
            style={{
              fontSize: 35,
              marginLeft: '.3em',
              color: '#2c2c2c',
              fontFamily: 'open-sans-condensed',

            }}
            to='/welcome'
          >
            c<span style={{ color: 'brown', fontSize: '.75em' }}>∀</span>rd
          </Link>
          <LogoutStyle><LeftNav><NavLink to='/dashboard'>Dashboard</NavLink></LeftNav><Logout /></LogoutStyle>
        </TopBar>

        <BodyContainer>
          <Sidebar>
            <StyledLink name='routine' to='/create-routine'><SidebarItem>Morning routine</SidebarItem></StyledLink>

            <StyledLink name='schedule' to='/create-schedule'><SidebarItem>Block your time</SidebarItem></StyledLink>

            <StyledLink name='conclusion' to='/end-day'><SidebarItem>Reflect on your day</SidebarItem></StyledLink>

            <StyledLink name='cards' to='/day-cards'><SidebarItem>Calendar</SidebarItem></StyledLink>


          </Sidebar>


          <ContentStyle>
            {children}
          </ContentStyle>
        </BodyContainer>

      </LayoutStyle>
    </div >
  )

};