const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// 读取现有的Excel文件
function readExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { raw: false });
  return data;
}
const excelFilePath = 'output.xlsx';

// 将数据追加到Excel文件
function appendDataToExcel(data, filePath = excelFilePath) {
  // 如果文件不存在，创建一个新的工作簿
  if (!fs.existsSync(filePath)) {
    const workbook = xlsx.utils.book_new();
    const sheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, sheet, 'Sheet1');
    xlsx.writeFile(workbook, filePath);
  } else {
    // 读取现有的Excel文件
    const existingData = readExcel(filePath);
    // 追加新数据
    const newData = existingData.concat(data);
    // 将新数据转换为工作表
    const sheet = xlsx.utils.json_to_sheet(newData);
    console.log('sheet: ', newData.length);
    // 更新工作簿
    const workbook = xlsx.readFile(filePath);
    xlsx.utils.sheet_add_json(sheet, newData, { skipHeader: true, origin: -1 });
    xlsx.utils.book_append_sheet(workbook, sheet, 'Sheet1');


    // xlsx.utils.book_replace_sheet(workbook, sheet, 'Sheet1');
    xlsx.writeFile(workbook, filePath);
  }
}

// 你的JSON数据
const jsonData = [
  // ... 你的JSON数据数组
];

// Excel文件的路径

// 追加数据到Excel文件
// appendDataToExcel(jsonData, excelFilePath);


function appendDataToJSON(data, filePath = 'output.json') {
  let existingData = [];
  if (fs.existsSync(filePath)) {
    existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  const newData = existingData.concat(data);
  fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
}




module.exports = {
  appendDataToExcel,
  appendDataToJSON,
  readExcel
}
