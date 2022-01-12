import React, { useState, useEffect } from "react";
import axios from "axios";
import ShowSchedule from "./TodaySchedule";
import SchedCard from "./SchedCard";
import Tabs from './Tabs';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CardStyle = styled.div`
    display: inline-block;
    width: 150px; 
    height: 187.5px;
    margin: 5px;
    padding:3px ;
    border-style: solid;
    border-width:1px;
    color: #9c9c9c;
    border-color: #9c9c9c;
    background-color:#2c2c2c;
    font-size:12px;
    
    overflow:auto;
    ${props => (props.current === true) ? `border-width:5px;` : ``}
    ${props => (props.percent >= 1 && props.percent < 33.34) && `background-color:#ff000040`}
    ${props => (props.percent > 33.34 && props.percent < 66.6666667) && `background-color:#4EDABE50`}
    ${props => (props.percent >= 66.6666667 && props.percent <= 100) && `background-color:#00ff0030`}
    
  `;


const GridStyle = styled.div`
    max-height: 90vh;
    overflow:auto;
  `;

const BlockStyle = styled.div`
    &:hover {
      background-color:#00000020
    }
`

export default function DayCardes() {
  const [cards, setCards] = useState([]);
  const [cardPercent, setCardPercent] = useState({});
  const [totalMins, setTotalMins] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    axios.get('/api/cards',
      {
        withCredentials: true
      }).then((res) => {
        setCards(res.data.cards);
        setIsLoading(false);
      })
      .catch(err => console.log('no cards retrieved'));
  }, [trigger]);

  useEffect(() => {
    cards.forEach(card => {
      const datesOfMonth = card[1];

      Object.keys(datesOfMonth).forEach(date => {
        const daysSchedules = card[1][date].schedules;

        const averageOfDay = daysSchedules.reduce((sum, curr) => {
          return sum + curr.percentPomos
        }, 0) / daysSchedules.length;

        const totalMinutes = daysSchedules.reduce((sum, curr) => {
          return sum + (curr.timeBlock.numPomos * curr.timeBlock.pomoLength)
        }, 0);

        setCardPercent(prevState =>
        ({
          ...prevState,
          [date]: averageOfDay
        }))

        setTotalMins(prevState =>
        ({
          ...prevState,
          [date]: totalMinutes
        }))

      })
    })
  }, [cards])

  // argument: cards is an Object of Date's {}
  function generateMonthlyCardList(cards) {

    function splitDate(dateArg) {
      const tzoffset = (new Date()).getTimezoneOffset() * 60000;
      const date = (new Date(new Date(dateArg).getTime() - tzoffset)).toISOString();

      let splitT = date.split("T");
      let day = splitT[0];
      let longTime = splitT[1];
      let shortTime = longTime.substr(0, 5);

      return [day, shortTime];

    };

    const orderedKeys = Object.keys(cards).sort((a, b) => {
      const [aYear, aMonth, aDay] = a.split('-');
      const [bYear, bMonth, bDay] = b.split('-');
      const aDate = new Date(aYear, aMonth - 1, aDay);
      const bDate = new Date(bYear, bMonth - 1, bDay);

      return aDate - bDate;
    });

    const cardsList = orderedKeys.map((card, id) => {
      // routineItems ->
      // gratitude, values, value_affirmation, type_of_meditation, minutes_spent, date

      const currentRoutines = cards[card].routines.map((routine, id) => {
        return (
          <div id={id}>
            <b>Gratitude:</b> {routine.routineItems.gratitude}
            <br />
            <b>Values:</b> {routine.routineItems.values}
          </div>
        )
      });

      // timeBlock ->
      // startTime, endTime, pomoLength, breakLength, numPomos, maxPomos
      const currentSchedules = cards[card].schedules.map((sched, id) => {
        const startTime = splitDate(sched.timeBlock.startTime)[1];
        const endTime = splitDate(sched.timeBlock.endTime)[1];

        return (
          <BlockStyle id={id}>
            {startTime} – {endTime}
            <br />
            <SchedCard
              trigger={trigger}
              setTrigger={setTrigger}
              percentPomos={sched.percentPomos}
              userId={sched.userId}
              id={sched._id}
              sched={sched.timeBlock}
              finished={sched.finished} />
          </BlockStyle>
        )
      });

      return (
        <CardStyle id={id} percent={cardPercent[card]} current={card === splitDate(new Date())[0]}>
          <div>⤡<i style={{ float: 'right' }}>{card}</i></div><br />
          <div
            style={{
              maxHeight: '70px',
              overflow: 'scroll',
              color: "black",
              backgroundImage: 'linear-gradient(to left, rgba(255,0,0,0), lightgreen'
            }}
          >
            {currentRoutines}
          </div>
          {totalMins[card] > 0 ?
            <div
              style={{
                backgroundImage: 'linear-gradient(to right, rgba(255,0,0,0), black',
                color: 'white',
                textAlign: 'right'
              }}
            >
              {totalMins[card]} min ttl
            </div> : ''
          }
          {currentSchedules}
        </CardStyle >

      );
    });

    return (
      { cardsList }
    )

  };

  function generateYears() {
    const twelveMonthsObj = [];
    const flatCards = cards.flat();
    for (let i = 0; i < 24; i += 2) {
      const thisMonthLabel = flatCards[i];
      const thisMonthDates = flatCards[i + 1];
      twelveMonthsObj[thisMonthLabel] =
        (<GridStyle>
          {
            generateMonthlyCardList(thisMonthDates).cardsList.length > 0 &&
            <motion.div
              initial="hide"
              animate="show"
              variants={variants}
            >

              {generateMonthlyCardList(thisMonthDates).cardsList.map((card, i) => (

                <motion.div style={{ display: 'inline-block' }} key={i} variants={item}>
                  {card}
                </motion.div>
              )
              )}

            </motion.div >
          }
        </GridStyle>
        )

    }
    return twelveMonthsObj;
  };

  const variants = {
    show: {
      opacity: 1,
      transition: {
        staggerChildren: .05
      }
    },
    hide: {
      opacity: 1
    }
  }

  const item = {
    hide: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        duration: 1
      }
    }
  }

  if (isLoading) {
    return (<span>loading pls</span>)
  } else {
    return (
      <>
        <Tabs genFunc={generateYears}></Tabs>
        {/*generateYears()['December']*/}
      </>


    )
  }
}
