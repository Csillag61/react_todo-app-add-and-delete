import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => Promise<void>;
  isDeleting: number | null;
  onToggleTodo: (todoId: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({ todos, onToggleTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggleTodo} />
      ))}
    </section>
  );
};
