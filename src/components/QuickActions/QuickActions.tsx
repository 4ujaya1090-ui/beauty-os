import "./QuickActions.css";
import { useNavigate } from "react-router-dom";

function QuickActions() {
  const navigate = useNavigate();

  return (
    <section className="quick-actions">
      <button onClick={() => navigate("/appointment")}>
        Запись
      </button>

      <button>
        Календарь
      </button>

      <button>
        Прайс
      </button>
    </section>
  );
}

export default QuickActions;