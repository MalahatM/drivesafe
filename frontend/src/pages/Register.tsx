import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { registerSchema } from "../validation/userValidation";
import { ZodError } from "zod";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userscar, setUserscar] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      //  validate form data
      registerSchema.parse({ username, email, password, userscar });
    } catch (err) {
      if (err instanceof ZodError) {
      
        const firstError = err.issues[0]?.message || "Validation failed";
        setMessage(firstError);
      } else {
        setMessage("Validation failed");
      }
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, userscar }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(" Registered successfully!");
        setUsername("");
        setEmail("");
        setPassword("");
        setUserscar("");
      } else {
        setMessage(` Error: ${data.error || "Registration failed"}`);
      }
    } catch {
      setMessage("Error connecting to server");
    }
  };

  return (
    <div className="register-container">
      <h1>Register Here</h1>

      <form onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Car model"
          value={userscar}
          onChange={(e) => setUserscar(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>

      {message && <p className="message">{message}</p>}

      <div className="register-buttons">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </div>
  );
}

export default Register;
