import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
  deleteDoc,
} from "firebase/firestore";
import Navbar from "./Navbar";

const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const fetchUserArticles = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        // "articles" collection se sirf logged-in user ke articles fetch kar raha hai
        const articlesRef = collection(db, "articles");
        const q = query(articlesRef, where("userId", "==", user.uid));
        const snapshot = await getDocs(q);

        const userArticles = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setArticles(userArticles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchUserArticles();
  }, []);

  // Edit Button Click
  const handleEditClick = (article) => {
    setEditingId(article.id);
    setEditTitle(article.title);
    setEditContent(article.content);
  };

  // Save Edited Article
  const handleSaveEdit = async () => {
    if (!editTitle || !editContent) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const articleRef = doc(db, "articles", editingId);
      await updateDoc(articleRef, {
        title: editTitle,
        content: editContent,
      });

      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.id === editingId
            ? { ...article, title: editTitle, content: editContent }
            : article
        )
      );

      setEditingId(null);
      alert("Article Updated!");
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  // Like Button Click
  const handleLike = async (articleId, likedBy) => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to like an article!");
      return;
    }

    const userId = user.uid;
    const articleRef = doc(db, "articles", articleId);

    try {
      if (likedBy.includes(userId)) {
        // 🔥 Unlike karne ka logic
        await updateDoc(articleRef, {
          likes: increment(-1),
          likedBy: likedBy.filter((id) => id !== userId), // Remove userId from likedBy
        });

        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.id === articleId
              ? {
                  ...article,
                  likes: (article.likes || 0) - 1,
                  likedBy: article.likedBy.filter((id) => id !== userId),
                }
              : article
          )
        );
      } else {
        // 👍 Like karne ka logic
        await updateDoc(articleRef, {
          likes: increment(1),
          likedBy: [...likedBy, userId], // Add userId to likedBy
        });

        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.id === articleId
              ? {
                  ...article,
                  likes: (article.likes || 0) + 1,
                  likedBy: [...article.likedBy, userId],
                }
              : article
          )
        );
      }
    } catch (error) {
      console.error("Error liking/unliking article:", error);
    }
  };
  const handleDelete = async (articleId) => {
    if (!window.confirm("Are you sure you want to delete this article?"))
      return;

    try {
      await deleteDoc(doc(db, "articles", articleId));
      setArticles((prevArticles) =>
        prevArticles.filter((article) => article.id !== articleId)
      );
      alert("Article Deleted!");
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };
  return (
    <>
      <Navbar />
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>User Dashboard Platform</h1>

        {loading ? (
          <p>Loading articles...</p>
        ) : articles.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {articles.map((article) => (
              <li
                key={article.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                }}
              >
                {editingId === article.id ? (
                  <>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginBottom: "5px",
                      }}
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      style={{ width: "100%", padding: "8px" }}
                      rows="4"
                    />
                    <button
                      onClick={handleSaveEdit}
                      style={{
                        padding: "8px 15px",
                        margin: "5px",
                        backgroundColor: "green",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{
                        padding: "8px 15px",
                        backgroundColor: "red",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <h3>{article.title}</h3>
                    <p>{article.content}</p>
                    <small>
                      <b>Status:</b> {article.status} | <b>Created At:</b>{" "}
                      {article.createdAt?.toDate().toLocaleString()}
                    </small>
                    <br />
                    <button
                      onClick={() => handleEditClick(article)}
                      style={{
                        padding: "8px 15px",
                        marginTop: "10px",
                        backgroundColor: "blue",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      style={{
                        padding: "8px 15px",
                        marginLeft: "10px",
                        backgroundColor: "red",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      🗑 Delete
                    </button>
                    <button
                      onClick={() =>
                        handleLike(article.id, article.likedBy || [])
                      }
                      style={{
                        padding: "8px 15px",
                        marginLeft: "10px",
                        backgroundColor: article.likedBy?.includes(
                          auth.currentUser?.uid
                        )
                          ? "gray"
                          : "purple", // Already liked? Show gray button
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {article.likedBy?.includes(auth.currentUser?.uid)
                        ? "👎 Unlike"
                        : "👍 Like"}{" "}
                      ({article.likes || 0})
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default MyArticles;
