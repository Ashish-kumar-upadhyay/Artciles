import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const CommentSection = ({ articleId }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "comments"), { articleId, text: comment });
    setComment("");
  };

  return (
    <div>
      <h3>Comments</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment" required />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CommentSection;
