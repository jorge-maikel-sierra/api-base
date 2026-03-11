module.exports = {
  extends: ['airbnb-base'],
  env: { node: true, es2022: true, jest: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    // Permitir importaciones con extensión .js necesarias para Node ESM
    'import/extensions': 'off',
    // Evitar conflictos con el formateador que reescribe saltos de línea
    'operator-linebreak': 'off',
    'newline-per-chained-call': 'off',
    // Permitir que los tests importen devDependencies (jest, supertest, etc.)
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/tests/**', '**/*.test.js', '**/*.spec.js'],
        optionalDependencies: false,
        peerDependencies: false,
        bundledDependencies: false,
      },
    ],
  },
};
