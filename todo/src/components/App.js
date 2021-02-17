import React, { useState, useEffect } from "react";
import TodoList from "./TodoList";
import LoginForm from "./LoginForm";
import "./../styles/App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(undefined);
  const [userName, setUserName] = useState(undefined);

  const getUserName = () => {
    //tbd in class
    fetch("http://localhost:9999/userinfo",{
      method:"GET",
      credentials:"include"
    }).then(r=>{
      if(!r.ok){
        setLoggedIn(false);
        //setUserName(undefined);
        return {success:false}
      }else{
        return r.json();
      }
    }).then(r=>{
      if(r.success!==false){
        setUserName(r.userName);
      }
    })
  }

  useEffect(() => {
    getUserName();
  }, []);


  const signupHandler = (username, password) => {
    loginOrSignup('http://localhost:9999/signup', username, password);
  };
  const loginHandler = (username, password) => {
    loginOrSignup('http://localhost:9999/login', username, password);
  };

  const logoutHandler = () => {
    //tbd in class
  };


  const loginOrSignup = (url, username, password) => {
    //tbd in class
  }
  return loggedIn ? (
    <TodoList username={userName} logoutHandler={logoutHandler}/>
  ) : (
    <LoginForm
      signupHandler={signupHandler}
      loginHandler={loginHandler}
      error={error}
    />
  );
}

export default App;
