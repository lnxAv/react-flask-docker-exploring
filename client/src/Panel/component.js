import React, { useEffect, useState } from 'react';
import { AxiosConfig, ErrorObject } from '../utils';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

export function Panel() {
  useEffect(() => {
    // Update the document title using the browser API
    return () =>{
    }
  }, [props]);
  //Will and must handle every request 
  function __RequestHandler(axiosConfig = AxiosConfig(), callback = ()=>{}){
    axios(axiosConfig)
    .then(res => res.json())
    .then(
      (result) => {
        callback(result)
      },
      (error) => {
        this.setState({
          errorObject=ErrorObject('warning', error),
        });
      }
    )
  }
  return (
    <div>
        <Form>
          <FormGroup>
            <Label for="Email">Email</Label>
            <Input type="email" name="email" id="Email" placeholder="with a placeholder" />
          </FormGroup>
          <FormGroup>
            <Label for="Name">Name</Label>
            <Input type="text" name="Name" id="Name" placeholder="with a placeholder" />
          </FormGroup>
          <FormGroup>
            <Label for="exampleText">Text Area</Label>
            <Input type="textarea" name="text" id="exampleText" />
          </FormGroup>
        </Form>
    </div>
  );
}