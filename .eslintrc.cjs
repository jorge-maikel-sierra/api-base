module.exports = {
  extends: ['airbnb-base'],
  env: { node: true, es2022: true, jest: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    // Solo overrides justificados — NO agregar reglas para silenciar errores del código
  },
};
