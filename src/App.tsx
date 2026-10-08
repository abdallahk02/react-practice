import { useState, useRef, useEffect, MouseEvent } from "react";

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
  handleAdd: (text: string | null) => void,
  handleDelete: () => void;
}

type FilterProps = {
  filter: FilterType;
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

  const handleSubmit = (e : MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const taskText = inputRef.current?.value || null;
    handleAdd(taskText);
    if (inputRef.current){
      inputRef.current.value = "";
    }
  };

  return (
    <>
      <div style={{ paddingBottom: 10 }}>
        <input type="text" ref={inputRef} placeholder="Enter task..."/>
      </div>
      <div className="inline-element">
        <button onClick={handleSubmit}>Add task</button>
      </div>
      <div className="inline-element" style={{ padding: 10 }}>
        <button onClick={handleDelete}>Clear complete tasks</button>
      </div>
    </>
  );
}

function filter({ filter, onFilter } : FilterProps) {
  return (
    <fieldset>
      <label>
        <input
          type="radio"
          name="tasks"
          value="all"
          checked={filter === 'all'}
          onChange={() => onFilter("all")}
        />
        All
      </label>
      <label>
        <input
          type="radio"
          name="tasks"
          value="todo"
          checked={filter === 'todo'}
          onChange={() => onFilter("todo")}
        />
        Active
      </label>
      <label>
        <input
          type="radio"
          name="tasks"
          value="done"
          checked={filter === 'done'}
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
  const [filter, setfilter] = useState<FilterType>('all');

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const handleAdd = (text: string | null) => {
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
    setfilter(status);
  };

  let filteredItems = items;
  if (filter === "todo") {
    filteredItems = filteredItems.filter((item:Item) => !item.done);
  } else if (filter === "done") {
    filteredItems = filteredItems.filter((item:Item) => !item.done);
  }
  return (
    <>
      <h1>TO-DO</h1>
      <filter filter={filter} onFilter={onFilter} />
      <List items={filteredItems} onToggle={onToggle} />
      <ManageItems handleAdd={handleAdd} handleDelete={handleDelete} />
    </>
  );
}
