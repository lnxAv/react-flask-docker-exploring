import React, { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

export function Panel(props) {
  useEffect(() => {
    // Update the document title using the browser API
    return () =>{
    }
  }, [props]);

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