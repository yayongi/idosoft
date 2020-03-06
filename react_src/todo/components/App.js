import React, { Component } from 'react';
import PageTemplate from './PageTemplate';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import axios from 'axios';

class App extends Component {

  // todos : 일정목록
  // input : 입력값
  state = {
    input: '',
    todos: []
  }

  // 입력창에 onchange 이벤트 발생 시, 호출
  handleChange = (e) => {
    const { value } = e.target;
    this.setState({
      input: value
    });
  }
  // 추가 버튼 클릭 시, 호출
  handleInsert = (e) => {
    const { todos, input } = this.state;

    const newTodo = {
      text: input,
      done: false,
      id: -1
    };


    axios.post('/intranet/todo/item/' + input)
      .then(response => {
        const { id } = response.data;
        console.log("handleInsert [id]: ", id);
        newTodo.id = id;
        this.setState({
          todos: [...todos, newTodo],
          input: ''
        });
        console.log(this.state.todos);
      })
      .catch(e => {
        console.log(e);
      });
  }

  handleToggle = (id) => {
    const { todos } = this.state;
    const index = todos.findIndex(todo => todo.id === id);

    const toggled = {
      ...todos[index],
      done: !todos[index].done
    };

    axios.put('/intranet/todo/item/state/' + id +'/' + (toggled.done?1:0))
      .then(response => {
        const { result } = response.data;
        console.log("handleRemove [result]: ", result);
        this.setState({
          todos: [
            ...todos.slice(0, index),
            toggled,
            ...todos.slice(index + 1, todos.length)
          ]
        });
      })
      .catch(e => {
        alert("일정 상태 변경이 실패하였습니다.");
        return false;
      });
  }

  // 지우기 버튼 클릭 시, 호출
  handleRemove = (id) => {
    const { todos } = this.state;
    const index = todos.findIndex(todo => todo.id === id);

    axios.delete('/intranet/todo/item/' + id)
      .then(response => {
        const { result } = response.data;
        console.log("handleRemove [result]: ", result);
        this.setState({
          todos: [
            ...todos.slice(0, index),
            ...todos.slice(index + 1, todos.length)
          ]
        });
      })
      .catch(e => {
        alert("일정 삭제가 실패하였습니다.");
        return false;
      });


  }

  componentDidMount() {
    axios.get('/intranet/todo/list')
      .then(response => {
        const todoList = response.data.todoList.map((todo) => {
          return {
            ...todo,
            "done" : todo.completeYn
          }
        });
        console.log(todoList);


        this.setState({
          todos: todoList
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { input, todos } = this.state;
    const { handleChange, handleInsert, handleToggle, handleRemove } = this;

    return (
      <div>
        <PageTemplate>
          <TodoInput onChange={handleChange} value={input} onInsert={handleInsert}></TodoInput>
          <TodoList todos={todos} onToggle={handleToggle} onRemove={handleRemove}></TodoList>
        </PageTemplate>
      </div>
    );
  }
}

export default App;