import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JournalEntries from './JournalEntries';
import ThreeGoodThings from './ThreeGoodThings';
import PrimaryDiv from './styles/PrimaryDiv';

export default function EndDay() {
  const [journalEntry, setJournalEntry] = useState('');

  const [routineList, setRoutineList] = useState([]);

  const [values, setValues] = useState([]);
  const [taggedValues, setTaggedValues] = useState([]);
  const [valuesToggled, setValuesToggled] = useState(false);

  const HandleCheckboxChange = e => {
    if (e.target.checked) {
      setTaggedValues([...taggedValues, e.target.value])
    } else {
      setTaggedValues(values => values.filter(checkedBox => {
        return checkedBox !== e.target.value
      }));
    }
  }

  useEffect(() => {
    axios.get('http://localhost:8082/api/routines',
      {
        withCredentials: true
      }).then(res => {
        setRoutineList(res.data);
        setValues(valuesToday());
      }).catch(err => console.log('couldnt retrieve routines'));
  }, [valuesToggled]);

  const convertFromUtc = (fullDate) => {
    // fullDate is a Date object
    const toISO = fullDate.toISOString();
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const date = (new Date(new Date(toISO).getTime() - tzoffset)).toISOString();

    return date;
  };

  const today = convertFromUtc(new Date()).slice(0, 10);

  const valuesToday = () => {
    const routineThisDay = routineList.filter(routine => {
      return routine.routineItems.date.substr(0, 10) === today;
    })

    return routineThisDay[0].routineItems.values;
  }

  const submitJournal = e => {
    e.preventDefault();

    axios.post('http://localhost:8082/api/journals/journal', { journalEntry, values: taggedValues },
      {
        withCredentials: true
      })
      .then(res => {
        setJournalEntry('');
        setTaggedValues([]);
        setValues([]);
      })

  }


  return (
    <div style={{
      display: 'flex',
      width: '100%'
    }}>

      <div
        style={{
          display: 'grid',
          gridColumns: '1fr 1fr'
        }
        }
      >
        <div style={{
          padding: 15, margin: 20,
          backgroundColor: '#2c2c2c'
        }}>
          <div style={{ gridColumnStart: 1 }}>
            <h4>New entry: </h4>
            <form onSubmit={submitJournal}>
              <textarea
                style={{
                  width: '400px',
                  height: '300px',
                  color: 'white'
                }}
                autocomplete="off"
                value={journalEntry}
                onChange={e => setJournalEntry(e.target.value)}>
              </textarea><br />
              <span
                onClick={e => setValuesToggled(current => !current)}>values ↠
              </span>
              {valuesToggled &&
                values.map((val, id) => {
                  const value = val;
                  return (
                    <div key={id} style={{ display: 'inline-block' }}>
                      <label>
                        <input
                          type='checkbox'
                          placeholder='values you want to embody'
                          name='taggedValues'
                          value={value}
                          key={id}
                          onChange={HandleCheckboxChange}
                        />
                        {value}
                      </label>
                    </div>
                  )
                })
              }
              <button>submit</button>
            </form>

          </div>
        </div>

        <div style={{ gridColumnStart: 2, minWidth: '600px', width: '50%', justifyContent: 'right' }}>
          <div style={{
            padding: 15, margin: 20,
            backgroundColor: '#1d1d1d'
          }}>
            <JournalEntries newEntry={journalEntry} />
          </div>
        </div>

        <PrimaryDiv angle={.65} fadeTo='magenta' style={{ gridColumn: '1/3', width: '96.5%' }}>
          <ThreeGoodThings />
        </PrimaryDiv>
      </ div>
    </div >
  )
}
