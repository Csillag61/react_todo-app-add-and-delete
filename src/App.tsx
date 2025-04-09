/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { USER_ID, getTodos } from './api/todos';
import { client } from './utils/fetchClient';
import { Errors } from './types/Errors';
import { Footer } from './components/Footer';
import { ErrorModal } from './components/ErrorModal';
import { FilterBy } from './types/FilterBy';
import { Loader } from './components/Loader';
import { TodoItem } from './components/TodoItem'; // Import TodoItem component

const filter = (todos: Todo[], filterBy: FilterBy) => {
  switch (filterBy) {
    case FilterBy.Active:
      return todos.filter(todo => !todo.completed);
    case FilterBy.Completed:
      return todos.filter(todo => todo.completed);
    case FilterBy.All:
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState(Errors.DEFAULT);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null); // Track the ID of the todo being deleted
  const [isClearingCompleted, setIsClearingCompleted] = useState(false);

  useEffect(() => {
    setLoading(true); // Start loading
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage(Errors.LOAD);
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(Errors.EMPTY);

      return;
    }

    setIsAdding(true);

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID, // Replace with your userId
    };

    setTempTodo(newTempTodo);

    try {
      const newTodo = await client.post<Todo>('/todos', {
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      });

      setTodos(prev => [...prev, newTodo]);
      setNewTodoTitle('');
    } catch (err) {
      setErrorMessage(Errors.ADD);
      setTempTodo(null);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setIsDeleting(todoId);

    try {
      await client.delete(`/todos/${todoId}`);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (err) {
      setErrorMessage(Errors.DELETE);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleClearCompleted = async () => {
    setIsClearingCompleted(true);
    const completedTodos = todos.filter(todo => todo.completed);

    try {
      await Promise.all(
        completedTodos.map(todo => client.delete(`/todos/${todo.id}`)),
      );
      setTodos(prev => prev.filter(todo => !todo.completed));
    } catch (err) {
      setErrorMessage(Errors.DELETE_ID);
    } finally {
      setIsClearingCompleted(false);
    }
  };

  const onToggleTodo = async (todoId: number) => {
    const todoToToggle = todos.find(todo => todo.id === todoId);

    if (!todoToToggle) {
      return;
    }

    try {
      const updatedTodo = await client.patch<Todo>(`/todos/${todoId}`, {
        completed: !todoToToggle.completed,
      });

      setTodos(prev =>
        prev.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch (err) {
      setErrorMessage(Errors.TOGGLE);
    }
  };

  const filteredTodos = filter(todos, filterBy);

  useEffect(() => {
    if (errorMessage !== Errors.DEFAULT) {
      const timer = setTimeout(() => setErrorMessage(Errors.DEFAULT), 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header />
        <form onSubmit={handleAddTodo}>
          <input
            type="text"
            value={newTodoTitle}
            placeholder="What needs to be done?"
            onChange={e => setNewTodoTitle(e.target.value)}
            disabled={isAdding || loading}
            autoFocus
          />
          <button type="submit" disabled={isAdding || loading}>
            Add
          </button>
        </form>
        {loading || isAdding ? (
          <Loader message="Loading your todos..." />
        ) : todos.length > 0 ? (
          <>
            <TodoList
              todos={filteredTodos}
              onDeleteTodo={handleDeleteTodo}
              onToggleTodo={onToggleTodo}
              isDeleting={isDeleting}
            />
            <Footer
              todos={todos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              onClearCompleted={handleClearCompleted}
              isClearingCompleted={isClearingCompleted}
            />
          </>
        ) : (
          <p>No todos found. Add a task to get started!</p>
        )}
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            loading={true} // Pass loading state for the spinner
            onToggle={() => Promise.resolve()} // Provide a dummy onToggle function
          />
        )}
      </div>
      {errorMessage !== Errors.DEFAULT && (
        <ErrorModal
          errorMessage={errorMessage}
          onClearError={() => setErrorMessage(Errors.DEFAULT)}
        />
      )}
    </div>
  );
};
