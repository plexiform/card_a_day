import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [valueList, setValueList] = useState([]);
  const [value, setValue] = useState("");
  const [valueReason, setValueReason] = useState("");
  const [goal, setGoal] = useState("");
  const [goalList, setGoalList] = useState([]);

  function handleValueSubmit(e) {
    e.preventDefault();
    axios.post('http://localhost:8082/api/values',
      {
        value: value,
        reason: valueReason
      },
      {
        withCredentials: true
      })
      .then(res => {
        setValue('');
        setValueReason('');
      })
      .catch(err => console.log('no creato valuo'));
  };

  useEffect(() => {
    axios.get('http://localhost:8082/api/values',
      {
        withCredentials: true
      }).then(res => {
        setValueList(res.data);
      }).catch(err => console.log('couldnt retrieve values'));
  }, [value]);

  useEffect(() => {
    axios.get('http://localhost:8082/api/goals',
      {
        withCredentials: true
      }).then(res => {
        console.log('1111');
        setGoalList(res.data);
      }).catch(err => console.log('couldnt retrieve goals'));
  }, [goal])

  function handleGoalSubmit(e) {
    e.preventDefault();

    axios.post('http://localhost:8082/api/goals',
      {
        goal: goal
      },
      {
        withCredentials: true
      })
      .then(res => {
        setGoal('');
      })
      .catch(err => console.log('no creato goalo'))
  }



  function handleDelete(id) {
    axios.delete('http://localhost:8082/api/values/' + id)
      .then(res => {

      })
      .catch(err => {
        console.log('could not delete value')
      });

    const filteredVals = valueList.filter(val => {
      return val._id !== id;
    });

    setValueList(filteredVals);
  }

  return (
    <div style={{
      display: 'grid',
      gridColumns: '1fr 1fr',

    }}>
      <div>
        <h1>Goals</h1>
        <div style={{
          display: 'grid',
          gridColumns: '1fr 1fr',
          maxHeight: 100,
          overflow: 'auto'
        }}>
          {goalList.map((goal, id) => {

            return (
              <div key={id}>{goal.goalName}</div>
            )

          })}
        </div>

        <form noValidate onSubmit={handleGoalSubmit}>
          <input
            type="text"
            value={goal}
            placeholder="Enter a goal to tag timeblocks"
            onChange={e => setGoal(e.target.value)}
          >
          </input>
          <input type="submit" />
        </form>
      </div>

      <div style={{ gridColumnStart: '2' }}>
        <h1>Values</h1>
        <div style={{
          border: '1px solid white',
          width: '50%',
          borderRadius: '10px',
          padding: 10
        }}>
          {
            valueList.map((val, id) => {
              return (
                <div id={id}>
                  <b>val:</b> {val.valueAndReason.value} - <b>reason:</b> {val.valueAndReason.reason}
                  <input onClick={handleDelete.bind(this, val._id)} type='submit' value='x' />
                </div>
              )
            })
          }
        </div>

        <form noValidate onSubmit={handleValueSubmit}>
          <input
            autocomplete="off"
            id="value"
            type="text"
            placeholder="An important value"
            value={value}
            onChange={e => setValue(e.target.value)}
          >
          </input>
          <br />
          <textarea
            autocomplete="off"
            id="valueReason"
            type="text"
            placeholder="Why is this value important to you?"
            value={valueReason}
            size="50"
            onChange={e => setValueReason(e.target.value)}
          >
          </textarea>
          <input type="submit" />
        </form>
      </div>

      <div style={{ gridColumnStart: '1' }}>
        <h1>Schedule Presets</h1>
      </div>

    </div>
  )
}