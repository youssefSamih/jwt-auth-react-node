import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { initialState as authState } from "../slices/auth";

export const Profile = () => {
  const { user: currentUser } = useSelector(
    (state: { auth: typeof authState }) => state.auth
  );

  return !currentUser ? (
    <Navigate to="/login" />
  ) : (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.username}</strong> Profile
        </h3>
      </header>

      <p>
        <strong>Id:</strong> {currentUser.id}
      </p>

      <p>
        <strong>Email:</strong> {currentUser.email}
      </p>

      <strong>Authorities:</strong>

      {currentUser.roles ? (
        <ul>
          {currentUser.roles.map((role, index) => (
            <li key={index}>{role}</li>
          ))}
        </ul>
      ) : undefined}
    </div>
  );
};
