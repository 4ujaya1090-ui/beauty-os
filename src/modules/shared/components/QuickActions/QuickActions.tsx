import "./QuickActions.css";
import { useNavigate } from "react-router-dom";

function QuickActions() {
  const navigate = useNavigate();

  return (
    <section className="quick-actions">
      <button onClick={() => navigate("/calendar")}>
  Календарь
</button>

     <button onClick={() => navigate("/procedures")}>
  Прайс
</button>
    </section>
  );
}

export default QuickActions;