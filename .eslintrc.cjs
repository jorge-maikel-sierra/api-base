module.exports = {
  extends: ['airbnb-base'],
  env: { node: true, es2022: true, jest: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    // Permitir importaciones con extensión .js necesarias para Node ESM
    'import/extensions': 'off',
  },
};
