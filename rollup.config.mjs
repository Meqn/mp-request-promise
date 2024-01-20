import { defineConfig } from 'rollup'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import pkg from './package.json' assert { type: 'json' }

const banner =
  '/*!\n' +
  ` * ${pkg.name} v${pkg.version}\n` +
  ` * (c) ${new Date().getFullYear()} Mervin [https://github.com/Meqn/mp-request-promise]\n` +
  ' * Released under the MIT License.\n' +
  ' */'

export default defineConfig([
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.unpkg,
        name: 'mpRequest',
        format: 'umd',
        banner,
        plugins: [terser()]
      },
      {
        file: pkg.main,
        format: 'cjs',
        banner
      }
    ],
    plugins: [
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env']
      })
    ]
  },
  {
    input: 'src/request.js',
    output: [
      {
        file: pkg.module,
        format: 'es',
        banner
      }
    ],
    plugins: [
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env']
      })
    ]
  }
])
