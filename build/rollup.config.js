import VuePlugin from 'rollup-plugin-vue'
const fs = require('fs')
const path = require('path')
const alias = require('rollup-plugin-alias')
const babel = require('rollup-plugin-babel')
const scss = require('rollup-plugin-scss')
const json = require('rollup-plugin-json')
const graphql = require('rollup-plugin-graphql')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const CleanCSS = require('clean-css')
const { camelCase } = require('lodash')
const { name, dependencies } = require('../package.json')

const base = path.resolve(__dirname, '..')
const nodeModules = path.resolve(base, 'node_modules')
const lib = path.resolve(base, 'lib')
const dist = path.resolve(base, 'dist')

// Ensure dist directory exists
if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist)
}

// Libs in `external` will not be bundled to dist,
// since they are expected to be provided later.
// We want to include some of them in the build, so we exclude it here.

export default {
  input: path.resolve(lib, 'index.js'),
  // Libs in `external` will not be bundled to dist,
  // since they are expected to be provided later.
  external: [
    'moment-timezone',
    'url-slug',
    'apollo-client',
    'apollo-absinthe-upload-client',
    'nprogress',
    'vex-dialog',
    'vex-js',
    'villain-editor',
    '@jacobmischka/vue-flatpickr',
    'vuex',
    'vue'
  ],
  plugins: [
    alias({
      '@': lib,
      '~': nodeModules
    }),
    scss({
      output: path.resolve(dist, name + '.css'),
      insert: true,
      include: '**/*.scss',
      exclude: [],
      includePaths: ['node_modules']
    }),
    VuePlugin(),
    graphql({ sourceMap: true }),
    resolve({
      jsnext: true,
      main: true
    }),
    json(),
    commonjs(),
    babel()
  ],

  output: [
    {
      name,
      format: 'es',
      file: path.resolve(dist, name + '.esm.js'),
      sourcemap: true
    }
  ]
}
