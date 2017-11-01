const fs = require("fs");
const path = require("path");
const vue = require("rollup-plugin-vue");
const alias = require("rollup-plugin-alias");
const babel = require("rollup-plugin-babel");
const scss = require("rollup-plugin-scss");
const json = require("rollup-plugin-json");
const graphql = require("rollup-plugin-graphql");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const CleanCSS = require("clean-css");
const { camelCase } = require("lodash");
const { name, dependencies } = require("../package.json");

const base = path.resolve(__dirname, "..");
const nodeModules = path.resolve(base, "node_modules");
const lib = path.resolve(base, "lib");
const dist = path.resolve(base, "dist");

// Ensure dist directory exists
if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist);
}

// Libs in `external` will not be bundled to dist,
// since they are expected to be provided later.
// We want to include some of them in the build, so we exclude it here.

const externalExcludes = [
  '@jacobmischka/vue-flatpickr',
  'apollo-absinthe-upload-client',
  'apollo-client',
  'bootstrap',
  'bootstrap-vue',
  'graphql-tag',
  'izitoast',
  'moment',
  'moment-timezone',
  'nprogress',
  'phoenix',
  'raven-js',
  'sortablejs',
  'url-slug',
  'v-click-outside',
  'vee-validate',
  'vex-js',
  'vex-dialog',
  'vue-core-image-upload',
  'vue-multiselect',
  'vue-picture-input',
  'vue-upload-component',
  'vuex-router-sync',
  'flatpickr/dist/l10n/no'
]

var external = Object.keys(dependencies).filter(dep => externalExcludes.indexOf(dep) === -1);
external.push('villainjs');

module.exports = {
    input: path.resolve(lib, "index.js"),
    // Libs in `external` will not be bundled to dist,
    // since they are expected to be provided later.
    external,
    name,
    plugins: [
        alias({
            '@': lib,
            '~': nodeModules
        }),
        scss({
          output: path.resolve(dist, name + ".css"),
          insert: true,
			    include: '**/*.scss',
			    exclude: [],
          includePaths: ['node_modules']
        }),
        graphql({ sourceMap: true }),
        vue(),
        resolve({
          jsnext: true,
          main: true,
          external: ["vue", "vuex", "villainjs"]
        }),
        json(),
        commonjs(),
        babel()
    ],

    output: [
        {
            format: "es",
            file: path.resolve(dist, name + ".esm.js"),
            sourcemap: true
        }
    ]
};
