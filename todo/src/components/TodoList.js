import React, { useState, useEffect } from "react";
import ListItem from "./ListItem";
import "./../styles/App.css";

export default function TodoList(props) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    //tbd in class
  };
  const newItemChanged = (evt) => {
    setNewItem(evt.target.value);
  };

  const deleteHandler = (itemIdx) => {
    //tbd in class
  };

  const editHandler = (editedValue, itemIdx) => {
    //tbd in class
  };

  useEffect(() => {
    //tbd in class
    
  }, []);

  return (
    <div id="main">
        <div className="user">
            <div>Username: <b>{props.username}</b></div>
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
