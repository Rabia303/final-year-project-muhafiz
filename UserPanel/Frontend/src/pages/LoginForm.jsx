import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../utils/authUtils";

function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const user = getStoredUser();
    if (user) navigate("/");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Logged in successfully!");
      navigate("/");
    } catch {
      alert("Login failed");
    }
  };
return (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <div className="auth-form glass-card">
      <div className="form-header">
        <h2>Login to Muhafiz</h2>
        <p className="form-subtext">Access community safety features</p>
      </div>
      <form onSubmit={handleLogin} className="premium-form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="premium-input"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="premium-input"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn form-cta glow-btn">Login</button>
        </div>
      </form>
      <p style={{ marginTop: '12px', fontSize: '14px' }}>
        Don’t have an account?{' '}
        <span
          style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => navigate('/signup')}
        >
          Sign up
        </span>
      </p>
    </div>
  </div>
);


}

export default LoginForm;
