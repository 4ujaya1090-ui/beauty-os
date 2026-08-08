import MainLayout from "../../../../layouts/MainLayout/MainLayout";
import SectionCard from "../../../shared/components/SectionCard/SectionCard";

import { useArticles } from "../../../articles/context/ArticleContext";

import "./ClientArticlePage.css";

const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
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

          <p className="client-article-page__content">
            {selectedArticle.content}
          </p>
        </SectionCard>
      </div>
    </MainLayout>
  );
}

export default ClientArticlePage;
