// src/pages/Login.jsx
import React, { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/login", { username, password });

      const token = res.headers["authorization"]?.split(" ")[1];
      if (token) {
        localStorage.setItem("token", token);
        navigate("/");
      }
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div
      className="container justify-content-between align-items-center mt-4"
      style={{ padding: "10% 20% 0 20%" }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "10%" }}>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type=""
          placeholder="Username"
          className="form-control mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary w-100">Login</button>
      </form>
      <Link
        to="/register"
        className="d-block text-center my-3 btn btn-outline-secondary"
      >
        New User? Register here!
      </Link>
    </div>
  );
};

export default Login;
