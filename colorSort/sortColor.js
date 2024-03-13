const fs = require('fs');
const path = require('path');
const {color__path_results} = require('./color__path_results');
const {colorList} = require('./colorList');
console.log('colorList: ', colorList);

const sortColorMap = {};

colorList.forEach(color => {
  sortColorMap[color] = color__path_results[color];
});

// console.log(sortColorMap);
// 写入js文件

const sortColorPath = 'sortColorPath.js';
fs.writeFileSync(sortColorPath, '');
fs.appendFileSync(sortColorPath, 'module.exports = ');
fs.appendFileSync(sortColorPath, JSON.stringify(sortColorMap));
fs.appendFileSync(sortColorPath, ';');
console.log('颜色排序完成');
