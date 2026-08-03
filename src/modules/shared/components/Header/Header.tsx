import { useAuth } from "../../../auth/context/AuthContext";
import { useProfile } from "../../../auth/context/ProfileContext";

import "./Header.css";

function Header() {
  const { logout } = useAuth();
  const { profile } = useProfile();

  return (
    <header className="header">
      <div className="header__row">
        <div>
          <h1 className="header__title">
            Здравствуйте, {profile?.name ?? ""}
          </h1>

          <p className="header__subtitle">
            {profile?.specialization
              ? `${profile.specialization} · Beauty OS`
              : "Добро пожаловать в Beauty OS"}
          </p>
        </div>

        <button className="header__logout" onClick={() => logout()}>
          Выйти
        </button>
      </div>
    </header>
  );
}

export default Header;