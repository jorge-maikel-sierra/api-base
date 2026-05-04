import React from 'react';
import { usePosts } from '../../hooks/usePosts';
import PostCard from './PostCard';
import type { PostQueryParams } from '../../types/post';

interface PostListProps {
  queryParams?: PostQueryParams;
}

const PostList: React.FC<PostListProps> = ({ queryParams }) => {
  const { posts, loading, error, total } = usePosts(queryParams);

  if (loading) return <p>Cargando posts...</p>;
  if (error) return <p role="alert">Error: {error}</p>;
  if (posts.length === 0) return <p>No hay posts disponibles.</p>;

  return (
    <section>
      <p>{total} posts en total</p>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  );
};

export default PostList;
