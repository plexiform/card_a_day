import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function JournalEntries(props) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8082/api/journals/entries',
      {
        withCredentials: true
      })
      .then(res => {
        setEntries(res.data)
      })
      .catch(err => alert(err));
  }, [props.newEntry])

  return (
    <div>
      {
        entries.map((entry, id) => {
          return (
            <div>
              <div style={{ textAlign: 'right' }}>{entry.date}</div>
              {entry.journalEntry}
            </div>
          )
        })
      }
    </div >
  )
}