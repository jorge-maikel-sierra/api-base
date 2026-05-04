import React from 'react';
import type { Post } from '../../types/post';
import { formatRelativeTime, truncate } from '../../utils/formatters';

interface PostCardProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (id: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete }) => (
  <article>
    <h2>{post.title}</h2>
    <p>{truncate(post.content, 160)}</p>
    <small>
      {post.author.username} · {formatRelativeTime(post.createdAt)}
    </small>
    {onEdit && <button onClick={() => onEdit(post)}>Editar</button>}
    {onDelete && <button onClick={() => onDelete(post.id)}>Eliminar</button>}
  </article>
);

export default PostCard;
