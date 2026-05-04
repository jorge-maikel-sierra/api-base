import React from 'react';
import type { User } from '../../types/user';
import { formatDate } from '../../utils/formatters';

interface UserCardProps {
  user: User;
  onDelete?: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onDelete }) => (
  <div>
    <h3>{user.username}</h3>
    <p>{user.email}</p>
    <small>Miembro desde {formatDate(user.createdAt)}</small>
    {onDelete && (
      <button onClick={() => onDelete(user.id)}>Eliminar</button>
    )}
  </div>
);

export default UserCard;
