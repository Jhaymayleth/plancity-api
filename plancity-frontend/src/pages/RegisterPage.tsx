import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
      });

      navigate("/");
    } catch {
      setError("No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Crear cuenta</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre</label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Correo</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Registrarse"}
        </button>
      </form>

      <p>
        ¿Ya tienes una cuenta?{" "}
        <Link to="/login">Iniciar sesión</Link>
      </p>
    </main>
  );
}