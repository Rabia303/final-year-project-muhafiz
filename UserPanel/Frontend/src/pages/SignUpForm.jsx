import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registration successful!");
      navigate("/login");
    } catch {
      alert("Registration failed");
    }
  };
return (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <div className="auth-form glass-card">
      <div className="form-header">
        <h2>Create Account</h2>
        <p className="form-subtext">Join Muhafiz and stay alert</p>
      </div>
      <form onSubmit={handleSubmit} className="premium-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="premium-input"
            required
          />
        </div>

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
            placeholder="Create a secure password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="premium-input"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn form-cta glow-btn">Sign Up</button>
        </div>
      </form>
      <p style={{ marginTop: '12px', fontSize: '14px' }}>
        Have an account?{' '}
        <span
          style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => navigate('/login')}
        >
          Log in
        </span>
      </p>
    </div>
  </div>
);

}

export default SignupForm;
