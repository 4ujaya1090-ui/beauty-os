import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../../../layouts/MainLayout/MainLayout";

import GlassCard from "../../../shared/components/GlassCard/GlassCard";
import SectionCard from "../../../shared/components/SectionCard/SectionCard";

import { createTelegramLink } from "../../../clients/services/telegramService";
import { getTelegramSubscription } from "../../../clients/services/telegramSubscriptionService";

import { useAuth } from "../../../auth/context/AuthContext";
import { useRole } from "../../../auth/context/RoleContext";
import { useAppointments } from "../../../appointments/context/AppointmentContext";
import { useArticles } from "../../../articles/context/ArticleContext";

import "./ClientDashboardPage.css";

const MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

function formatDate(isoDate: string) {
  const [year, month, day] = isoDate
    .split("-")
    .map(Number);

  return `${day} ${MONTHS[month - 1]} ${year}`;
}

function ClientDashboardPage() {
  const navigate = useNavigate();

  const { logout } = useAuth();
  const { clientRecord } = useRole();
  const { appointments } = useAppointments();
  const { articles, setSelectedArticle } = useArticles();

  const [
    telegramConnected,
    setTelegramConnected,
  ] = useState(false);

  const [
    telegramLoading,
    setTelegramLoading,
  ] = useState(true);

  const [
    isHistoryOpen,
    setIsHistoryOpen,
  ] = useState(false);

  const [
    isArticlesOpen,
    setIsArticlesOpen,
  ] = useState(false);

  const clientId =
    clientRecord?.id ?? "";

  useEffect(() => {
    if (!clientId) {
      setTelegramConnected(false);
      setTelegramLoading(false);
      return;
    }

    let cancelled = false;

    async function loadTelegramSubscription() {
      try {
        const subscription =
          await getTelegramSubscription(
            clientId
          );

        if (!cancelled) {
          setTelegramConnected(
            subscription?.connected === true
          );
        }
      } catch (error) {
        console.error(
          "Telegram subscription load error:",
          error
        );

        if (!cancelled) {
          setTelegramConnected(false);
        }
      } finally {
        if (!cancelled) {
          setTelegramLoading(false);
        }
      }
    }

    loadTelegramSubscription();

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  if (!clientRecord) {
    return null;
  }

  async function handleTelegramConnect() {
    try {
      const telegramUrl =
        await createTelegramLink(clientId);

      window.location.href =
        telegramUrl;
    } catch (error) {
      console.error(
        "Telegram connection error:",
        error
      );

      alert(
        "Не удалось подготовить подключение Telegram."
      );
    }
  }

  const now = new Date();

  const myAppointments =
    appointments.filter(
      (appointment) =>
        appointment.clientId ===
        clientRecord.id
    );

  const upcomingAppointments =
    [...myAppointments]
      .filter(
        (appointment) =>
          new Date(
            `${appointment.date}T${appointment.time}`
          ) >= now
      )
      .sort(
        (a, b) =>
          new Date(
            `${a.date}T${a.time}`
          ).getTime() -
          new Date(
            `${b.date}T${b.time}`
          ).getTime()
      );

  const nextAppointment =
    upcomingAppointments[0];

  const pastAppointments =
    [...myAppointments]
      .filter(
        (appointment) =>
          new Date(
            `${appointment.date}T${appointment.time}`
          ) < now
      )
      .sort((a, b) =>
        `${b.date}T${b.time}`.localeCompare(
          `${a.date}T${a.time}`
        )
      );

  const publishedArticles =
    [...articles]
      .filter(
        (article) => article.published
      )
      .sort((a, b) =>
        b.createdAt.localeCompare(
          a.createdAt
        )
      )
      .slice(0, 5);

  function handleOpenArticle(
    articleId: string
  ) {
    const article = articles.find(
      (item) =>
        item.id === articleId
    );

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
              Здравствуйте,{" "}
              {clientRecord.name}
            </h1>

            <p className="client-dashboard__subtitle">
              Ваш личный кабинет
            </p>
          </div>

          <button
            className="client-dashboard__logout"
            onClick={() => logout()}
          >
            Выйти
          </button>
        </div>

        <GlassCard>
          <div className="client-dashboard__telegram">
            <p className="client-dashboard__telegram-label">
              Уведомления с Telegram
            </p>

            <button
              className="client-dashboard__telegram-button"
              onClick={
                handleTelegramConnect
              }
              disabled={
                telegramLoading ||
                telegramConnected
              }
            >
              {telegramLoading
                ? "Проверка..."
                : telegramConnected
                  ? "Подключён"
                  : "Подключить"}
            </button>
          </div>
        </GlassCard>

        <GlassCard>
          <p className="client-dashboard__bonus-label">
            Ваши бонусы
          </p>

          <h2 className="client-dashboard__bonus-value">
            {clientRecord.bonus}
          </h2>
        </GlassCard>

        <button
          className="client-dashboard__book"
          onClick={() =>
            navigate("/my/booking")
          }
        >
          + Записаться на приём
        </button>

        <div
          className="client-dashboard__clickable"
          onClick={() =>
            navigate("/my/appointments")
          }
        >
          <SectionCard title="Мои записи">
            {nextAppointment ? (
              <>
                <p>
                  {formatDate(
                    nextAppointment.date
                  )}{" "}
                  · {nextAppointment.time} —{" "}
                  {nextAppointment.procedure}
                </p>

                {upcomingAppointments.length >
                  1 && (
                  <p className="client-dashboard__more">
                    Ещё{" "}
                    {upcomingAppointments.length -
                      1}{" "}
                    запись(ей) →
                  </p>
                )}
              </>
            ) : (
              <p>
                Пока ничего не
                запланировано.
              </p>
            )}
          </SectionCard>
        </div>

        <SectionCard title="">
          <button
            type="button"
            className="client-dashboard__history-toggle"
            onClick={() =>
              setIsHistoryOpen(
                (current) => !current
              )
            }
            aria-expanded={
              isHistoryOpen
            }
          >
            <span>
              История посещений
            </span>

            <span
              className={`client-dashboard__history-arrow ${
                isHistoryOpen
                  ? "client-dashboard__history-arrow--open"
                  : ""
              }`}
            >
              ▾
            </span>
          </button>

          {isHistoryOpen && (
            <div className="client-dashboard__history">
              {pastAppointments.length ===
              0 ? (
                <p>
                  История пока пуста.
                </p>
              ) : (
                pastAppointments.map(
                  (appointment) => (
                    <div
                      className="client-dashboard__history-item"
                      key={
                        appointment.id
                      }
                    >
                      <span>
                        {formatDate(
                          appointment.date
                        )}
                        {appointment.time
                          ? ` · ${appointment.time}`
                          : ""}
                      </span>

                      <span>
                        {
                          appointment.procedure
                        }
                      </span>
                    </div>
                  )
                )
              )}
            </div>
          )}
        </SectionCard>

        <SectionCard title="">
          <button
            type="button"
            className="client-dashboard__history-toggle"
            onClick={() =>
              setIsArticlesOpen(
                (current) => !current
              )
            }
            aria-expanded={
              isArticlesOpen
            }
          >
            <span>
              Статьи специалиста
            </span>

            <span
              className={`client-dashboard__history-arrow ${
                isArticlesOpen
                  ? "client-dashboard__history-arrow--open"
                  : ""
              }`}
            >
              ▾
            </span>
          </button>

          {isArticlesOpen && (
            <div className="client-dashboard__articles">
              {publishedArticles.length ===
              0 ? (
                <p>
                  Пока нет публикаций.
                </p>
              ) : (
                <>
                  {publishedArticles.map(
                    (article) => (
                      <div
                        key={article.id}
                        className="client-dashboard__article"
                        onClick={() =>
                          handleOpenArticle(
                            article.id
                          )
                        }
                      >
                        <strong>
                          {article.title}
                        </strong>

                        <span>
                          {article.category}
                        </span>
                      </div>
                    )
                  )}

                  <button
                    className="client-dashboard__show-all"
                    onClick={() =>
                      navigate(
                        "/my/articles"
                      )
                    }
                  >
                    Показать все →
                  </button>
                </>
              )}
            </div>
          )}
        </SectionCard>
      </div>
    </MainLayout>
  );
}

export default ClientDashboardPage;