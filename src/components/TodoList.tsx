import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => Promise<void>;
  isDeleting: number | null;
  onToggleTodo: (todoId: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onToggleTodo,
  onDeleteTodo,
  isDeleting,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggleTodo}
          onDelete={onDeleteTodo} // Pass the delete function
          isDeleting={isDeleting === todo.id} // Pass deletion state for the specific todo
        />
      ))}
    </section>
  );
};
