import { useEffect, useState } from "react";
import { PostForm } from "../components/forum/PostForm";
import { ForumPostCard } from "../components/forum/ForumPostCard";

export const ForumPage = () => {
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem("forum_posts");
    return savedPosts ? JSON.parse(savedPosts) : [];
  });

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

  const editPost = (postId, updatedPost) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? updatedPost : post))
    );
  };

  const deletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Foro Escolar</h1>
      <PostForm onSubmit={addPost} />
      {posts.map((post) => (
        <ForumPostCard
          key={post.id}
          post={post}
          onAddComment={() => {}} // no usado, manejo en ForumPostCard
          onDeletePost={deletePost}
          onEditPost={editPost}
        />
      ))}
    </div>
  );
};
