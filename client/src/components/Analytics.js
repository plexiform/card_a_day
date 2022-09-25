import { useEffect, useState } from "react"
import axios from 'axios';
import BlockAnalysis from "./BlockAnalysis";

export default function Analytics() {
  const [goals, setGoals] = useState([]);
  const [goalNames, setGoalNames] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSorted, setIsSorted] = useState(false);
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8082/api/goals', { withCredentials: true })
      .then(res => {
        setGoals(res.data);
        setIsLoading(false);
      })
      .catch(err => console.log(err))

    axios.get(`http://localhost:8082/api/routines/`, { withCredentials: true })
      .then(res => {
        setRoutines(res.data);
      })
  }, [])

  useEffect(() => {
    goals.forEach(goal => setGoalNames(prevState => ({ ...prevState, [goal.goalName]: [] })));

    goals.forEach(goal => {
      goal.goalTags.forEach(schedID => {
        axios.get(`http://localhost:8082/api/schedules/${schedID}`)
          .then(res => {
            setGoalNames(prevState => ({
              ...prevState,
              [goal.goalName]: [...prevState[goal.goalName], res.data]
            }))
          })

          .catch(err => console.log(err))
      })
    });
  }, [isLoading, isSorted]);

  return (
    <>
      {!isLoading ? <BlockAnalysis
        isLoading={isLoading}
        goalNames={goalNames}
        routines={routines}
      /> : <>Loading</>}
    </>
  )
}