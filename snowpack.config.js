/** @type {import('snowpack').SnowpackUserConfig } */
module.exports = {
  mount: {
    root: {
      url: '/'
    },
    src: {
      url: '/_/',
    },
  },
  plugins: [
    ['@snowpack/plugin-svelte'],
  ],
  packageOptions: {
    source: "remote",
    origin: "http://localhost:6000"
  }
};
