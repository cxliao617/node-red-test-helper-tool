
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json'
import pkg from './package.json';

export default {
    input: 'src/NodeRedTestServer.js',
    output: [
        { file: pkg.main, format: 'cjs' },
        { file: pkg.module, format: 'esm' },
        
    ],
    plugins: [resolve(),commonjs(),json()]
};