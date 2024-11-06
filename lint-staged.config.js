module.exports = {
  '**/*.(ts|js)?(x)': (filenames) => [
    `eslint --fix ${filenames.join(' ')}`,
    `prettier --write ${filenames.join(' ')}`,
  ],
};
