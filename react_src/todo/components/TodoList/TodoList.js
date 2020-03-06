import React, { Component } from 'react';
import TodoItem from '../TodoItem';

class TodoList extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.todos !== nextProps.todos;
    }
    render() {
        const { todos, onToggle, onRemove } = this.props;
        let todoList = [];
        if(todos && todos.length > 0) {
            todoList = todos.map(
                todo => (
                    <TodoItem
                        key={todo.id}
                        done={todo.done}
                        onToggle={() => onToggle(todo.id)} 
                        onRemove={() => onRemove(todo.id)}>
                        {todo.text}
                    </TodoItem>
                )
            );
        } 
        return (
            //<div>
            //    <TodoItem done>리액트 공부하기</TodoItem>
            //   <TodoItem>컴포넌트 스타일링 해보기</TodoItem>
            //</div>
            <div>{todoList}</div>
        );
    }
}

export default TodoList;