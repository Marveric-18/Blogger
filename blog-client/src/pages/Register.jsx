import React, { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/user/register", { username, email, password });
      alert("Registration successful! You can now login.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
      console.error(err);
    }
  };

  return (
    <div
      className="container justify-content-between align-items-center mt-4"
      style={{ padding: "10% 20% 0 20%" }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "10%" }}>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          className="form-control mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="form-control mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-success w-100">Register</button>
      </form>
      <Link
        to="/login"
        className="d-block text-center my-3 btn btn-outline-secondary"
      >
        Already have an account? Login
      </Link>
    </div>
  );
};

export default Register;