import React from 'react';
import ReactDOM from 'react-dom';
import { MessageContainer } from './MessageContainer/component';
import './index.css'
import 'bootstrap/dist/css/bootstrap.css'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    };
  }
  componentDidMount() {
  }

  render() {
    return (
      <>
        <MessageContainer />
      </>
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('root')
);