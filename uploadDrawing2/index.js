const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const parentFilesId = "328324900639547393";

async function uploadDrawing({
  file,
}) {
  let data = new FormData();
  data.append('file', file);
  data.append('parentFilesId', parentFilesId);

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://stobg.daytwoplus.com/api/file/drawing/folder/upload',
    headers: {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7',
      'cookie': 'accessToken=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYW51cy1zZXJ2aWNlLWF1dGgiLCJ1c2VySWQiOiI5Mjc0MzIxMTg2Mjk2NjI3NCIsInVzZXJOYW1lIjoiU1RPQkciLCJkZXB0SWQiOiItMSIsImNvbXBhbnlJZCI6IjkyNzQzMjA5OTQzMzAyMTQ2IiwiY29tcGFueVR5cGUiOiJNQU5BR0VSIiwicG9ydGFsVHlwZSI6Ik1BTkFHRVIiLCJqdGkiOiIxMGU5NjhhNDJmYWI0MGQyODNiMjM1ZmM2Y2Q0Y2Q4ZSIsImlhdCI6MTcxNDQ1NzkyNH0.hlIzDpAGHrWI8160zo8bgT4er8_BZSka17d3q-G83dY; token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYW51cy1zZXJ2aWNlLWF1dGgiLCJ1c2VySWQiOiI5Mjc0MzIxMTg2Mjk2NjI3NCIsInVzZXJOYW1lIjoiU1RPQkciLCJkZXB0SWQiOiItMSIsImNvbXBhbnlJZCI6IjkyNzQzMjA5OTQzMzAyMTQ2IiwiY29tcGFueVR5cGUiOiJNQU5BR0VSIiwicG9ydGFsVHlwZSI6Ik1BTkFHRVIiLCJqdGkiOiIxMGU5NjhhNDJmYWI0MGQyODNiMjM1ZmM2Y2Q0Y2Q4ZSIsImlhdCI6MTcxNDQ1NzkyNH0.hlIzDpAGHrWI8160zo8bgT4er8_BZSka17d3q-G83dY',
      'origin': 'https://stobg.daytwoplus.com',
      'priority': 'u=1, i',
      'referer': 'https://stobg.daytwoplus.com/owner/303752544990588930/303753650059669506?ownerName=Pfizer&anchor=Drawing',
      'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      ...data.getHeaders()
    },
    data: data
  };
  return await axios.request(config)

}



async function publishDrawing({
  fileBaseName,
  publishFilesList
}) {

  let data = JSON.stringify({
    "fileBaseName": fileBaseName,
    "parentFilesId": parentFilesId,
    "subcommonType": "buildingAsBuilt",
    "publishFilesList": publishFilesList
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://stobg.daytwoplus.com/api/file/drawing/folder/upload/publish',
    headers: {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7',
      'content-type': 'application/json',
      'cookie': 'accessToken=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYW51cy1zZXJ2aWNlLWF1dGgiLCJ1c2VySWQiOiI5Mjc0MzIxMTg2Mjk2NjI3NCIsInVzZXJOYW1lIjoiU1RPQkciLCJkZXB0SWQiOiItMSIsImNvbXBhbnlJZCI6IjkyNzQzMjA5OTQzMzAyMTQ2IiwiY29tcGFueVR5cGUiOiJNQU5BR0VSIiwicG9ydGFsVHlwZSI6Ik1BTkFHRVIiLCJqdGkiOiIxMGU5NjhhNDJmYWI0MGQyODNiMjM1ZmM2Y2Q0Y2Q4ZSIsImlhdCI6MTcxNDQ1NzkyNH0.hlIzDpAGHrWI8160zo8bgT4er8_BZSka17d3q-G83dY; token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYW51cy1zZXJ2aWNlLWF1dGgiLCJ1c2VySWQiOiI5Mjc0MzIxMTg2Mjk2NjI3NCIsInVzZXJOYW1lIjoiU1RPQkciLCJkZXB0SWQiOiItMSIsImNvbXBhbnlJZCI6IjkyNzQzMjA5OTQzMzAyMTQ2IiwiY29tcGFueVR5cGUiOiJNQU5BR0VSIiwicG9ydGFsVHlwZSI6Ik1BTkFHRVIiLCJqdGkiOiIxMGU5NjhhNDJmYWI0MGQyODNiMjM1ZmM2Y2Q0Y2Q4ZSIsImlhdCI6MTcxNDQ1NzkyNH0.hlIzDpAGHrWI8160zo8bgT4er8_BZSka17d3q-G83dY',
      'origin': 'https://stobg.daytwoplus.com',
      'priority': 'u=1, i',
      'referer': 'https://stobg.daytwoplus.com/owner/303752544990588930/303753650059669506?ownerName=Pfizer&anchor=Drawing',
      'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    },
    data: data
  };

  return await axios.request(config)


}


async function run() {
  try {
    // 读取files目录
    // 通过page_number number排序
    const files = fs.readdirSync('./files')
      .filter((file) => file.endsWith('.pdf'))
      .sort((a, b) => {
        const aNumber = a.split('-')[0].replace('page_', '');
        const bNumber = b.split('-')[0].replace('page_', '');
        return +aNumber - +bNumber;
      });
    
    // 上传文件
    for (let i = 0; i < files.length; i++) {
      try {
        const filePath = `./files/${files[i]}`;
        const fileStream = fs.createReadStream(filePath);
        
        // 上传文件
        let res = await uploadDrawing({ file: fileStream });
        res = res.data;
        
        // 确保文件流被关闭
        fileStream.close();
        // LT-313*****
        // 取出LT-313
        // const reg = /LT-\d+/;
        // const number = files[i].match(reg)[0];
        // 去掉文件名中的后缀\
        let number = ''
        // if (files[i].split('-')[2] ) {

        //   number = (files[i].split('-')[1] +'-'+ files[i].split('-')[2] ).replace('.pdf', '');
        // } else {
        //   number = files[i].split('-')[1].replace('.pdf', '');
        // }

        number = files[i].split('-')[1].replace('.pdf', '');
        console.log(`上传文件${number}成功`);
        
        // 假设res.splitFiles是一个数组，且我们需要第一个分割的文件
        const publishFile = res.data.splitFiles[0];
        publishFile.number = number;
        const publishFilesList = [publishFile];
        
        // 发布文件
        let res1 = await publishDrawing({
          fileBaseName: files[i],
          publishFilesList
        })
        
        res1 = res1.data;
        
        if (res1.code === 0) {
          console.log(`发布文件${number}成功`);
        } else {
          console.error(`发布文件${number}失败，状态码：${res1.code}`);
        }
      } catch (uploadOrPublishError) {
        console.error(`处理文件${files[i]}时出错: ${uploadOrPublishError}`);
      }
    }
  } catch (readDirError) {
    console.error(`读取目录出错: ${readDirError}`);
  }
}

// 确保run函数被调用，并且处理可能的未捕获的异常
run().catch((runError) => {
  console.error(`运行出错: ${runError}`);
});
