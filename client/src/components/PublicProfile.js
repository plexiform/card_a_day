import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import JournalEntries from './JournalEntries';
import TaggedEntry from './TaggedEntry';
import Accordion from './Accordion';

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
  const [routines, setRoutines] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [currentDate, setCurrentDate] = useState(splitDate(new Date())[0])

  function splitDate(dateArg) {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const date = (new Date(new Date(dateArg).getTime() - tzoffset)).toISOString();

    let splitT = date.split("T");
    let day = splitT[0];
    let longTime = splitT[1];
    let shortTime = longTime.substr(0, 5);

    return [day, shortTime];
  };

  function handleTimeChange(e) {
    setCurrentDate(e.target.value)
  }

  useEffect(() => {
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


          axios.get(`http://localhost:8082/api/routines/${profile}`)
            .then(res => {
              setRoutines(res.data);
            })

          axios.get(`http://localhost:8082/api/schedules/u/${profile}`)
            .then(res => {
              setSchedules(res.data);
            })
        }
      }).catch(err => {
        alert('This profile is private or does not exist!')
      })
  }, [username]);

  const mainCard = styled.div`
  
  `
  return (
    <React.Fragment>
      {isPublic ?
        <div style={{
          width: '400px',
          height: '500px',
          overflow: 'auto',
          borderRadius: '5px',
          backgroundImage: 'linear-gradient(45deg, beige, darkbeige)',
          boxShadow: '0px 5px 5px black',
          margin: '10px'
        }}>

          <form style={{
            position: 'sticky',
            top: '0',
            backgroundColor: 'gray',
          }}>
            <input
              type='date'
              onChange={handleTimeChange}
              defaultValue={currentDate}
            >
            </input>
            <span style={{ textAlign: 'right' }}>
              ◄ ►
            </span>
          </form>
          <div style={{
            padding: '5px'
          }}>
            {
              <Accordion menuName='Routine' >
                {
                  routines.filter(routine => new Date(routine.routineItems.date).toISOString().substr(0, 10) === currentDate)
                    .map((routine, id) => {
                      return (

                        <div key={id}>
                          {routine.routineItems.gratitude}
                        </div>

                      )
                    })
                }
              </Accordion>

            }

            {
              <Accordion menuName='Routine' >
                {
                  schedules.filter(sched => splitDate(sched.timeBlock.startTime)[0] === currentDate)
                    .map((sched, id) => {
                      return (
                        <div key={id}>
                          {sched.timeBlock.startTime} -
                          {sched.timeBlock.endTime}
                        </div>
                      )
                    })
                }
              </Accordion>
            }

            {
              <Accordion menuName='Journal' >
                {entries.filter(entry => splitDate(entry.date)[0] === currentDate)
                  .map((entry, id) => {
                    return (
                      <div key={id}>
                        <TaggedEntry entry={entry} values={entry.values} />
                      </div>
                    )
                  })}
              </Accordion>
            }
          </div>
        </div>
        :
        <>
          This profile is  private or does not exist
        </>
      }
    </React.Fragment >
  )
}