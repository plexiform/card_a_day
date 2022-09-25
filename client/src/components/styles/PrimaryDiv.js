import styled from 'styled-components';

const PrimaryDiv = styled.div`
  border: .75px solid;
  border-radius:0px;
  background: 
     conic-gradient(from ${props => props.angle}turn at 100% 0%, 
      ${props => props.fadeTo}, 
      0deg, 
      #1d1d1d, 
      359deg, 
      black);
  border-color:black;
  margin:20px;
  padding:15px;

`

/*
    background:
     linear-gradient(#ccc,#ccc) padding-box, /*this is your grey background*/
//      linear - gradient(to right, #9c20aa, #fb3570) border - box;


export default PrimaryDiv;