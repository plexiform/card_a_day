import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function JournalEntries(props) {
  const [entries, setEntries] = useState([]);

  const convertFromUtc = (fullDate) => {
    // fullDate is a Date object
    const toISO = fullDate.toISOString();
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const date = (new Date(new Date(toISO).getTime() - tzoffset)).toISOString();

    return date;
  };

  // beforeOrAfter is a String of 'before' or 'after'
  const aDayAway = (date, beforeOrAfter) => {
    const dateFormat = new Date(date);

    if (beforeOrAfter === 'before') {
      const subtract24h = new Date(new Date(dateFormat.toISOString().slice(0, 10)) - (24 * 60 * 60 * 1000));
      return subtract24h.toISOString().slice(0, 10);
    }

    if (beforeOrAfter === 'after') {
      const add24h = new Date(Date.parse(dateFormat) + (24 * 60 * 60 * 1000));
      return add24h.toISOString().slice(0, 10);
    }
  }

  const today = convertFromUtc(new Date()).slice(0, 10);
  const [currentDate, setCurrentDate] = useState(today);
  const convertedEntries = entries.map((entry, id) => {
    return { ...entry, date: convertFromUtc(new Date(entry.date)) }
  });


  const dayEntries = convertedEntries.filter(entry => {
    const date = new Date(entry.date).toISOString().slice(0, 10);

    return date === currentDate;
  })

  useEffect(() => {
    axios.get('http://localhost:8082/api/journals/entries',
      {
        withCredentials: true
      })
      .then(res => {
        console.log('spam?');
        setEntries(res.data);
      })
      .catch(err => alert(err));
  }, [props.newEntry])

  return (
    <div>
      !!!~today's values~
      <h4>{currentDate}</h4>
      <div style={{ overflow: 'auto', height: '300px' }}>
        {
          dayEntries.map((entry, id) => {
            return (
              <div key={id} style={{
                borderBottomStyle: 'solid',
                borderBottomColor: 'brown',
              }}>
                <div style={{ textAlign: 'right', fontStyle: 'oblique' }}>{entry.date.split("T")[1].substr(0, 5)}</div>
                {entry.journalEntry}
              </div>
            )
          })
        }
      </div>
      <div style={{ fontSize: 20 }}>
        <button onClick={e => setCurrentDate(aDayAway(currentDate, 'before'))}>←</button>
        <button onClick={e => setCurrentDate(aDayAway(currentDate, 'after'))}>→</button>
      </div>
    </div >
  )
}