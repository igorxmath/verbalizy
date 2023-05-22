/** @type {import("prettier").Config} */

const config = {
  semi: false,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  jsxSingleQuote: true,
  singleAttributePerLine: true,
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
}

module.exports = config
