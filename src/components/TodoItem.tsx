import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  loading?: boolean;
  onToggle: (todoId: number) => Promise<void>;
  onDelete?: (todoId: number) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onToggle,
  onDelete,
  loading = false,
}) => {
  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      if (onDelete) {
        await onDelete(id);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete the todo:', error);
      alert('Failed to delete the todo. Please try again.');
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor={`todo-${todo.id}`} className="todo__status-label">
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          title="Toggle todo status"
          onChange={() => onToggle(todo.id)}
          aria-label="Mark as completed"
          aria-checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        title="Delete todo"
        onClick={() => handleDelete(todo.id)}
      >
        ×
      </button>

      {loading && (
        <div
          data-cy="TodoLoader"
          className="modal overlay"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
