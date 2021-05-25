import React, { useState } from 'react';
import { Panel } from '../Panel/component';
import { AxiosConfig, ErrorObject } from '../utils';

export function MessageContainer() {
  const [curr_latest, setCurrLatest] = useState(undefined);
  const [curr_last, setCurrLast] = useState(undefined);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [errorObject, setErrorObject]= useState()

  //Will and must handle every request 
  function __RequestHandler(axiosConfig = AxiosConfig(), callback = ()=>{}){
    axios(axiosConfig)
    .then(res => res.json())
    .then(
      (result) => {
        callback(result)
      },
      (error) => {
        setErrorObject(ErrorObject('warning', error))
      }
    )
  }

  return (
    <div>
        <Panel />
    </div>
  );
}