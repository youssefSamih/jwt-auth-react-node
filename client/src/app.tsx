import "bootstrap/dist/css/bootstrap.min.css";
import "./app.css";

import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import { BoardAdmin } from "./app/components/board-admin";
import { BoardModerator } from "./app/components/board-moderator";
import { BoardUser } from "./app/components/board-user";
import { Home } from "./app/components/home";
import { Login } from "./app/components/login";
import { Profile } from "./app/components/profile";
import { Register } from "./app/components/register";

import { initialState as authState, logout } from "./app/slices/auth";

function App() {
  const dispatch = useDispatch<any>();

  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);

  const { user: currentUser } = useSelector(
    (state: { auth: typeof authState }) => state.auth
  );

  const LoginComponent = currentUser ? Link : "a";

  const logOut = useCallback(() => {
    dispatch(logout(dispatch));
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setShowModeratorBoard(!!currentUser.roles?.includes("ROLE_MODERATOR"));
      setShowAdminBoard(!!currentUser.roles?.includes("ROLE_ADMIN"));

      return;
    }

    setShowModeratorBoard(false);
    setShowAdminBoard(false);
  }, [currentUser]);

  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to="/" className="navbar-brand">
          Youssef
        </Link>

        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to="/home" className="nav-link">
              Home
            </Link>
          </li>

          {showModeratorBoard ? (
            <li className="nav-item">
              <Link to="/mod" className="nav-link">
                Moderator Board
              </Link>
            </li>
          ) : undefined}

          {showAdminBoard ? (
            <li className="nav-item">
              <Link to="/admin" className="nav-link">
                Admin Board
              </Link>
            </li>
          ) : undefined}

          {currentUser ? (
            <li className="nav-item">
              <Link to="/user" className="nav-link">
                User
              </Link>
            </li>
          ) : undefined}

          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link
                to={currentUser ? "/profile" : "/register"}
                className="nav-link"
              >
                {currentUser?.username || "Sign Up"}
              </Link>
            </li>
            <li className="nav-item">
              <LoginComponent
                to="/login"
                href="/login"
                className="nav-link"
                onClick={currentUser ? logOut : undefined}
              >
                {currentUser ? "LogOut" : "Login"}
              </LoginComponent>
            </li>
          </div>
        </div>
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user" element={<BoardUser />} />
          <Route path="/mod" element={<BoardModerator />} />
          <Route path="/admin" element={<BoardAdmin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
