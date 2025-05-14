import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Navbar from "./Navbar";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "./ArticlePage.css";

const ArticleForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Please fill all fields!");

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to publish an article!");
      return;
    }

    setIsPublishing(true);

    try {
      const articlesRef = collection(db, "articles");
      await addDoc(articlesRef, {
        title,
        content,
        author: user.displayName,
        userId: user.uid,
        status: "public",
        createdAt: serverTimestamp(),
      });
      setTitle("");
      setContent("");
      alert("Article Published!");
    } catch (error) {
      console.error("Error adding article:", error);
    }
    setIsPublishing(false);
  };

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <>
      <Navbar />
      <Particles
        id="tsparticles-article-bg"
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
      <div className="article-form-container">
        <h2 className="article-gradient-title">Publish an Article</h2>
        <form className="article-form-card" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Article Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="article-input"
          />
          <textarea
            placeholder="Write your article here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="6"
            className="article-textarea"
          />
          <button
            type="submit"
            disabled={isPublishing}
            className="article-publish-btn"
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ArticleForm;
