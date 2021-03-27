import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'dist/index.js',
  output: {
    file: 'bundle.js',
    format: 'cjs',
    name: 'MyModule'
  },
  plugins: [commonjs(),json(), nodeResolve({
    preferBuiltins: true
  })]
};