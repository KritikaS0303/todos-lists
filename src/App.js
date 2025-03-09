import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./MyComponents/Header";
import { Todos } from "./MyComponents/Todos";
import TempTodo from "./MyComponents/TempTodo";
import { Login } from "./MyComponents/Login";
import { Footer } from "./MyComponents/Footer";
import { About } from "./MyComponents/About";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  let initTodo;
  if (localStorage.getItem("todosList") === null) {
    initTodo = [];
  } else {
    initTodo = JSON.parse(localStorage.getItem("todosList"));
  }

  const [todosList, setTodosList] = useState(initTodo);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  useEffect(() => {
    const user = localStorage.getItem("isLoggedIn");
    if (user === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const tempTodo = (title, desc, priority) => {
    console.log("Adding todo:", title, desc, priority);
    let sno;
    if (todosList.length === 0) {
      sno = 0;
    } else {
      sno = todosList[todosList.length - 1].sno + 1;
    }

    const myTodo = {
      sno: sno,
      title: title,
      desc: desc,
      priority: priority,
    };
    setTodosList([...todosList, myTodo]);
  };

  useEffect(() => {
    localStorage.setItem("todosList", JSON.stringify(todosList));
  }, [todosList]);

  const onDelete = (todo) => {
    console.log("Deleting todo:", todo);
    setTodosList(todosList.filter((t) => t.sno !== todo.sno));
  };

  const handleLogin = (username, password) => {
    if (username && password) {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
    } else {
      alert("Please enter both username and password.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <>
      <Router>
        {/* Removed dark mode button */}
        <Header title="MyTodosList" searchBar={false} />
        <Routes>
          {/* Redirect to login if not logged in */}
          <Route
            exact
            path="/"
            element={isLoggedIn ? (
              <>
                <TempTodo tempTodo={tempTodo} />
                <Todos todos={todosList} onDelete={onDelete} />
              </>
            ) : (
              <Navigate to="/login" />
            )}
          />
          {/* Protect About page */}
          <Route
            exact
            path="/about"
            element={isLoggedIn ? <About /> : <Navigate to="/login" />}
          />
          {/* Login Route */}
          <Route
            exact
            path="/login"
            element={<Login handleLogin={handleLogin} />}
          />
        </Routes>
        {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        <Footer />
      </Router>
    </>
  );
}

export default App;
