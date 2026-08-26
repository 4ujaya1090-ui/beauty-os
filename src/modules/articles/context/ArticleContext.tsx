import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../../firebase/config";
import { useProfile } from "../../auth/context/ProfileContext";
import type { Article } from "../types/Article";

type NewArticle = Omit<Article, "id">;

type ArticleContextType = {
  articles: Article[];
  loading: boolean;

  selectedArticle: Article | null;
  setSelectedArticle: (article: Article | null) => void;

  addArticle: (article: NewArticle) => Promise<void>;
  updateArticle: (article: Article) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
};

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

const COLLECTION_NAME = "articles";

export function ArticleProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { profile, loading: profileLoading } = useProfile();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedArticle, setSelectedArticle] =
    useState<Article | null>(null);

  useEffect(() => {
    if (profileLoading) {
      return;
    }

    const articlesQuery = profile
      ? collection(db, COLLECTION_NAME)
      : query(collection(db, COLLECTION_NAME), where("published", "==", true));

    const unsubscribe = onSnapshot(articlesQuery, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Article, "id">),
      }));

      setArticles(items);
      setLoading(false);
    });

    return unsubscribe;
  }, [profile, profileLoading]);

  async function addArticle(article: NewArticle) {
    await addDoc(collection(db, COLLECTION_NAME), article);
  }

  async function updateArticle(article: Article) {
    const { id, ...rest } = article;
    await updateDoc(doc(db, COLLECTION_NAME, id), rest);
  }

  async function deleteArticle(id: string) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  }

  return (
    <ArticleContext.Provider
      value={{
        articles,
        loading,
        selectedArticle,
        setSelectedArticle,
        addArticle,
        updateArticle,
        deleteArticle,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
}

export function useArticles() {
  const context = useContext(ArticleContext);

  if (!context) {
    throw new Error("useArticles must be used inside ArticleProvider");
  }

  return context;
}