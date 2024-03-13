const fs = require('fs');
const path = require('path');

// 定义正则表达式用于匹配颜色值
const colorRegex =
  /#([a-fA-F\d]{6}|[a-fA-F\d]{3})|rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([01](?:\.\d+)?)\s*)?\)/g;

// 遍历指定目录下的所有文件
function traverseDirectory(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      traverseDirectory(filePath, callback);
    } else {
      callback(filePath);
    }
  });
}

// 查询颜色值
function findColorsInFile(filePath, colorMap) {
  // 只查询 .tsx, .js, .jsx 文件
  if (filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    const content = fs.readFileSync(filePath, 'utf-8');
    let matches;
    while ((matches = colorRegex.exec(content)) !== null) {
      const color = matches[0];
      if (!colorMap.has(color)) {
        // 第一次出现的颜色值，初始化路径数组
        colorMap.set(color, [filePath]);
      } else {
        // 后续出现的颜色值，添加路径到数组
        colorMap.get(color).push(filePath);
      }
    }
  }
}

// 指定项目根目录
const projectRoot = './src';

// 创建颜色值到路径的映射
const colorPathMap = new Map();

// 遍历目录并查询颜色值
traverseDirectory(projectRoot, (filePath) => findColorsInFile(filePath, colorPathMap));

// 保存结果到文本文件
const colorFilePath = 'color_results.txt';
const allFilePath = 'color__path_results.js';

fs.writeFileSync(colorFilePath, '');
fs.writeFileSync(allFilePath, '');

// 颜色单独保存到文本文件
// fs.appendFileSync(allFilePath, `Color: ${color}\nFile: ${filePath}\n---\n`);
const colorMap = new Map();
colorPathMap.forEach((filePath, color) => {
fs.appendFileSync(colorFilePath, `'${color}',\n`);
  // 颜色值为key, 文件路径存为数组
  if (!colorMap.has(color)) {
    colorMap.set(color, [filePath]);
  }else {
    colorMap.get(color).push(filePath);
  }

  // 把colorMap 转成JSON字符串
  const colorMapStr = JSON.stringify([...colorMap]);
  // 写入文件
  fs.writeFileSync(allFilePath, colorMapStr);
});
