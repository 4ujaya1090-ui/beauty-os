import "./Header.css";

type HeaderProps = {
  userName: string;
};

function Header({ userName }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header__title">
        Здравствуйте, {userName}
      </h1>

      <p className="header__subtitle">
        Добро пожаловать в Beauty OS
      </p>
    </header>
  );
}

export default Header;