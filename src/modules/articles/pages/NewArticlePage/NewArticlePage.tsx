import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../../../layouts/MainLayout/MainLayout";
import SectionCard from "../../../shared/components/SectionCard/SectionCard";
import TextField from "../../../shared/components/TextField/TextField";
import TextArea from "../../../shared/components/TextArea/TextArea";
import PrimaryButton from "../../../shared/components/PrimaryButton/PrimaryButton";

import { useArticles } from "../../context/ArticleContext";
import { useAuth } from "../../../auth/context/AuthContext";

import "./NewArticlePage.css";

function toLocalIsoDate(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function NewArticlePage() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { addArticle } = useArticles();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      window.alert("Заполните заголовок и текст публикации");
      return;
    }

    if (!user) {
      return;
    }

    setIsSaving(true);

    try {
      const today = toLocalIsoDate(new Date());

      await addArticle({
        specialistId: user.uid,

        title: title.trim(),
        content: content.trim(),
        category: category.trim() || "Без категории",
        image: image.trim(),

        published,

        createdAt: today,
        updatedAt: today,
      });

      navigate("/articles");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <MainLayout>
      <div className="new-article-page">
        <SectionCard title="Новая публикация">
          <TextField label="Заголовок" value={title} onChange={setTitle} />

          <TextField
            label="Категория"
            placeholder="Например: уход за кожей, разбор случая"
            value={category}
            onChange={setCategory}
          />

          <TextField
            label="Ссылка на изображение (необязательно)"
            placeholder="https://..."
            value={image}
            onChange={setImage}
          />

          <TextArea
            label="Текст публикации"
            value={content}
            onChange={setContent}
          />

          <label className="new-article-page__checkbox">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Опубликовать сразу
          </label>
        </SectionCard>

        <PrimaryButton onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Сохраняем..." : "Сохранить публикацию"}
        </PrimaryButton>
      </div>
    </MainLayout>
  );
}

export default NewArticlePage;
