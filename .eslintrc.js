// https://eslint.org/docs/user-guide/configuring

module.exports = {
  // 环境定义了预定义的全局变量。
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  // JavaScript 语言选项
  "parserOptions": {
    "ecmaVersion": 2015,
    "sourceType": "module"
  },
  //-----让eslint支持 vue
  plugins: [
    'vue'
  ],
  extends: [
    // 检测到vue文件
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  "rules": {
    // 允许异步等待
    'generator-star-spacing': 'off',
    // 在开发过程中允许调试器
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 缩进
    "indent": [
      "error",
      4 //我的是编辑器自动格式化，不是使用tabs，而是四个空格
    ],
    // "linebreak-style": [
    //   "error",
    //   "windows"
    // ],
    // 引号
    "quotes": [
      1,
      "single"
    ],
    // 分号结尾
    "semi": [
      "error",
      "always"
    ],
    "no-unused-vars": [2, {
      // 允许声明未使用变量
      "vars": "local",
      // 参数不检查
      "args": "none"
    }],
    // 最大空行100
    "no-multiple-empty-lines": [0, { "max": 100 }],
    "no-mixed-spaces-and-tabs": [0],
    //不能使用console
    "no-console": 'off',
    //未定义变量不能使用
    "no-undef": 0,
    //一行结束后面不要有空格
    "no-trailing-spaces": 1,
    // //强制驼峰法命名
    // "camelcase": ["error", {"properties": "always"}],
    //对象字面量项尾不能有逗号
    "comma-dangle": [2, "never"],
    //this别名
    "consistent-this": [2, "_this"],
    "plugins": ["vue","html"],
    // "curly": ["error", "multi"],
    // //禁止对null使用==或!=运算符
    // "no-eq-null": "error",
    "vars-on-top": 2,//var必须放在作用域顶部
  }
};
