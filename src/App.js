import React, { Component } from 'react';
import axios from 'axios';

import Loading from './components/Loading';
import ToDo from './components/ToDo';

class App extends Component {
  state = { todos: [] };

  async componentDidMount() {
    let result = await axios.get('https://jsonplaceholder.typicode.com/todos');
    await new Promise((x) => setTimeout(x, 1000));
    this.setState({ todos: result.data });
  }

  render() {
    return (
      <div className='container'>
        {this.state.todos.length > 0 ? (
          <div>
            <ToDo todos={this.state.todos} />
          </div>
        ) : (
          <div
            className='d-flex justify-content-center align-items-center'
            style={{ minHeight: '100vh' }}
          >
            <Loading />
          </div>
        )}
      </div>
    );
  }
}

export default App;
