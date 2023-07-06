import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import JournalEntries from './JournalEntries';
import TaggedEntry from './TaggedEntry';
import Accordion from './Accordion';

export default function PublicProfile({ username }) {
  //const { profile, date } = useParams();

  const params = useParams();

  let profile;
  let date;
  if (!params.profile) {
    profile = username;
  } else {
    profile = params.profile;
    date = params.date;
  }


  const [isPublic, setPublic] = useState(false);

  const [entries, setEntries] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [currentDate, setCurrentDate] = useState(date ? parseDateParameter(date) : splitDate(new Date())[0])
  const [year, setYear] = useState("");

  const Arrow = styled.h3`
    display:inline;
    margin:5px;
    user-select:none;
    &:hover {
      color:white;
      cursor:pointer
    }

  `

  function parseDateParameter(date) {
    return date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8)
  }

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

  function backOneDay() {
    if (new Date(Date.parse(currentDate) - (86400000)).toISOString().split("T")[0].slice(0, 4) === year) {
      setCurrentDate(
        new Date(Date.parse(currentDate) - (86400000)).toISOString().split("T")[0]
      )
    }
  }

  function forwardOneDay() {
    if (new Date(currentDate) <= new Date()) {
      setCurrentDate(new Date(Date.parse(currentDate) + (86400000)).toISOString().split("T")[0])
    }
  }

  useEffect(() => {
    axios.get(`/api/users/${profile}`,
      {
        withCredentials: true
      }).then(res => {
        const isPublic = res.data.public;
        setPublic(isPublic);

        if (isPublic) {

          axios.get(`/api/journals/entries/${profile}`)
            .then(res => {
              setEntries(res.data)
            })


          axios.get(`/api/routines/${profile}`)
            .then(res => {
              setRoutines(res.data);
            })

          axios.get(`/api/schedules/u/${profile}`)
            .then(res => {
              setSchedules(res.data);

              //set year this profile is based in
              if (res.data[0]) {
                setYear(res.data[0].timeBlock.startTime.slice(0, 4));
              }
            })
        }
      }).catch(err => {
        alert('This profile is private or does not exist!')
      })
  }, [username]);

  return (
    <React.Fragment>
      {isPublic ?
        <div style={{
          width: '400px',
          height: '500px',
          overflow: 'auto',
          borderStyle: 'solid',
          borderRadius: '5px',
          borderWidth: '.5px',
          borderColor: 'darkgray',
          boxShadow: '0px 1px 5px black',
          margin: '0px',
          backgroundColor: '#2c2c2c',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: ''
        }}>

          <form style={{
            display: 'flex',
            position: 'sticky',
            top: '0',
            backgroundColor: 'gray'
          }}>
            <input
              type='date'
              onChange={handleTimeChange}
              value={currentDate}
            //defaultValue={currentDate}
            >
            </input>
            <span
              style={{
                marginLeft: 'auto',
                marginRight: '0',
              }}
            >

              <Arrow onClick={backOneDay}>←</Arrow>
              <Arrow onClick={forwardOneDay}>→</Arrow>
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

                        <div
                          key={id}
                          style={{
                            backgroundColor: 'gray'
                          }}
                        >
                          {routine.routineItems.gratitude}
                        </div>

                      )
                    })
                }
              </Accordion>

            }

            {
              <Accordion menuName='Scheduled time' >
                {
                  schedules.filter(sched => splitDate(sched.timeBlock.startTime)[0] === currentDate)
                    .map((sched, id) => {
                      return (
                        <div
                          key={id}
                          style={{ backgroundColor: 'red' }}
                        >
                          {`
                          ${splitDate(sched.timeBlock.startTime)[1]} to
                          ${splitDate(sched.timeBlock.endTime)[1]}
                          `
                          }

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
                      <div
                        key={id}
                        style={{
                          background: 'rgba(100,100,100, .33)',
                          padding: '7px',
                          borderRadius: '5px'
                        }}
                      >
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