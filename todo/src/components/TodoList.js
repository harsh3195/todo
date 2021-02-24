import React, { useState, useEffect } from "react";
import ListItem from "./ListItem";
import "./../styles/App.css";

export default function TodoList(props) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    fetch("http://localhost:9999/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        task: newItem,
      }),
    })
      .then((r) => r.json())
      .then((r) => {
        setNewItem("");
        items.push(r);
        setItems([...items]);
        //tbd in class
      });
  };
  const newItemChanged = (evt) => {
    setNewItem(evt.target.value);
  };

  const deleteHandler = (itemIdx) => {
    //tbd in class
    const idToDelete = items[itemIdx]._id;
    fetch(`http://localhost:9999/todo/${idToDelete}`, {
      method: "DELETE", credentials: "include"  
    }).then((r) => {
      console.log("Got successfully DELETE");
      items.splice(itemIdx, 1);
      setItems([...items]);
    });
  };

  const editHandler = (editedValue, itemIdx) => {
    //tbd in class
    const idToEdit = items[itemIdx]._id;
    fetch(`http://localhost:9999/todo/${idToEdit}`, {
      method: "PUT",
      body: JSON.stringify({ task: editedValue }),
      headers: {
        "Content-Type": "application/json",
      },
       credentials: "include"  
    })
      .then((r) => r.json())
      .then((resp) => {
        console.log("Got successfully response from PUT", resp);
        items[itemIdx] = resp;
        setItems([...items]);
      });
  };
  

  useEffect(() => {
    //tbd in class
    fetch("http://localhost:9999/todo", { credentials: "include" })
      .then((r) => r.json())
      .then((arr) => {
        setItems(arr);
      });
  }, []);

  return (
    <div id="main">
      <div className="user">
        <div>
          Username: <b>{props.username}</b>
        </div>
        <button onClick={props.logoutHandler}>Log Out</button>
      </div>
      <div className="new">
        <textarea
          id="task"
          onChange={newItemChanged}
          placeholder="New Item"
          value={newItem}
        ></textarea>
        <button
          id="btn"
          onClick={addItem}
          disabled={newItem.trim().length === 0}
        >
          Add Item
        </button>
      </div>
      {items.map((item, idx) => (
        <ListItem
          item={item}
          key={item._id}
          idx={idx}
          editHandler={editHandler}
          deleteHandler={deleteHandler}
        />
      ))}
    </div>
  );
}
