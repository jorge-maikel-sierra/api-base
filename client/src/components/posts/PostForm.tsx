import React, { useState } from 'react';
import type { CreatePostPayload } from '../../types/post';
import { isPostTitleValid } from '../../utils/validators';

interface PostFormProps {
  onSubmit: (payload: CreatePostPayload) => Promise<void>;
  loading?: boolean;
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit, loading = false }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPostTitleValid(title)) {
      setError('El título es requerido y debe tener máximo 200 caracteres');
      return;
    }
    setError(null);
    await onSubmit({ title, content });
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p role="alert">{error}</p>}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        required
        maxLength={200}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Contenido"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Publicando...' : 'Publicar'}
      </button>
    </form>
  );
};

export default PostForm;
