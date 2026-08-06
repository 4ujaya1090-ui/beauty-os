import GlassCard from "../../../shared/components/GlassCard/GlassCard";

import type { Article } from "../../types/Article";

import "./ArticleCard.css";

type ArticleCardProps = {
  article: Article;
  onClick: () => void;
};

function ArticleCard({ article, onClick }: ArticleCardProps) {
  return (
    <div className="article-card" onClick={onClick}>
      <GlassCard>
        {!article.published && (
          <span className="article-card__draft">Черновик</span>
        )}

        <h3>{article.title}</h3>

        <p className="article-card__category">{article.category}</p>
      </GlassCard>
    </div>
  );
}

export default ArticleCard;
