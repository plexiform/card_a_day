import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JournalEntries from './JournalEntries';

export default function EndDay() {
  const [journalEntry, setJournalEntry] = useState('');
  const [threeGoodThings, setThreeGoodThings] = useState({ first: "", second: "", third: "" });

  const submitJournal = e => {
    e.preventDefault();

    axios.post('http://localhost:8082/api/journals/journal', { journalEntry },
      {
        withCredentials: true
      })
      .then(setJournalEntry(''))
      .catch(err => console.log(err))
  }

  const submitThreeGoodThings = e => {
    e.preventDefault();
  }

  const handleThreeChange = e => {
    const { name, value } = e.target;

    setThreeGoodThings(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  return (
    <div
      style={{
        display: 'grid',
        gridColumns: '1fr 1fr'
      }}
    >
      <div style={{ gridColumnStart: 1 }}>
        <h2>Journal ^_^</h2>
        <i>New entry:</i>
        <form onSubmit={submitJournal}>
          <textarea
            style={{
              width: '50%'
            }}
            value={journalEntry}
            onChange={e => setJournalEntry(e.target.value)}>
          </textarea>
          <button>submit</button>
        </form>

        <i>Three good things:</i>
        <form onSubmit={submitThreeGoodThings}>
          <ol>
            <li>
              <input
                name="first"
                type="text"
                onChange={handleThreeChange}
              >

              </input>
            </li>
            <li>
              <input
                name="second"
                type="text"
                onChange={handleThreeChange}
              >

              </input>
            </li>
            <li>
              <input
                name="third"
                type="text"
                onChange={handleThreeChange}
              >

              </input>
            </li>
          </ol>
        </form>
        {/*
      <ul>
        <li>3 good things</li>
        <li>what could I have done better? (e.g. a big weakness on 1/3/22, was starting late on the time blocks, gaps of time between said blocks, and Googling peripheral things instead of fully engaging in the content ~ fill that in later? or find a way to measure focus/mindfulness)</li>
        + tag schedule with how you focused on values like mindfulness
        <li>Import/enter items that demonstrate values</li>
      </ul>
    */}
      </div>
      <div style={{ gridColumnStart: 2 }}>
        <JournalEntries newEntry={journalEntry} />
      </div>

    </div>

  )
}
