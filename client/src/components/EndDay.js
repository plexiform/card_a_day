import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JournalEntries from './JournalEntries';
import PrimaryDiv from './styles/PrimaryDiv';

export default function EndDay() {
  const [journalEntry, setJournalEntry] = useState('');
  const [threeGoodThings, setThreeGoodThings] =
    useState({
      firstGoodThing: "",
      secondGoodThing: "",
      thirdGoodThing: "",
      firstCause: "",
      secondCause: "",
      thirdCause: ""
    });
  const [routineList, setRoutineList] = useState([]);

  const [values, setValues] = useState([]);
  const [taggedValues, setTaggedValues] = useState([]);

  const [firstComplete, setFirstComplete] = useState(false);
  const [secondComplete, setSecondComplete] = useState(false);
  const [thirdComplete, setThirdComplete] = useState(false);

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

    axios.post('http://localhost:8082/api/journals/threegoodthings',
      {
        first: {
          goodThing: threeGoodThings.firstGoodThing,
          cause: threeGoodThings.firstCause
        },
        second: {
          goodThing: threeGoodThings.secondGoodThing,
          cause: threeGoodThings.secondCause
        },
        third: {
          goodThing: threeGoodThings.thirdGoodThing,
          cause: threeGoodThings.thirdCause
        }
      },
      {
        withCredentials: true
      })
      .then(setThreeGoodThings({
        firstGoodThing: "",
        secondGoodThing: "",
        thirdGoodThing: "",
        firstCause: "",
        secondCause: "",
        thirdCause: ""
      }))
      .catch()
  }

  const handleThreeChange = e => {
    setThreeGoodThings(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
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



          </div>
        </PrimaryDiv>

        <div style={{ gridColumnStart: 2, minWidth: '600px', width: '50%', justifyContent: 'right' }}>
          <PrimaryDiv fadeTo='darkorchid'>
            <JournalEntries newEntry={journalEntry} />
          </PrimaryDiv>
        </div>

        <PrimaryDiv fadeTo='magenta' style={{ gridColumn: '1/3', width: '96.5%' }}>
          <i>Three good things: </i>
          <form onSubmit={submitThreeGoodThings}>

            <ol style={{ width: '400px' }}>
              <li>
                <textarea
                  style={{ width: '100%' }}
                  name="firstGoodThing"
                  type="text"
                  placeholder="something good that happened today (in detail!)"
                  onChange={handleThreeChange}
                />
                <br />
                ↳ Because...
                <input
                  style={{ width: '100%' }}
                  name="firstCause"
                  type="text"
                  onChange={handleThreeChange}
                  autoComplete='off'
                />
                <button type="button" onClick={() => setFirstComplete(true)}>+</button>
              </li>


              {firstComplete &&
                <li>
                  <textarea
                    style={{ width: '100%' }}
                    name="secondGoodThing"
                    type="text"
                    placeholder="something good that happened today"
                    onChange={handleThreeChange}
                    autoComplete='off'
                  />
                  <br />
                  ↳ Because...
                  <input
                    style={{ width: '100%' }}
                    name="secondCause"
                    type="text"
                    onChange={handleThreeChange}
                    autoComplete='off'
                  />
                  <button type="button" onClick={() => setSecondComplete(true)}>+</button>
                </li>
              }

              {secondComplete &&
                <li>
                  <textarea
                    style={{ width: '100%' }}
                    name="thirdGoodThing"
                    type="text"
                    placeholder="something good that happened today"
                    onChange={handleThreeChange}
                    autoComplete='off'
                  />
                  <br />
                  ↳ Because...
                  <input
                    style={{ width: '100%' }}
                    name="thirdCause"
                    type="text"
                    onChange={handleThreeChange}
                    autoComplete='off'
                  />
                </li>


              }
              {(
                threeGoodThings.firstCause && threeGoodThings.firstCause
                &&
                threeGoodThings.secondCause && threeGoodThings.secondCause
                &&
                threeGoodThings.thirdCause && threeGoodThings.thirdCause
              )
                && <button onSubmit={submitThreeGoodThings} type="submit">submit</button>}
            </ol>
          </form>
        </PrimaryDiv>
      </ div>
    </div >
  )
}
