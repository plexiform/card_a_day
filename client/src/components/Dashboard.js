import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [valueList, setValueList] = useState([]);
  const [value, setValue] = useState("");
  const [valueReason, setValueReason] = useState("");
  const [goal, setGoal] = useState("");
  const [goalList, setGoalList] = useState([]);
  const [deadline, setDeadline] = useState("");
  const [deadlineObj, setDeadlineObj] = useState({});
  //!!!
  const [userObj, setUserObj] = useState({});
  const [isPublic, setPublic] = useState(false);

  function handleValueSubmit(e) {
    e.preventDefault();
    axios.post('/api/values',
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

  function handleGoalSubmit(e) {
    e.preventDefault();

    axios.post('/api/goals',
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

  function handleDeadlineUpdate(e) {
    e.preventDefault();


    if (
      (
        new Date(new Date() - (new Date().getTimezoneOffset() * 60000))
        - (new Date(deadlineObj.timePosted) - (new Date(deadlineObj.timePosted).getTimezoneOffset() * 60000))
        < (24 * 60 * 60 * 1000)
      )) {
      alert(
        `It's been less than 24h since you updated your deadline.`
      )

    } else {
      axios.put('/api/deadlines/' + deadlineObj._id,
        {
          deadline
        },
        {
          withCredentials: true
        }).then(res => {
          console.log(res.message);
        }).catch(err => {
          console.log('couldn\'t update deadline')
        })
    }
  };

  function handlePublicUpdate(e) {
    e.preventDefault();

    axios.put(`/api/public/${userObj._id}`,
      { isPublic },
      {
        withCredentials: true
      })
      .then(res => console.log('changed privacy status'))
      .catch(err => console.log('could not change privacy status'))

  }

  useEffect(() => {
    axios.get('/api/values',
      {
        withCredentials: true
      }).then(res => {
        setValueList(res.data);
      }).catch(err => console.log('couldnt retrieve values'));
  }, [value]);

  useEffect(() => {
    axios.get('/api/goals',
      {
        withCredentials: true
      }).then(res => {
        setGoalList(res.data);
      }).catch(err => console.log('couldnt retrieve goals'));
  }, [goal])


  useEffect(() => {
    axios.get('/api/',
      {
        withCredentials: true
      }).then(res => {
        axios.get(`/api/users/${res.data}`)
          .then(res => {
            setUserObj(res.data);
            setPublic(res.data.public);
          })
      })
  }, [])


  useEffect(() => {
    axios.get('/api/deadlines',
      {
        withCredentials: true
      }).then(res => {
        setDeadlineObj(res.data);
        setDeadline(res.data.deadline);
      })
  }, [])

  function handleDelete(id) {
    axios.delete('/api/values/' + id)
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
      <h5>{userObj.username}</h5>
      <form style={{ gridColumnStart: 1 }}>
        <input
          type='checkbox'
          id='public'
          checked={isPublic ? 'checked' : ''}
          onChange={() => {
            setPublic(current => !current);
          }}>
        </input>
        <label style={{ marginRight: 10 }} for='public'>Public</label>
        <button onClick={handlePublicUpdate}>Confirm</button>
      </form>

      <form onChange={e => setDeadline(e.target.value)} onSubmit={handleDeadlineUpdate} style={{ gridColumnStart: 2 }}>
        <span style={{ fontSize: 20 }}>Morning routine deadline: </span>
        <input defaultValue={deadline} type="time"></input>
        <button>✓</button>
      </form>

      <div>
        <h1>Goals</h1>
        <div style={{
          display: 'grid',
          gridColumnStart: '1fr 1fr',
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
                <div key={id}>
                  <b>val:</b> {val.valueAndReason.value} - <b>reason:</b> {val.valueAndReason.reason}
                  <input onClick={handleDelete.bind(this, val._id)} type='submit' value='x' />
                </div>
              )
            })
          }
        </div>

        <form noValidate onSubmit={handleValueSubmit}>
          <input
            autoComplete="off"
            id="value"
            type="text"
            placeholder="An important value"
            value={value}
            onChange={e => setValue(e.target.value)}
          >
          </input>
          <br />
          <textarea
            autoComplete="off"
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
    </div>
  )
}