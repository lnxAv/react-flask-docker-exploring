import React, { useState, useEffect } from 'react';
import { Panel } from '../Panel/component';
import { AxiosConfig, ErrorObject } from '../utils';
import axios from 'axios'
import { useInView } from 'react-intersection-observer';
import { MessageInfoItem } from '../MessageInfoItem/component';

const FakeResult = {result: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,]}

export function MessageLoadBalencer(props) {
  const [isReady, setIsReady] = useState(false)
  const [hasMore, sethasMore] = useState(true)
  const [curr_deep_First,setCursorDeepFirst] = useState(null)
  const [curr_first,setCursorFirst] = useState(null)
  const [curr_last,setCursorLast] = useState(null)
  const [curr_deep_last,setCursorDeepLast] = useState(null)
  const [comments, setComments] = useState([])
  const [newComments, setNewComments] = useState([])
  const [updateInterval, setUpdateInterval] = useState(null)
  const [isUpdate, setisUpdate] = useState(false)
  const _BUFFERLIMIT = 4
  const _TOPLIMIT = 15
  const _INTERVALTIME = 1500
  
  useEffect(() => {
    if(!isReady){
      loadInit()
    }
    return () =>{
    }
  }, []);
  //! Load
    function loadInit(){
      try {
        const _limitTotal = _TOPLIMIT
        const _axiosConfig = AxiosConfig(
          '/api/v1.0/get_from_init',
          {
            limit: _limitTotal,
          },
          'POST'
        )
        props?.requestHandler(_axiosConfig, '', handleInitComments)
      } catch (error) {
        console.log(error)
        setIsReady(true)
      }
    }
    function loadFromNew(){
      try {
        const _axiosConfig = AxiosConfig(
          '/api/v1.0/get_from_top',
          {
            curr_deep_First,
          },
          'POST'
        )
        props?.requestHandler(_axiosConfig, '', handleNewComments)
      } catch (error) {
        console.log(error)
      }
    }
  //==
  //! Handler
  function handleInitComments(_obj){
    var _value = []
    if(_obj?.data?.result == 'success'){
      try {
        _value = JSON.parse(_obj?.data?.value)
      } catch (e) {
        console.log(e)
      }
      if(Array.isArray(_value) && _value.length > 0){
        const _firstId = _value?.[0]?.message_info_id
        const _lastId = _value?.[_value.length-1]?.message_info_id
        const _hasMore = _value.length>=_TOPLIMIT
        setCursorDeepFirst(_firstId)
        setCursorDeepLast(_lastId)
        setComments(_value)
        sethasMore(_hasMore)
      }
    }
    startInterval()
    setIsReady(true)
  }
  function handleNewComments(_obj){
    var _value = []
    if(_obj?.data?.result == 'success'){
      try {
        _value = JSON.parse(_obj?.data?.value)
      } catch (e) {
        console.log(e)
      }
      if(Array.isArray(_value) && _value.length > 0){
        const _firstId = _value?.[0]?.message_info_id
        const _lastId = _value?.[_value.length-1]?.message_info_id
        console.log(_value)
        setCursorDeepFirst(_firstId)
        if(Array.isArray(comments) && comments.length <= 0){
          setCursorDeepLast(_lastId)
          setComments(_value)
          sethasMore(false)
        }
        else{
          var _newComments = newComments
          for(var i = _value.length-1; i >= 0; i--){
            _newComments.unshift(_value[i])
          }
          console.log(_newComments)
          setNewComments(_newComments)
        }
      }
    }
    setIsReady(true)
  }
  //==
  //! Interval
  function startInterval() {
    clearInterval(updateInterval)
    const newInterval = setInterval( () => {
      loadFromNew()
    }, _INTERVALTIME)
    setUpdateInterval(newInterval)
  }
  function stopInterval() {
    clearInterval(updateInterval)
  }
  //==
  return (
    <div>
      {isReady && newComments?
        newComments.map((comment) => {
          return <MessageInfoItem key={comment.message_info_id} info={comment} />
        })
      : //or
        null
      }
      {isReady?
        comments.map((comment) => {
          return <MessageInfoItem key={comment.message_info_id} info={comment} />
        })
      ://or
        'loading...'
      }
    </div>
  );
}