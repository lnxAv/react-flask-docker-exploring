import React, { useState, useEffect } from 'react';
import { AxiosConfig, ErrorObject } from '../utils';
import axios from 'axios'

export function MessageInfoItem(props) {
  useEffect(() => {
    console.log(props.info)
    return () =>{
    }
  }, [props]);

  return (
    <div>
        {props?.info?.message_info_id || 'eh'}
    </div>
  );
}