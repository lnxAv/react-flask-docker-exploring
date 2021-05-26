import React, { useState, useEffect, useCallback } from 'react';
import { AxiosConfig, ErrorObject } from '../utils';
import { MessageInfoItem } from '../MessageInfoItem/component';

const FakeResult = {result: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,]}

export function MessageLoadBalencer(props) {
  const [isReady, setIsReady] = useState(false)
  const [hasMore, sethasMore] = useState(true)
  const [currDeepFirst,setCursorDeepFirst] = useState(null)
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
      clearInterval(updateInterval)
    }
  }, []);
  //! Callback
    const callbackUseState = useCallback(
      (_currDeepFirst=null, _currDeepLast=null, _hasMore=null, _comments=null, _newComments=null ) => {
        if(_currDeepFirst){
          setCursorDeepFirst(_currDeepFirst)
        }
        if(_currDeepLast){
          setCursorDeepLast(_currDeepLast)
        }
        if(_hasMore){
          sethasMore(_hasMore)
        }
        if(_comments){
          setComments(_comments)
        }
        if(_newComments){
          setNewComments(_newComments)
        }
      },
      [],
    );
  //==
  //! Load
    //Initialise Loading
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
    //Check for new items
    function loadFromNew(){
      console.log('litteraly_inside')
      console.log(currDeepFirst)
      try {
        const _axiosConfig = AxiosConfig(
          '/api/v1.0/get_from_top',
          {
            curr_deep_First: currDeepFirst,
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
  //If is succesfull and has data init state
  function handleInitComments(_obj){
    var _value = []
    if(_obj?.data?.result == 'success'){
      try {
        _value = JSON.parse(_obj?.data?.value)
        console.log(_value)
      } catch (e) {
        console.log(e)
        startInterval()
        setIsReady(true)
        return
      }
      if(Array.isArray(_value) && _value.length > 0){
        const _firstId = _value?.[0]?.message_id+''
        const _lastId = _value?.[_value.length-1]?.message_id+''
        const _hasMore = _value.length>=_TOPLIMIT
        console.log(_firstId)
        callbackUseState(new String(_firstId), new String(_lastId), _hasMore, _value)        
      }
    }
    startInterval()
    setIsReady(true)
  }
  //If is succesfull and has data unshift onto newly found comments array
  function handleNewComments(_obj){
    var _value = []
    if(_obj?.data?.result == 'success'){
      try {
        _value = JSON.parse(_obj?.data?.value)
        console.log(_value)
      } catch (e) {
        console.log(e)
        return
      }
      if(Array.isArray(_value) && _value.length > 0){
        const _firstId = _value?.[0]?.message_id+''
        const _lastId = _value?.[_value.length-1]?.message_id+''
        console.log(_value)
        if(_firstId){
          callbackUseState(new String(_firstId)) 
        }
        if(Array.isArray(comments) && comments.length <= 0){
          callbackUseState(null, new String(_lastId), false, _value) 
        }
        else{
          var _newComments = newComments
          for(var i = _value.length-1; i >= 0; i--){
            _newComments.unshift(_value[i])
          }
          console.log(_newComments)
          setNewComments(_newComments)
          callbackUseState(null,null,null,null,_newComments) 
        }
      }
    }
  }
  //==
  //! Interval
  //Start Interval update for new comments
  function startInterval() {
    clearInterval(updateInterval)
    console.log('in start')
    console.log(currDeepFirst)
    const newInterval = setInterval( () => {
      console.log('before')
      console.log(currDeepFirst)
      loadFromNew()
    }, _INTERVALTIME)
    setUpdateInterval(newInterval)
  }
  //Stop Interval update for new comments
  function stopInterval() {
    clearInterval(updateInterval)
  }
  //==
  return (
    <div>
      {isReady && newComments?
        newComments.map((comment) => {
          return <MessageInfoItem key={comment.message_id} message={comment.message_id} />
        })
      : //or
        null
      }
      {isReady?
        comments.map((comment) => {
          return <MessageInfoItem key={comment.message_id} message={comment.message_id} />
        })
      ://or
        'loading...'
      }
    </div>
  );
}