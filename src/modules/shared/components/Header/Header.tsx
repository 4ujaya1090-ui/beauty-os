import { useAuth } from "../../../auth/context/AuthContext";

import "./Header.css";

type HeaderProps = {
  userName: string;
};

function Header({ userName }: HeaderProps) {
  const { logout } = useAuth();

  return (
    <header className="header">
      <div className="header__row">
        <div>
          <h1 className="header__title">
            Здравствуйте, {userName}
          </h1>

          <p className="header__subtitle">
            Добро пожаловать в Beauty OS
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