import { useNavigate } from "react-router-dom";

import MainLayout from "../../../../layouts/MainLayout/MainLayout";
import SectionCard from "../../../shared/components/SectionCard/SectionCard";

import { useArticles } from "../../../articles/context/ArticleContext";

import "./ClientArticlesPage.css";

function ClientArticlesPage() {
  const navigate = useNavigate();

  const { articles, setSelectedArticle } = useArticles();

  const published = [...articles]
    .filter((a) => a.published)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  function handleOpen(articleId: string) {
    const article = articles.find((a) => a.id === articleId);

    if (!article) {
      return;
    }

    setSelectedArticle(article);
    navigate("/my/article");
  }

  return (
    <MainLayout>
      <div className="client-articles-page">
        <SectionCard title="Статьи специалиста">
          {published.length === 0 ? (
            <p>Пока нет публикаций.</p>
          ) : (
            <div className="client-articles-list">
              {published.map((article) => (
                <div
                  key={article.id}
                  className="client-articles-item"
                  onClick={() => handleOpen(article.id)}
                >
                  <strong>{article.title}</strong>
                  <span>{article.category}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </MainLayout>
  );
}

export default ClientArticlesPage;
