export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidUsername = (username: string): boolean =>
  /^[a-zA-Z0-9]{3,30}$/.test(username);

export const isValidPassword = (password: string): boolean =>
  password.length >= 8;

export const isPostTitleValid = (title: string): boolean =>
  title.trim().length > 0 && title.length <= 200;
