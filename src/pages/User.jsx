import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, increment } from "firebase/firestore";
import Navbar from "./Navbar";
import "../App.css";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "./User.css";

const User = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlesRef = collection(db, "articles");
        const snapshot = await getDocs(articlesRef);

        const allArticles = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setArticles(allArticles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  // 🔥 Like/Unlike Function
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
        // Unlike logic
        await updateDoc(articleRef, {
          likes: increment(-1),
          likedBy: arrayRemove(userId),
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
        // Like logic
        await updateDoc(articleRef, {
          likes: increment(1),
          likedBy: arrayUnion(userId),
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

  // 💬 Add Comment Function
  const handleComment = async (articleId) => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to comment!");
      return;
    }

    if (!commentText[articleId]) return alert("Comment cannot be empty!");

    const articleRef = doc(db, "articles", articleId);

    try {
      await updateDoc(articleRef, {
        comments: arrayUnion({
          userId: user.uid,
          username: user.displayName || "Anonymous",
          text: commentText[articleId],
        }),
      });

      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.id === articleId
            ? {
                ...article,
                comments: [
                  ...(article.comments || []),
                  { userId: user.uid, username: user.displayName || "Anonymous", text: commentText[articleId] },
                ],
              }
            : article
        )
      );

      setCommentText((prev) => ({ ...prev, [articleId]: "" }));
      alert("Comment Added!");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Particles config
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <>
      <Navbar />
      <Particles
        id="tsparticles-user-bg"
        init={particlesInit}
        options={{
          background: { color: { value: "#e0e7ef00" } },
          fpsLimit: 60,
          interactivity: {
            events: { onClick: { enable: true, mode: "push" }, onHover: { enable: true, mode: "repulse" }, resize: true },
            modes: { push: { quantity: 4 }, repulse: { distance: 100, duration: 0.4 } },
          },
          particles: {
            color: { value: "#fff" },
            links: { color: "#fff", distance: 150, enable: true, opacity: 0.3, width: 1 },
            collisions: { enable: false },
            move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 1, straight: false },
            number: { density: { enable: true, area: 800 }, value: 60 },
            opacity: { value: 0.4 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 4 } },
          },
          detectRetina: true,
        }}
        style={{ position: "fixed", zIndex: 0, top: 0, left: 0, width: "100vw", height: "100vh" }}
      />
      <div className="user-page-container">
        <h1 className="user-gradient-title">All Articles</h1>
        {loading ? (
          <p className="user-loading">Loading articles...</p>
        ) : articles.length === 0 ? (
          <p className="user-loading">No articles found.</p>
        ) : (
          <ul className="user-articles-list">
            {articles.map((article) => (
              <li className="user-article-card" key={article.id}>
                <h3 className="user-article-title">{article.title}</h3>
                <p className="user-article-content">{article.content}</p>
                <small className="user-article-meta">
                  <b>By:</b> {article.author || "Unknown"} | <b>Created At:</b> {article.createdAt?.toDate().toLocaleString()}
                </small>
                <br />
                <button
                  className={`user-like-btn${article.likedBy?.includes(auth.currentUser?.uid) ? " liked" : ""}`}
                  onClick={() => handleLike(article.id, article.likedBy || [])}
                >
                  {article.likedBy?.includes(auth.currentUser?.uid) ? "👎 Unlike" : "👍 Like"} ({article.likes || 0})
                </button>
                <div className="user-comment-section">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText[article.id] || ""}
                    onChange={(e) => setCommentText((prev) => ({ ...prev, [article.id]: e.target.value }))}
                    className="user-comment-input"
                  />
                  <button
                    className="user-comment-btn"
                    onClick={() => handleComment(article.id)}
                  >
                    💬 Comment
                  </button>
                </div>
                {article.comments && article.comments.length > 0 && (
                  <div className="user-comments-list">
                    <b>Comments:</b>
                    <ul>
                      {article.comments.map((c, idx) => (
                        <li key={idx} className="user-comment-item">
                          <b>{c.username}:</b> {c.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default User;
