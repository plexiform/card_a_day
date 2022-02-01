import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function PublicProfile() {
  const { profile } = useParams();
  const [isPublic, setPublic] = useState(false);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8082/api/users/${profile}`,
      {
        withCredentials: true
      }).then(res => {
        const isPublic = res.data;
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
  });

  return (
    <React.Fragment>
      {isPublic ?
        <>
          {
            entries.map((entry, id) => {
              return (
                <div>
                  {entry.date}<br />
                  {entry.journalEntry}
                </div>
              )
            })
          }
        </>
        :
        <>
          This profile is  private or does not exist
        </>
      }
    </React.Fragment>
  )
}