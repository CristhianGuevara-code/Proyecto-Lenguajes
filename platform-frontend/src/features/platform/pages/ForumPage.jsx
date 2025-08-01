import { useEffect, useState } from "react";
import { PostForm } from "../components/forum/PostForm";
import { ForumPostCard } from "../components/forum/ForumPostCard";

export const ForumPage = () => {
  const [posts, setPosts] = useState(() => {
    // Inicializa con los posts guardados, o un array vacío si no hay nada
    const savedPosts = localStorage.getItem("forum_posts");
    return savedPosts ? JSON.parse(savedPosts) : [];
  });

  // Guarda los posts en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem("forum_posts", JSON.stringify(posts));
  }, [posts]);

  const addPost = (data) => {
    const newPost = {
      ...data,
      id: Date.now(),
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const addCommentToPost = (postId, comment) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, comments: [...post.comments, comment] } : post
      )
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Foro Escolar</h1>
      <PostForm onSubmit={addPost} />
      {posts.map((post) => (
        <ForumPostCard key={post.id} post={post} onAddComment={addCommentToPost} />
      ))}
    </div>
  );
};
