import { useState } from "react";

import GlassCard from "../../../shared/components/GlassCard/GlassCard";
import TextField from "../../../shared/components/TextField/TextField";
import PrimaryButton from "../../../shared/components/PrimaryButton/PrimaryButton";

import { useAuth } from "../../context/AuthContext";

import "./LoginPage.css";

function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Введите email и пароль");
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
    } catch {
      setError("Неверный email или пароль");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <GlassCard>
        <div className="login-card">
          <h1 className="login-title">Beauty OS</h1>
          <p className="login-subtitle">Вход для косметолога</p>

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
          />

          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={setPassword}
          />

          {error && <p className="login-error">{error}</p>}

          <PrimaryButton onClick={handleSubmit}>
            {isSubmitting ? "Входим..." : "Войти"}
          </PrimaryButton>
        </div>
      </GlassCard>
    </div>
  );
}

export default LoginPage;