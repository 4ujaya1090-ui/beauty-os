import "./ClientInfoPanel.css";
import GlassCard from "../GlassCard/GlassCard";

function ClientInfoPanel() {
  return (
    <GlassCard>

      <div className="client-info">

        <div className="client-avatar">
          Фото
        </div>

        <h2 className="client-name">
          Анна Иванова
        </h2>

        <span className="client-vip">
          ★ VIP
        </span>

        <p className="client-phone">
          +998 90 123-45-67
        </p>

        <div className="client-stats">

          <div className="client-stat">
            <span>Возраст</span>
            <strong>35 лет</strong>
          </div>

          <div className="client-stat">
            <span>Бонусы</span>
            <strong>1240</strong>
          </div>

        </div>

        <div className="client-last">

          <span>Последняя процедура</span>

          <strong>Ультразвуковая чистка</strong>

        </div>

        <div className="client-next">

          <span>Следующая запись</span>

          <strong>18 июля • 11:00</strong>

        </div>

      </div>

    </GlassCard>
  );
}

export default ClientInfoPanel;