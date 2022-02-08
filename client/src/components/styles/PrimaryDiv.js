import styled from 'styled-components';

const PrimaryDiv = styled.div`
  border: 1px solid;
  border-radius:15px;
  background:
     linear-gradient(to right, brown, ${props => props.fadeTo}) padding-box,
     linear-gradient(to right, brown, #bdbdbd) border-box;
  border-image-source: linear-gradient(to right, brown, white);
  background-color:brown;
  margin:20px;
  padding:15px;
`

/*
    background:
     linear-gradient(#ccc,#ccc) padding-box, /*this is your grey background*/
//      linear - gradient(to right, #9c20aa, #fb3570) border - box;


export default PrimaryDiv;