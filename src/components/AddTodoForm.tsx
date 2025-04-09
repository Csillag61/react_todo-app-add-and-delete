export const AddTodoForm: React.FC<{
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  handleAddTodo: (e: React.FormEvent) => void;
  isAdding: boolean;
}> = ({ newTodoTitle, setNewTodoTitle, handleAddTodo, isAdding }) => (
  <form onSubmit={handleAddTodo}>
    <input
      type="text"
      value={newTodoTitle}
      placeholder="What needs to be done?"
      onChange={e => setNewTodoTitle(e.target.value)}
      disabled={isAdding}
      autoFocus
    />
    <button type="submit" disabled={isAdding}>
      Add
    </button>
  </form>
);
