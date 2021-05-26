import React, { useState, useEffect } from 'react';
import { AxiosConfig, ErrorObject } from '../utils';
import axios from 'axios'

//When is in view (with react-intersection-observer)
//Call loading  message_info with given ID
export function MessageInfoItem(props) {
  useEffect(() => {
    return () =>{
    }
  }, [props]);

  return (
    <div>
        {props?.message || 'eh'}
    </div>
  );
}