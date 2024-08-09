// npm install tailwindcss postcss autoprefixer --save-dev

module.exports = {
  purge: ['./src/**/*.html', './src/**/*.tsx', './src/**/*.jsx'],
  content: [],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
