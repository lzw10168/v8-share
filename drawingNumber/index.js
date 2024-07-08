const fs = require('fs');
const path = require('path');
var natural = require('natural');

// 定义文件路径
const filePath = path.join(__dirname, 'list.txt');

// 读取文件
// fs.readFile(filePath, 'utf8', (err, data) => {
//   if (err) {
//     console.error('读取文件时出错:', err);
//     return;
//   }

//   // 按行分割文件内容
//   const lines = data.split(/\n/);

//   // 过滤掉长度大于15的行
//   const filteredLines = lines.filter(line => line.length <= 15);

//   // 将过滤后的内容转换回字符串
//   const result = filteredLines.join('\n');

//   // 写回文件
//   fs.writeFile(filePath, result, 'utf8', (err) => {
//     if (err) {
//       console.error('写入文件时出错:', err);
//       return;
//     }
//     console.log('文件处理完成，长度大于15的行已被删除。');
//   });
// });
// NHP1380893
// NHP1380894


const str1 = 'TL-D9.8';
const str2 = 'TL-D9.9';

// console.log(natural.HammingDistance(str1, str2, false));
// console.log(natural.LevenshteinDistance(str1, str2));
// console.log(natural.JaroWinklerDistance(str1, str2));

// 定义文件路径

// 读取文件
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('读取文件时出错:', err);
    return;
  }

  // 按行分割文件内容
  const lines = data.split(/\n/);

  // 准备一个集合来保存结构签名
  const structureSet = new Set();

  // 准备一个数组来保存保留的行
  let retainedLines = [];

  // 定义一个函数来创建字符串的结构签名
  function createStructureSignature(str) {
    return str.replace(/[a-zA-Z]/g, 'A').replace(/[0-9]/g, '0');
  }

  // 对比每一行
  lines.forEach((line) => {
    // 创建当前行的结构签名
    const signature = createStructureSignature(line.trim());

    // 检查结构签名是否已存在
    if (!structureSet.has(signature)) {
      // 如果结构签名是新的，保留这一行并记录其结构签名
      retainedLines.push(line.trim());
      structureSet.add(signature);
    }
  });

  // 输出结果
  console.log('保留的行：');
  // 剔除第一个字符为数字的行
  retainedLines = retainedLines.filter(line => !/^\d/.test(line));
  // 长度排序
  retainedLines.sort((a, b) => b.length - a.length);

  console.log(retainedLines.join('\n'));
  // 写入到新文件
  const newFilePath = path.join(__dirname, 'newList.txt');
  fs.writeFile(newFilePath, retainedLines.join('\n'), 'utf8', (err) => {
    if (err) {
      console.error('写入文件时出错:', err);
      return;
    }
    console.log('文件处理完成，已写入到newList.txt。');
  });
});

