import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { loginSchema } from "../validation/userValidation";
import { ZodError } from "zod";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      loginSchema.parse({ email, password });
    } catch (err) {
      if (err instanceof ZodError) {
        setMessage(err.issues[0].message);
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Login successful!");
      } else {
        setMessage(`❌ ${data.error || "Login failed"}`);
      }
    } catch {
      setMessage("❌ Error connecting to server");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
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
      </form>

      {message && <p className="message">{message}</p>}

      <div className="login-buttons">
        <button type="submit" onClick={handleSubmit}>Login</button>
        <button onClick={() => navigate("/")}>Home</button>
      </div>
    </div>
  );
}

export default Login;
