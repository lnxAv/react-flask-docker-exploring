import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import 'bootstrap/dist/css/bootstrap.css';

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
    axios({
      method: 'post',
      url: "http://localhost:5000/api/v1.0/get_message_info",
      data: {
        message_id: ''
      }
    })
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          items: result,
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    )
  }

  render() {
    const {error, isLoaded, items} = this.state;
    if (error) {
      console.log(error)
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <p>
          {items}
        </p>
      );
    }
  }
}


ReactDOM.render(
  <App>
    
  </App>,
  document.getElementById('root')
);