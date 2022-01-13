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

  return (
    <>
      <ExpanderStyle onClick={() => setCollapsed(!collapsed)}>
        Click for morning routine~
      </ExpanderStyle>
      <CollapsibleStyle collapsed={collapsed}>
        <b>Gratitude:</b> {props.routine.routineItems.gratitude}
        <br />
        <b>Values:</b> {props.routine.routineItems.values}
      </CollapsibleStyle>
    </>



  )
}