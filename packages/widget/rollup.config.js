
import clear from 'rollup-plugin-clear'
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import rollupLess from 'rollup-plugin-less';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import tscompile from 'typescript';

export default {
  // 入口 可以是一个字符串，也可以是对象
  input: { 
    index: 'src/index.ts',
  },
  // 出口
  output: {
    dir: 'lib', // 可以是 dir 表示输出目录 也可以是 file 表示输出文件
    format: 'es', // 输出的格式 可以是 cjs commonJs 规范 | es es Module 规范 | iife 浏览器可引入的规范
    sourceMap: true,
    entryFileNames: 'index.js',
    exports: 'named'
  },
  // 需要引入的插件
  plugins: [
    clear({
      targets: ['lib']
    }),
    typescript({
      typescript: tscompile,
    }),
    json(),
    rollupLess(),
    commonjs(),
    babel({
      exclude: 'node_modules/**', // 只编译源代码
      runtimeHelpers: true
    })
  ],

}
