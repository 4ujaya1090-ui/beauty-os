import { useState } from "react";

import TextField from "../../../shared/components/TextField/TextField";
import PrimaryButton from "../../../shared/components/PrimaryButton/PrimaryButton";

import { useClients, type Client } from "../../context/ClientContext";

import "./CreateClientLogin.css";

type CreateClientLoginProps = {
  client: Client;
};

function CreateClientLogin({ client }: CreateClientLoginProps) {
  const { createClientLogin } = useClients();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [created, setCreated] = useState<{
    email: string;
    password: string;
  } | null>(null);

  async function handleCreate() {
    if (!email.trim() || password.length < 6) {
      window.alert("Укажите email и пароль от 6 символов");
      return;
    }

    setIsCreating(true);

    try {
      await createClientLogin(client.id, email.trim(), password);
      setCreated({ email: email.trim(), password });
    } catch (error) {
      console.error("Не удалось создать вход для клиента:", error);
      window.alert(
        "Не получилось создать вход. Возможно, такой email уже используется."
      );
    } finally {
      setIsCreating(false);
    }
  }

  if (client.authUid) {
    return (
      <div className="create-client-login create-client-login--done">
        ✅ Вход для клиента уже создан
      </div>
    );
  }

  if (created) {
    return (
      <div className="create-client-login create-client-login--done">
        <p>
          Вход создан — сообщите клиенту эти данные (повторно они нигде не
          сохранены, запишите сейчас):
        </p>

        <p className="create-client-login__credentials">
          {created.email} / {created.password}
        </p>
      </div>
    );
  }

  return (
    <div className="create-client-login">
      <TextField
        label="Email клиента"
        type="email"
        value={email}
        onChange={setEmail}
      />

      <TextField
        label="Пароль (от 6 символов)"
        type="text"
        value={password}
        onChange={setPassword}
      />

      <PrimaryButton onClick={handleCreate} disabled={isCreating}>
        {isCreating ? "Создаём..." : "Создать вход для клиента"}
      </PrimaryButton>
    </div>
  );
}

export default CreateClientLogin;
