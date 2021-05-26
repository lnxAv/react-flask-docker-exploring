import React, { useState } from 'react';
import { Panel } from '../Panel/component';
import { AxiosConfig, ErrorObject } from '../utils';
import axios from 'axios'
import { MessageLoadBalencer } from '../MessageLoadBalencer/component';

export function MessageContainer(props) {
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
  //==
  //
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
        <MessageLoadBalencer requestHandler={__RequestHandler} />
    </div>
  );
}