import { useNavigate } from "react-router-dom";

import MainLayout from "../../../../layouts/MainLayout/MainLayout";
import GlassCard from "../../../shared/components/GlassCard/GlassCard";
import SectionCard from "../../../shared/components/SectionCard/SectionCard";

import { useAuth } from "../../../auth/context/AuthContext";
import { useRole } from "../../../auth/context/RoleContext";
import { useAppointments } from "../../../appointments/context/AppointmentContext";
import { useArticles } from "../../../articles/context/ArticleContext";

import "./ClientDashboardPage.css";

const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

function ClientDashboardPage() {
  const navigate = useNavigate();

  const { logout } = useAuth();
  const { clientRecord } = useRole();
  const { appointments } = useAppointments();
  const { articles, setSelectedArticle } = useArticles();

  if (!clientRecord) {
    return null;
  }

  const now = new Date();

  const myAppointments = appointments.filter(
    (a) => a.clientId === clientRecord.id
  );

  const upcomingAppointments = [...myAppointments]
    .filter((a) => new Date(`${a.date}T${a.time}`) >= now)
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}`).getTime() -
        new Date(`${b.date}T${b.time}`).getTime()
    );

  const nextAppointment = upcomingAppointments[0];

  const pastAppointments = [...myAppointments]
    .filter((a) => new Date(`${a.date}T${a.time}`) < now)
    .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));

  const publishedArticles = [...articles]
    .filter((a) => a.published)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  function handleOpenArticle(articleId: string) {
    const article = articles.find((a) => a.id === articleId);

    if (!article) {
      return;
    }

    setSelectedArticle(article);
    navigate("/my/article");
  }

  return (
    <MainLayout>
      <div className="client-dashboard">
        <div className="client-dashboard__header">
          <div>
            <h1 className="client-dashboard__title">
              Здравствуйте, {clientRecord.name}
            </h1>
            <p className="client-dashboard__subtitle">Ваш личный кабинет</p>
          </div>

          <button
            className="client-dashboard__logout"
            onClick={() => logout()}
          >
            Выйти
          </button>
        </div>

        <GlassCard>
          <p className="client-dashboard__bonus-label">Ваши бонусы</p>
          <h2 className="client-dashboard__bonus-value">
            {clientRecord.bonus}
          </h2>
        </GlassCard>

        <div
          className="client-dashboard__clickable"
          onClick={() => navigate("/my/appointments")}
        >
          <SectionCard title="Мои записи">
            {nextAppointment ? (
              <>
                <p>
                  {formatDate(nextAppointment.date)} · {nextAppointment.time}{" "}
                  — {nextAppointment.procedure}
                </p>

                {upcomingAppointments.length > 1 && (
                  <p className="client-dashboard__more">
                    Ещё {upcomingAppointments.length - 1} запись(ей) →
                  </p>
                )}
              </>
            ) : (
              <p>Пока ничего не запланировано.</p>
            )}
          </SectionCard>
        </div>

        <SectionCard title="История посещений">
          {pastAppointments.length === 0 ? (
            <p>История пока пуста.</p>
          ) : (
            <div className="client-dashboard__history">
              {pastAppointments.map((a) => (
                <div className="client-dashboard__history-item" key={a.id}>
                  <span>
                    {formatDate(a.date)} · {a.time}
                  </span>
                  <span>{a.procedure}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Статьи специалиста">
          {publishedArticles.length === 0 ? (
            <p>Пока нет публикаций.</p>
          ) : (
            <div className="client-dashboard__articles">
              {publishedArticles.map((article) => (
                <div
                  key={article.id}
                  className="client-dashboard__article"
                  onClick={() => handleOpenArticle(article.id)}
                >
                  <strong>{article.title}</strong>
                  <span>{article.category}</span>
                </div>
              ))}

              <button
                className="client-dashboard__show-all"
                onClick={() => navigate("/my/articles")}
              >
                Показать все →
              </button>
            </div>
          )}
        </SectionCard>
      </div>
    </MainLayout>
  );
}

export default ClientDashboardPage;
