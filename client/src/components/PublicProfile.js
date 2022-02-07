import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

export default function PublicProfile({ username }) {
  const params = useParams();

  let profile;
  if (!params.profile) {
    profile = username;
  } else {
    profile = params.profile
  }
  //const { profile } = useParams();
  const [isPublic, setPublic] = useState(false);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    console.log('prf', profile);
    axios.get(`http://localhost:8082/api/users/${profile}`,
      {
        withCredentials: true
      }).then(res => {
        const isPublic = res.data.public;
        setPublic(isPublic);

        if (isPublic) {
          axios.get(`http://localhost:8082/api/journals/entries/${profile}`)
            .then(res => {
              setEntries(res.data)
            })
        }
      }).catch(err => {
        alert('This profile is private or does not exist!')
      })
  }, [username]);


  return (
    <React.Fragment>
      {isPublic ?
        <div style={{
          width: '400px',
          height: '500px',
          border: '1px white solid',
          overflow: 'auto'
        }}>
          {
            entries.map((entry, id) => {
              return (
                <div key={id}>
                  {entry.date}<br />
                  {entry.journalEntry}
                </div>
              )
            })
          }
        </div>
        :
        <>
          This profile is  private or does not exist
        </>
      }
    </React.Fragment>
  )
}