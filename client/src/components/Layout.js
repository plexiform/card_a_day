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
    background:#1f1f1f;
    height:5vh;
    align-items: center;
    border-bottom: 1px solid;
    border-image-slice: 1;
    border-width: 3px;
    border-image-source: linear-gradient(to right, brown, #1f1f1f);
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
    overflow:auto;
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
            <span style={{
              fontSize: '1.25em',
              backgroundImage: 'linear-gradient(45deg, darkorchid, #fb3570)',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}>/∀</span>
          </Link>
          <LogoutStyle><LeftNav><NavLink to='/dashboard'>Dashboard</NavLink></LeftNav><Logout /></LogoutStyle>
        </TopBar>

        <BodyContainer>
          <Sidebar>
            <StyledLink name='routine' to='/create-routine'><SidebarItem>Morning routine</SidebarItem></StyledLink>

            <StyledLink name='schedule' to='/create-schedule'><SidebarItem>Block your time</SidebarItem></StyledLink>

            <StyledLink name='conclusion' to='/end-day'><SidebarItem>Reflect on your day</SidebarItem></StyledLink>

            <StyledLink align='right' name='cards' to='/day-cards'><SidebarItem>Calendar</SidebarItem></StyledLink>

            <StyledLink align='right' name='analytics' to='/analytics'><SidebarItem>Analytics</SidebarItem></StyledLink>
          </Sidebar>


          <ContentStyle>
            {children}
          </ContentStyle>
        </BodyContainer>

      </LayoutStyle>
    </div >
  )

};