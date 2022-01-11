import React, { useState } from 'react';
import styled from 'styled-components';

const TabContainer = styled.ul`
  display:block;
  padding: 0;
  height:2.35em;
  width:100%;
  background-color:#5f5f5f;
  overflow:hidden;
  white-space: wrap;
`;

export default function Tabs(props) {
  const months = {
    1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'
  }

  const currentMonthNumber = new Date().getMonth() + 1;
  const currentMonth = months[currentMonthNumber];

  const [activeTab, setActive] = useState(currentMonth);

  const ListItem = (value) => {
    let item = <li className='tab' onClick={() => setActive(value)} value={value}>{value}</li>

    if (value === activeTab) {
      item = <li className='tab activeTab' onClick={() => setActive(value)} value={value}>{value}</li>
    } else {
      item = <li className='tab' onClick={() => setActive(value)} value={value}>{value}</li>
    }

    return (
      item
    )
  };

  return (
    <div>
      <TabContainer>
        {ListItem('January')}
        {ListItem('February')}
        {ListItem('March')}
        {ListItem('April')}
        {ListItem('May')}
        {ListItem('June')}
        {ListItem('July')}
        {ListItem('August')}
        {ListItem('September')}
        {ListItem('October')}
        {ListItem('November')}
        {ListItem('December')}
      </TabContainer>
      {props.genFunc()[activeTab]}
    </div>
  )
}