/** @type {import('snowpack').SnowpackUserConfig } */
module.exports = {
  mount: {
    'src.public': {
      url: '/',
    },
    'src.app/_': {
      url: '/_/',
    },
  },
  buildOptions: {
    out: 'public',
  },
  plugins: [
    ['@snowpack/plugin-svelte'],
  ],
  packageOptions: {
    source: "remote",
    origin: "http://localhost:6000",
  },
};
