import { useNavigate } from "react-router-dom";

import MainLayout from "../../../../layouts/MainLayout/MainLayout";
import SectionCard from "../../../shared/components/SectionCard/SectionCard";
import PrimaryButton from "../../../shared/components/PrimaryButton/PrimaryButton";

import { useArticles } from "../../context/ArticleContext";

import "./ArticlePage.css";

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

function ArticlePage() {
  const navigate = useNavigate();

  const { selectedArticle, deleteArticle, setSelectedArticle } =
    useArticles();

  if (!selectedArticle) {
    return (
      <MainLayout>
        <div className="article-page">
          <h2>Публикация не выбрана</h2>
        </div>
      </MainLayout>
    );
  }

  function handleEdit() {
    navigate("/edit-article");
  }

  function handleDelete() {
    if (!selectedArticle) {
      return;
    }

    if (!window.confirm("Удалить эту публикацию?")) {
      return;
    }

    deleteArticle(selectedArticle.id);
    setSelectedArticle(null);
    navigate("/articles");
  }

  return (
    <MainLayout>
      <div className="article-page">
        <SectionCard title={selectedArticle.title}>
          <p className="article-page__meta">
            {selectedArticle.category} · {formatDate(selectedArticle.createdAt)}
            {!selectedArticle.published && " · Черновик"}
          </p>

          {selectedArticle.image && (
            <img
              className="article-page__image"
              src={selectedArticle.image}
              alt={selectedArticle.title}
            />
          )}

          <p
  className="article-page__content"
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

        <div className="article-page__actions">
          <PrimaryButton onClick={handleEdit}>✎ Редактировать</PrimaryButton>

          <button className="article-page__delete" onClick={handleDelete}>
            🗑 Удалить публикацию
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default ArticlePage;
