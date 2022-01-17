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
    }
`

export default function Morning(props) {
  const [collapsed, setCollapsed] = useState(false);
  const routine = props.routine.routineItems;

  return (
    <div>
      <ExpanderStyle onClick={() => setCollapsed(!collapsed)}>
        + Routine
      </ExpanderStyle>
      <CollapsibleStyle collapsed={collapsed}>
        <b>Gratitude:</b> {routine.gratitude}
        <br />
        <b>Values:</b> {routine.values}
      </CollapsibleStyle>
    </div>
  )

}