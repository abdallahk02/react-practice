import { useState, useRef, useEffect, MouseEvent, SubmitEvent } from "react";

type FilterType = "all" | "todo" | "done";

type Item = {
  id: string,
  text: string,
  done: boolean,
}

type LineProps = {
  item: Item,
  onToggle : (id : string) => void,
}

type ListProps = {
  items: Array<Item>,
  onToggle : (id : string) => void,
}

type ManagerProps = {
  handleAdd: (text: string) => void,
  handleDelete: () => void;
}

type FilterProps = {
  currFilter: FilterType;
  onFilter: (status: FilterType) => void
}


function Line({ item, onToggle } : LineProps) {
  return (
    <div style={{ padding: 0 }}>
      <input
        type="checkbox"
        checked={item.done}
        onChange={() => onToggle(item.id)}
      />
      {item.done ? <s>{item.text}</s> : item.text}
    </div>
  );
}

function List({ items, onToggle } : ListProps) {
  return (
    <ul style={{ listStyleType: "none", padding: 10, margin: 0 }}>
      {items.map((it : Item) => (
        <li key={it.id}>
          <Line item={it} onToggle={onToggle} />
        </li>
      ))}
    </ul>
  );
}

function ManageItems({ handleAdd, handleDelete } : ManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e : SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const taskText = inputRef.current?.value.trim();
    if (taskText){
      handleAdd(taskText);
    }
    if (inputRef.current){
      inputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit}>
\     <input type="text" ref={inputRef} placeholder="Enter task..."/>
      <button type="submit">Add task</button>
      <button onClick={handleDelete}>Clear complete tasks</button>
    </form>
  );
}

function TaskFilter({ currFilter, onFilter } : FilterProps) {
  return (
    <fieldset>
      <label>
        <input
          type="radio"
          name="tasks"
          value="all"
          checked={currFilter === 'all'}
          onChange={() => onFilter("all")}
        />
        All
      </label>
      <label>
        <input
          type="radio"
          name="tasks"
          value="todo"
          checked={currFilter === 'todo'}
          onChange={() => onFilter("todo")}
        />
        Active
      </label>
      <label>
        <input
          type="radio"
          name="tasks"
          value="done"
          checked={currFilter === 'done'}
          onChange={() => onFilter("done")}
        />
        Complete
      </label>
    </fieldset>
  );
}

export default function App() {
  const [items, setItems] = useState<Array<Item>>(() => {
    const stored = localStorage.getItem("items");
    return stored ? JSON.parse(stored) : [];
  });
  const [currFilter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const handleAdd = (text: string) => {
    console.log(text ? text : "null");
    
    if (!text) {
      return;
    }
    const newItems: Array<Item> = items.slice();
    const newId = crypto.randomUUID();
    newItems.push({ id: newId, text: text, done: false });
    setItems(newItems);
  };

  const onToggle = (id : string) => {
    setItems((prev : Array<Item>) =>
      prev.map((u) =>
        u.id === id ? { id: u.id, text: u.text, done: !u.done } : u
      )
    );
  };

  const handleDelete = () => {
    const newItems = items.slice().filter((item: Item) => !item.done);
    setItems(newItems);
  };

  const onFilter = (status:FilterType) => {
    setFilter(status);
  };

  let filteredItems = items;
  if (currFilter === "todo") {
    filteredItems = filteredItems.filter((item:Item) => !item.done);
  } else if (currFilter === "done") {
    filteredItems = filteredItems.filter((item:Item) => item.done);
  }
  return (
    <>
      <h1>TO-DO</h1>
      <TaskFilter currFilter={currFilter} onFilter={onFilter} />
      <List items={filteredItems} onToggle={onToggle} />
      <ManageItems handleAdd={handleAdd} handleDelete={handleDelete} />
    </>
  );
}
