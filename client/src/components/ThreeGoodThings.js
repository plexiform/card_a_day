import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ThreeGoodThings() {
  const [allThrees, setAllThrees] = useState([]);
  const [threeGoodThings, setThreeGoodThings] =
    useState({
      firstGoodThing: "",
      secondGoodThing: "",
      thirdGoodThing: "",
      firstCause: "",
      secondCause: "",
      thirdCause: ""
    });

  const [firstComplete, setFirstComplete] = useState(false);
  const [secondComplete, setSecondComplete] = useState(false);
  const [thirdComplete, setThirdComplete] = useState(false);

  const [threeComplete, setThreeComplete] = useState(false);

  const convertFromUtc = (fullDate) => {
    // fullDate is a Date object
    const toISO = fullDate.toISOString();
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const date = (new Date(new Date(toISO).getTime() - tzoffset)).toISOString();

    return date;
  };

  const aDayAway = (date, beforeOrAfter) => {
    const dateFormat = new Date(date);

    if (beforeOrAfter === 'before') {
      const subtract24h = new Date(new Date(dateFormat.toISOString().slice(0, 10)) - (24 * 60 * 60 * 1000));
      return subtract24h.toISOString().slice(0, 10);
    }

    if (beforeOrAfter === 'after') {
      const add24h = new Date(Date.parse(dateFormat) + (24 * 60 * 60 * 1000));
      return (currentDate === today) ? today : add24h.toISOString().slice(0, 10);
    }

  }

  const today = convertFromUtc(new Date()).slice(0, 10);
  const [currentDate, setCurrentDate] = useState(today);


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
      .then(
        setThreeGoodThings
          ({
            firstGoodThing: "",
            secondGoodThing: "",
            thirdGoodThing: "",
            firstCause: "",
            secondCause: "",
            thirdCause: ""
          }),
        setThreeComplete(true)
      );

  }

  const handleThreeChange = e => {
    setThreeGoodThings(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  useEffect(() => {
    axios.get('http://localhost:8082/api/journals/threegoodthings/' + today,
      {
        withCredentials: true
      }).then(res => {
        setAllThrees(res.data);
      }).catch(err => console.log('could not retrieve 3 good things from this day'))
  }, [threeComplete]);


  const threeFilter = allThrees.filter(dayEntry => {
    return convertFromUtc(new Date(dayEntry.date)).slice(0, 10) === currentDate;
  });

  useEffect(() => {
    if (threeFilter.length > 0) {
      setThreeGoodThings({
        firstGoodThing: threeFilter[0].first.goodThing,
        secondGoodThing: threeFilter[0].second.goodThing,
        thirdGoodThing: threeFilter[0].third.goodThing,
        firstCause: threeFilter[0].first.cause,
        secondCause: threeFilter[0].second.cause,
        thirdCause: threeFilter[0].third.cause
      });
      setThreeComplete(true);
    } else {
      setThreeComplete(false);
    }
  }, [allThrees]);

  return (
    <div>
      <i>Three good things: </i>

      {
        ((currentDate === today && !threeComplete)) ?
          <form onSubmit={submitThreeGoodThings}>

            <ol style={{ width: '400px' }}>
              <li>
                <textarea
                  style={{ width: '100%', color: 'white' }}
                  autocomplete="off"
                  name="firstGoodThing"
                  type="text"
                  placeholder="something good that happened today (in detail!)"
                  onChange={handleThreeChange}
                />
                <br />
                ↳ Because...
                <input
                  style={{ width: '100%' }}
                  autocomplete="off"
                  name="firstCause"
                  type="text"
                  onChange={handleThreeChange}
                  autoComplete='off'
                />
              </li>


              {(threeGoodThings.firstGoodThing &&
                threeGoodThings.firstCause) &&
                <li>
                  <textarea
                    style={{ width: '100%', color: 'white' }}
                    autocomplete="off"
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
                </li>
              }

              {threeGoodThings.secondGoodThing &&
                threeGoodThings.secondCause &&
                <li>
                  <textarea
                    style={{ width: '100%', color: 'white' }}
                    autocomplete="off"
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
              {(threeGoodThings.firstGoodThing
                && threeGoodThings.firstCause
                && threeGoodThings.secondGoodThing
                && threeGoodThings.secondCause
                && threeGoodThings.thirdGoodThing
                && threeGoodThings.thirdCause
              ) &&
                <button onSubmit={submitThreeGoodThings} type="submit">submit</button>}
            </ol>
          </form>
          :
          <div>{
            threeFilter[0] ?
              <div>
                1) {threeFilter[0].first.goodThing}<br />

                <i><b>because…</b></i>
                {threeFilter[0].first.cause}

                <hr style={{ backgroundColor: 'white' }} />

                2) {threeFilter[0].second.goodThing}<br />
                <i><b>because…</b></i>
                {threeFilter[0].second.cause}

                <hr style={{ backgroundColor: 'white' }} />

                3) {threeFilter[0].third.goodThing}<br />
                <i><b>because…</b></i>
                {threeFilter[0].third.cause}
              </div>
              :
              <span>no entry</span>
          }
          </div>
      }
      <hr />
      <button onClick={e => setCurrentDate(aDayAway(currentDate, 'before'))}>BACK</button><span>_____</span>
      <button onClick={e => setCurrentDate(aDayAway(currentDate, 'after'))}>FORWARD</button>
    </div>
  )
}

