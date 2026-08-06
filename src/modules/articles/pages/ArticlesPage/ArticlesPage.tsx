import { useNavigate } from "react-router-dom";

import MainLayout from "../../../../layouts/MainLayout/MainLayout";
import SectionCard from "../../../shared/components/SectionCard/SectionCard";
import PrimaryButton from "../../../shared/components/PrimaryButton/PrimaryButton";
import ArticleCard from "../../components/ArticleCard/ArticleCard";

import { useArticles } from "../../context/ArticleContext";

import "./ArticlesPage.css";

function ArticlesPage() {
  const navigate = useNavigate();

  const { articles, loading, setSelectedArticle } = useArticles();

  function handleOpen(articleId: string) {
    const article = articles.find((a) => a.id === articleId);

    if (!article) {
      return;
    }

    setSelectedArticle(article);
    navigate("/article");
  }

  const sorted = [...articles].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  return (
    <MainLayout>
      <div className="articles-page">

        <SectionCard title="Публикации">

          <PrimaryButton onClick={() => navigate("/articles/new")}>
            + Новая публикация
          </PrimaryButton>

          <div className="articles-list">

            {loading && <p className="articles-empty">Загрузка...</p>}

            {!loading && sorted.length === 0 && (
              <p className="articles-empty">Пока публикаций нет.</p>
            )}

            {sorted.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={() => handleOpen(article.id)}
              />
            ))}

          </div>

        </SectionCard>
      </div>
    </MainLayout>
  );
}

export default ArticlesPage;
