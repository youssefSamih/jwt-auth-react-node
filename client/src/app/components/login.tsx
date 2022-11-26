import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { initialState as authState, login } from "../slices/auth";
import { initialState as messageState } from "../slices/message";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useSelector(
    (state: { auth: typeof authState }) => state.auth
  );

  const { message } = useSelector(
    (state: { message: typeof messageState }) => state.message
  );

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("This field is required !"),
    password: Yup.string().required("This field is required !"),
  });

  const handleLogin = async (formValue: { username: any; password: any }) => {
    const { username, password } = formValue;

    setLoading(true);

    dispatch(login({ username, password }))
      .unwrap()
      .then(() => {
        navigate("/profile");
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return isLoggedIn ? (
    <Navigate to="/profile" />
  ) : (
    <div className="col-md-12 login-form">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="username">Username</label>

                <Field
                  name="username"
                  type="text"
                  className={`form-control ${
                    errors.username && touched.username ? "is-invalid" : ""
                  }`}
                />

                <ErrorMessage
                  name="username"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>

                <Field
                  name="password"
                  type="password"
                  className={`form-control ${
                    errors.password && touched.password ? "is-invalid" : ""
                  }`}
                />

                <ErrorMessage
                  name="password"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : undefined}

                  <span>Login</span>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {message ? (
        <div className="form-group">
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        </div>
      ) : undefined}
    </div>
  );
};
