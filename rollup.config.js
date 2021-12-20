const pkg = require('./package.json')
import { terser } from 'rollup-plugin-terser'

const banner =
`/*!
 * mp-request-promise v${pkg.version} - Promise based HTTP client for miniprogram.
 * (c) 2021 Mervin [https://github.com/Meqn/mp-request-promise]
 * Released under the MIT License.
*/`


export default {
  input: 'lib/index.js',
  plugins: [
    terser()
  ],
  output: {
    file: `index.js`,
    format: 'es',
    banner
  }
}