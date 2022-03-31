import styled from 'styled-components'
import { useState } from 'react';

const CollapsibleStyle = styled.div`
    transition: all 0.7s ease;
    display: ${props => !props.collapsed ? 'none' : 'block'};
`
const ExpanderStyle = styled.div`
    transition: all 0.2s ease;
    font-style:italic;
    &:hover {
      background-color: white;
      cursor: crosshair;
    }
`

const MeditationSquare = styled.div`
    text-transform: uppercase;
    float: right;
    background-image: linear-gradient(90deg, springgreen, lightseagreen);
    padding: 0px 1px 0px 1px;
    font-weight: bold;
    font-style: normal;
    color: black;
    font-size: 1em;
    &:hover {
    }
`

export default function Morning(props) {
  const [collapsed, setCollapsed] = useState(false);
  const routine = props.routine.routineItems;

  return (
    <div>
      <ExpanderStyle onClick={() => setCollapsed(!collapsed)}>
        + Routine
        <MeditationSquare>
          {routine.type_of_meditation[0]}
          {routine.minutes_spent} /
          F:{routine.completed_fast ? <span style={{ color: 'indigo' }}>Yes</span> : <span style={{ color: 'firebrick' }}>No</span>}
        </MeditationSquare>
      </ExpanderStyle>

      <CollapsibleStyle collapsed={collapsed}>
        <b>Gratitude:</b> {routine.gratitude}
        <br />
        <b>Values:</b> {routine.values}
      </CollapsibleStyle>
    </div >
  )

}