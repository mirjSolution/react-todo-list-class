import React, { Component } from 'react';
import axios from 'axios';

import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

class ToDo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: props.todos,
      show: props.show,
      display: props.display,
      id: 0,
      title: '',
      addEdit: true,
    };
  }

  // Delete Todo
  onDelete = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);

      const deleteTodos = this.state.todos.filter((todo) => {
        return todo.id !== id;
      });
      this.setState({ todos: deleteTodos });
    } catch (err) {
      console.log(err);
    }
  };

  // Change Todo Status
  changecompleted = async (e, id) => {
    const completed = e.target.checked;

    try {
      const updateCompleted = {
        completed: completed,
      };
      await axios.patch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        updateCompleted
      );

      const updatedTodos = this.state.todos.map((todo) => {
        if (parseInt(todo.id) === parseInt(id)) {
          todo.completed = completed;
        }
        return todo;
      });
      this.setState({ todos: updatedTodos });
    } catch (err) {
      console.error(err);
    }
  };

  onAddTodo = async () => {
    const newTodo = {
      id: Math.floor(Math.random() * (2000 - 201) + 201),
      title: this.state.title,
    };
    console.log(Math.floor(Math.random() * (2000 - 201) + 201));
    try {
      await axios.post('https://jsonplaceholder.typicode.com/todos', newTodo);

      const updatedTodos = [...this.state.todos, newTodo];

      const sortTodos = updatedTodos.sort((a, b) => {
        return b.id - a.id;
      });

      this.setState({
        todos: sortTodos,
      });
      this.handleClose();
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  };

  // Handle todo add
  handleAdd = () => {
    this.setState({
      addEdit: true,
      display: 'block',
      show: 'show',
      title: '',
      id: '',
    });
  };

  handleClose = () => {
    this.setState({ display: 'none', show: 'hide' });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleEdit = async (id, title) => {
    this.setState({
      show: 'show',
      display: 'block',
      id: id,
      title: title,
      addEdit: false,
    });

    if (!this.state.addEdit) {
      const updateTodo = {
        title: title,
      };
      try {
        await axios.patch(
          `https://jsonplaceholder.typicode.com/todos/${id}`,
          updateTodo
        );

        const updatedTodos = this.state.todos.map((todo) => {
          if (parseInt(todo.id) === parseInt(id)) {
            todo.title = title;
          }
          return todo;
        });

        this.setState({
          todos: updatedTodos,
          addEdit: true,
        });
        this.handleClose();
      } catch (err) {
        console.log(err);
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <div
          className={`modal fade ${this.state.show} `}
          id='exampleModal'
          tabIndex='-1'
          aria-labelledby='exampleModalLabel'
          aria-hidden='true'
          style={{
            display: this.state.display,
            backgroundColor: 'rgba(33, 37, 41, 0.7)',
          }}
        >
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title' id='exampleModalLabel'>
                  Todo List
                </h5>
                <button
                  type='button'
                  className='close'
                  data-dismiss='modal'
                  aria-label='Close'
                  onClick={this.handleClose}
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <form>
                  <div className='form-group' style={{ display: 'none' }}>
                    <label className='col-form-label'>ID:</label>
                    <input
                      type='text'
                      className='form-control'
                      name='id'
                      value={this.state.id}
                      onChange={this.onChange}
                    />
                  </div>
                  <div className='form-group'>
                    <label className='col-form-label'>TO DO:</label>
                    <input
                      type='text'
                      name='title'
                      className='form-control'
                      value={this.state.title}
                      onChange={this.onChange}
                    />
                  </div>
                </form>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  data-dismiss='modal'
                  onClick={this.handleClose}
                >
                  Close
                </button>
                <button
                  type='button'
                  className='btn btn-primary'
                  onClick={
                    this.state.addEdit === false
                      ? () => this.handleEdit(this.state.id, this.state.title)
                      : this.onAddTodo
                  }
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        <table className='table table-hover'>
          <thead>
            <tr>
              <th scope='col'>
                <span style={{ cursor: 'pointer' }} onClick={this.handleAdd}>
                  <FaPlus style={{ position: 'relative', bottom: '1.3px' }} />
                  ADD TO DOS
                </span>
              </th>
              <th scope='col' className='text-center'>
                COMPLETED
              </th>
              <th scope='col' className='text-center'>
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.todos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.title}</td>
                <td>
                  <div
                    className='d-flex justify-content-center'
                    style={{ cursor: 'pointer' }}
                  >
                    <input
                      className='text-primary'
                      type='checkbox'
                      defaultChecked={todo.completed}
                      onChange={(e) => this.changecompleted(e, todo.id)}
                      style={{
                        marginRight: '2px',
                        position: 'relative',
                        top: '2.5px',
                      }}
                    />
                  </div>
                </td>
                <td>
                  <div
                    style={{ cursor: 'pointer' }}
                    className='d-flex justify-content-center'
                  >
                    <FaEdit
                      onClick={() => this.handleEdit(todo.id, todo.title)}
                      className='text-success'
                    />
                    <FaTrash
                      onClick={() => this.onDelete(todo.id)}
                      className='text-danger'
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default ToDo;
