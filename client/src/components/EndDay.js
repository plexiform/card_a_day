import React from 'react';

export default function EndDay() {

  return (
    <>
      <i>New journal entry:</i>
      <form>
        <textarea
          style={{
            width: '50%'
          }}>
        </textarea>
      </form>
      <i>Three good things:</i>
      <form>
        <ol>
          <li>
            <input type="text"></input>
          </li>
          <li>
            <input type="text"></input>
          </li>
          <li>
            <input type="text"></input>
          </li>
        </ol>
      </form>
      {/*
      <ul>
        <li>3 good things</li>
        <li>what could I have done better? (e.g. a big weakness on 1/3/22, was starting late on the time blocks, gaps of time between said blocks, and Googling peripheral things instead of fully engaging in the content ~ fill that in later? or find a way to measure focus/mindfulness)</li>
        + tag schedule with how you focused on values like mindfulness
        <li>Import/enter items that demonstrate values</li>
      </ul>
    */}
    </>

  )
}