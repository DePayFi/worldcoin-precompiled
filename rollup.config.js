import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import globals from './rollup.globals.js'
import json from '@rollup/plugin-json'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import pkg from './package.json'
import replace from '@rollup/plugin-replace'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: 'src/index.js',
  output: [
    {
      format: 'es',
      globals: globals,
      file: 'dist/esm/index.js',
    },
    {
      format: 'umd',
      name: pkg.moduleName,
      globals: globals,
      file: 'dist/umd/index.js',
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  treeshake: {
    moduleSideEffects: false,
  },
  plugins: [
    commonjs({
      transformMixedEsModules: true
    }),
    json(),
    nodePolyfills(),
    babel({
      babelHelpers: 'bundled',
      presets: ["@babel/preset-env"],
      plugins: ["transform-vite-meta-env"]
    }),
    nodeResolve({
      browser: true,
      dedupe: ['bn.js', 'buffer'],
      extensions: ['.js','.ts'],
      preferBuiltins: false
    }),
    replace({
      preventAssignment: true,
      'global.Promise': '_global$1.Promise',
      'process.env.NODE_ENV': JSON.stringify('product'),
      'process.env.BROWSER': JSON.stringify('true'),
      'process.env.npm_package_version': JSON.stringify(
        process.env.npm_package_version,
      )
    }),
  ]
}
