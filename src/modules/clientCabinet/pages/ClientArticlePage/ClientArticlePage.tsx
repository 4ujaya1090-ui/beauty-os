import MainLayout from "../../../../layouts/MainLayout/MainLayout";
import SectionCard from "../../../shared/components/SectionCard/SectionCard";

import { useArticles } from "../../../articles/context/ArticleContext";

import "./ClientArticlePage.css";

function formatDate(isoDate: string) {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return "Дата не указана";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Tashkent",
  }).format(date);
}

function ClientArticlePage() {
  const { selectedArticle } = useArticles();

  if (!selectedArticle || !selectedArticle.published) {
    return (
      <MainLayout>
        <div className="client-article-page">
          <h2>Публикация недоступна</h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="client-article-page">
        <SectionCard title={selectedArticle.title}>
          <p className="client-article-page__meta">
            {selectedArticle.category} · {formatDate(selectedArticle.createdAt)}
          </p>

          {selectedArticle.image && (
            <img
              className="client-article-page__image"
              src={selectedArticle.image}
              alt={selectedArticle.title}
            />
          )}

          <p
  className="client-article-page__content"
  style={{ whiteSpace: "pre-line" }}
>
  {selectedArticle.content
    .split(/(https:\/\/t\.me\/skinimalismuz)/g)
    .map((part, index) =>
      part === "https://t.me/skinimalismuz" ? (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </a>
      ) : (
        part
      )
    )}
</p>
        </SectionCard>
      </div>
    </MainLayout>
  );
}

export default ClientArticlePage;
