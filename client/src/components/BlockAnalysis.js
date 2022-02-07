export default function BlockAnalysis({ goalNames }) {

  const splitDate = (dateArg) => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const date = (new Date(new Date(dateArg).getTime() - tzoffset)).toISOString();

    let splitT = date.split("T");
    let day = splitT[0];
    let longTime = splitT[1];
    let shortTime = longTime.substr(0, 5);

    return [day, shortTime];
  };

  return (
    <div>
      {
        Object.keys(goalNames).map((name, id) => {
          return (
            <div>
              {name}
              {goalNames[name] && goalNames[name].map((sched, id) => {
                if (sched) {
                  return (
                    <div>
                      start: {sched.timeBlock.startTime}
                      end: {sched.timeBlock.startTime}
                    </div>
                  )
                }
              })}
            </div>
          )
        })
      }
    </div>
  )
}