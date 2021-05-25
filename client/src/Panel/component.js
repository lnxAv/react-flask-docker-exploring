import React, { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { AxiosConfig } from '../utils';

export function Panel(props) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')

  useEffect(() => {
    return () =>{
    }
  }, [props]);

  //! Handlers
  function handleSubmit(e){
    e?.preventDefault()
    try {
      //Create a comment and return if it was valid or not
      const _axiosConfig = AxiosConfig(
        '/api/v1.0/insert_message_info',
        {
          email,
          name,
          comment
        },
        'POST'
      )
      props?.requestHandler(_axiosConfig)
    } catch (error) {
      console.log(error)
    }
  }
  function handleEmail(e){
    var _email = e.target.value
    setEmail(_email)
  }
  function handleName(e){
    var _name = e.target.value
    setName(_name)
  }
  function handleComment(e){
    var _comment = e.target.value
    setComment(_comment)
  }
  
  return (
    <div>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="Email">Email</Label>
            <Input type="email" name="email" id="Email" placeholder="with a placeholder" value={email} onChange={handleEmail} maxLength="128"/>
          </FormGroup>
          <FormGroup>
            <Label for="Name">Name</Label>
            <Input type="text" name="Name" id="Name" placeholder="with a placeholder" value={name} onChange={handleName} maxLength="32"/>
          </FormGroup>
          <FormGroup>
            <Label for="Text">Text Area</Label>
            <Input type="textarea" name="text" id="Text" value={comment} onChange={handleComment} maxLength="255"/>
          </FormGroup>
          <FormGroup check row>
            <Button>Submit</Button>
          </FormGroup>
        </Form>
    </div>
  );
}