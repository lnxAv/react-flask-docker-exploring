import React, { useState } from 'react';
import { Panel } from '../Panel/component';
import { AxiosConfig, ErrorObject } from '../utils';
import axios from 'axios'

export function MessageContainer() {
  const [curr_latest, setCurrLatest] = useState(undefined);
  const [curr_last, setCurrLast] = useState(undefined);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [errorObject, setErrorObject]= useState()

  //! Api handler
  function __RequestHandler(axiosConfig = AxiosConfig(), action='', callback = ()=>{}){
    axios(axiosConfig)
    .then(
      (result) => {
        console.log('result')
        console.log(result)
        checkRequestAction(action)
        callback(result)
      },
      (error) => {
        console.log(error)
        setErrorObject(ErrorObject('warning', error))
      }
    )
  }
  function checkRequestAction(action) {
    switch(action){
      case '':
        break;
      case '':
        break;
      default:
    }
  }
  // ==

  return (
    <div>
        <Panel requestHandler={__RequestHandler} />
    </div>
  );
}