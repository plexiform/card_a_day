import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Label = styled.label`
  
`

const Input = styled.input`
  &:checked + ${Label} {
    color:blue;
  }
`

export default function TaggedEntry({ entry, values }) {
  const [taggedValues, setTaggedValues] = useState([]);

  const HandleCheckboxChange = e => {
    if (e.target.checked) {
      setTaggedValues([...taggedValues, e.target.value])
    } else {
      setTaggedValues(values => values.filter(checkedBox => {
        return checkedBox !== e.target.value
      }));
    }
  }

  return (
    <div>
      {entry.journalEntry}
      <br />
      <div style={{ textAlign: 'right', }}>
        {
          values.map((val, id) => {
            const value = val;
            return (
              <div style={{ display: 'inline-block' }}>
                <Label>
                  <Input
                    type='checkbox'
                    placeholder='values you want to embody'
                    name='taggedValues'
                    value={value}
                    key={id}
                    onChange={HandleCheckboxChange}
                  />
                  {value}
                </Label>
              </div>
            )
          })
        }
      </div>
    </div>
  )

}