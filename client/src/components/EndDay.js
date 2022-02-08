import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JournalEntries from './JournalEntries';
import PrimaryDiv from './styles/PrimaryDiv';

export default function EndDay() {
  const [journalEntry, setJournalEntry] = useState('');
  const [threeGoodThings, setThreeGoodThings] = useState({ first: "", second: "", third: "" });
  const [routineList, setRoutineList] = useState([]);

  const [values, setValues] = useState([]);
  const [taggedValues, setTaggedValues] = useState([]);

  const HandleCheckboxChange = e => {
    if (e.target.checked) {
      setTaggedValues([...taggedValues, e.target.value])
    } else {
      setTaggedValues(values => values.filter(checkedBox => {
        return checkedBox !== e.target.value
      }));
    }

    console.log(taggedValues);
  }

  useEffect(() => {
    axios.get('http://localhost:8082/api/routines',
      {
        withCredentials: true
      }).then(res => {
        setRoutineList(res.data);
        setValues(valuesToday());
      }).catch(err => console.log('couldnt retrieve routines'));
  }, [journalEntry]);

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
      .then(setJournalEntry(''), setTaggedValues([]), setValues([]))
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
        <PrimaryDiv fadeTo='darkorchid'>
          <div style={{ gridColumnStart: 1 }}>
            <i>New entry: </i>
            <form onSubmit={submitJournal}>
              <textarea
                style={{
                  width: '400px'
                }}
                value={journalEntry}
                onChange={e => setJournalEntry(e.target.value)}>
              </textarea><br />

              {
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

            <i>Three good things: </i>
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

          </div>
        </PrimaryDiv>


        <div style={{ gridColumnStart: 2, minWidth: '600px', width: '50%', justifyContent: 'right' }}>
          <PrimaryDiv fadeTo='darkorchid'>
            <JournalEntries newEntry={journalEntry} />
          </PrimaryDiv>
        </div>


      </ div>
    </div >
  )
}
