import axios from "axios";

const API_URL = "http://localhost:3000/api/auth/";

const register = (username: string, email: string, password: string) => {
  return axios.post(`${API_URL}signup`, {
    username,
    email,
    password,
  });
};

const login = async (username: string, password: string) => {
  const dataResponse = await axios.post(`${API_URL}signin`, {
    username,
    password,
  });

  if (dataResponse.data.username) {
    localStorage.setItem("user", JSON.stringify(dataResponse.data));
  }

  return dataResponse.data;
};

const logout = async () => {
  localStorage.removeItem("user");

  const response = await axios.post(`${API_URL}signout`);

  return response.data;
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user") || "");
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
