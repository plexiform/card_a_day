import { useEffect, useState } from "react";

export default function BlockAnalysis({ goalNames, isSorted, routines }) {
  const goalMinutes = {};

  const splitDate = (dateArg) => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const date = (new Date(new Date(dateArg).getTime() - tzoffset)).toISOString();

    let splitT = date.split("T");
    let day = splitT[0];
    let longTime = splitT[1];
    let shortTime = longTime.substr(0, 5);

    return [day, shortTime];
  };

  const generateMins = () => {
    Object.keys(goalNames).forEach((goal) => {
      goalNames[goal].forEach((sched) => {
        if (sched) {
          if (!goalMinutes[goal]) {
            goalMinutes[goal] = 0;
          }

          goalMinutes[goal] += (sched.timeBlock.numPomos * sched.timeBlock.pomoLength)
        }
      })
    })
  }

  generateMins();

  return (

    <div>
      {
        Object.keys(goalNames).map((name, id) => {
          return (
            <div key={id}>
              <b>{name}</b>
              <span> //  {goalMinutes[name] / 60} hours total </span>
              <div
                style={{
                  maxWidth: '50%',
                  maxHeight: 100,
                  overflowY: 'auto',
                  borderBottom: '1px solid brown'
                }}
              >
                {goalNames[name] && goalNames[name].map((sched, id) => {
                  if (sched) {
                    return (
                      <div key={id}>
                        <i>start</i>: {` ${splitDate(sched.timeBlock.startTime)[1]}, ${splitDate(sched.timeBlock.startTime)[0]}`}
                        <span>   </span>
                        <i>end</i>: {` ${splitDate(sched.timeBlock.endTime)[1]}, ${splitDate(sched.timeBlock.endTime)[0]}, ${sched.timeBlock.numPomos}/${sched.timeBlock.maxPomos} pomos`}
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          )
        })
      }
      <div>
        {
          routines.map((routine, id) => {
            return (
              <div styles={{ minWidth: '500px' }}>
                <b>
                  {routine.routineItems.date.split('T')[0]}
                </b>
                ~
                {routine.routineItems.type_of_meditation}
              </div>
            )
          })
        }
      </div>
    </div>
  )
}