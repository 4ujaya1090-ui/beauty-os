import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../../../layouts/MainLayout/MainLayout";
import SectionCard from "../../../shared/components/SectionCard/SectionCard";
import TextField from "../../../shared/components/TextField/TextField";
import TextArea from "../../../shared/components/TextArea/TextArea";
import PrimaryButton from "../../../shared/components/PrimaryButton/PrimaryButton";

import { useArticles } from "../../context/ArticleContext";

import "./EditArticlePage.css";

function toLocalIsoDate(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function EditArticlePage() {
  const navigate = useNavigate();

  const { selectedArticle, updateArticle } = useArticles();

  const [title, setTitle] = useState(selectedArticle?.title ?? "");
  const [category, setCategory] = useState(selectedArticle?.category ?? "");
  const [content, setContent] = useState(selectedArticle?.content ?? "");
  const [image, setImage] = useState(selectedArticle?.image ?? "");
  const [published, setPublished] = useState(
    selectedArticle?.published ?? true
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!selectedArticle) {
    return (
      <MainLayout>
        <div className="edit-article-page">
          <h2>Публикация не выбрана</h2>
        </div>
      </MainLayout>
    );
  }

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      window.alert("Заполните заголовок и текст публикации");
      return;
    }

    if (!selectedArticle) {
      return;
    }

    setIsSaving(true);

    try {
      await updateArticle({
        ...selectedArticle,
        title: title.trim(),
        category: category.trim() || "Без категории",
        content: content.trim(),
        image: image.trim(),
        published,
        updatedAt: toLocalIsoDate(new Date()),
      });

      navigate("/article");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <MainLayout>
      <div className="edit-article-page">
        <SectionCard title="Редактирование публикации">
          <TextField label="Заголовок" value={title} onChange={setTitle} />

          <TextField
            label="Категория"
            value={category}
            onChange={setCategory}
          />

          <TextField
            label="Ссылка на изображение (необязательно)"
            value={image}
            onChange={setImage}
          />

          <TextArea
            label="Текст публикации"
            value={content}
            onChange={setContent}
          />

          <label className="edit-article-page__checkbox">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Опубликовано
          </label>
        </SectionCard>

        <PrimaryButton onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Сохраняем..." : "Сохранить изменения"}
        </PrimaryButton>
      </div>
    </MainLayout>
  );
}

export default EditArticlePage;
