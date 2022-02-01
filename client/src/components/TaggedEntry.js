import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Label = styled.label`
  
`

const Input = styled.input`
  &:checked + ${Label} {
    color:blue;
  }
`

export default function TaggedEntry({ entry, values }) {


  return (
    <div>
      {entry.journalEntry}
      <br />
      <div style={{ textAlign: 'right', }}>
        {
          entry.values.map((val, id) => {
            return (
              <div style={{ display: 'inline-block', fontSize: 12, marginRight: 5, backgroundColor: 'brown', fontStyle: 'italic' }}>{val}</div>
            )
          })
        }
      </div>
    </div>
  )

}