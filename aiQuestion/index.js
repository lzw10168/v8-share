const axios = require('axios');
const fs = require('fs');
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://theronts.sit-plus.day2plus.link/api/ai/guiding-questions?disableNav=true',
  headers: { 
    'accept': 'application/json, text/plain, */*', 
    'accept-language': 'zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7', 
    'cookie': 'accessToken=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYW51cy1zZXJ2aWNlLWF1dGgiLCJ1c2VySWQiOiI4MDA4MDU4NzI3MDYzNTUyMiIsInVzZXJOYW1lIjoiemhpd2VpLmxpIiwiZGVwdElkIjoiLTEiLCJjb21wYW55SWQiOiIxIiwiY29tcGFueVR5cGUiOiJNQU5BR0VSIiwicG9ydGFsVHlwZSI6Ik1BTkFHRVIiLCJqdGkiOiI3YTA1MzA2MDkyYzM0Y2Q1YTUyNDA0NzNhMmM0YWY4YyIsImlhdCI6MTcyNjAyMzgzOH0.f_RAKG99PMhWjer1xNPXnKV9UWKcUtC3otGUpRq5zu8; token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYW51cy1zZXJ2aWNlLWF1dGgiLCJ1c2VySWQiOiI4MDA4MDU4NzI3MDYzNTUyMiIsInVzZXJOYW1lIjoiemhpd2VpLmxpIiwiZGVwdElkIjoiLTEiLCJjb21wYW55SWQiOiIxIiwiY29tcGFueVR5cGUiOiJNQU5BR0VSIiwicG9ydGFsVHlwZSI6Ik1BTkFHRVIiLCJqdGkiOiI3YTA1MzA2MDkyYzM0Y2Q1YTUyNDA0NzNhMmM0YWY4YyIsImlhdCI6MTcyNjAyMzgzOH0.f_RAKG99PMhWjer1xNPXnKV9UWKcUtC3otGUpRq5zu8', 
    'priority': 'u=1, i', 
    'referer': 'https://theronts.sit-plus.day2plus.link/ai-bot/index.html', 
    'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-platform': '"Windows"', 
    'sec-fetch-dest': 'empty', 
    'sec-fetch-mode': 'cors', 
    'sec-fetch-site': 'same-origin', 
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  }
};

// 用于存储所有问题的集合
let allQuestions = new Set();

// 定义一个函数来发送请求并处理响应
const fetchQuestions = async () => {
  try {
    const response = await axios.request(config);
    const questions = response.data.data.map(q => q.question);
    questions.forEach(question => allQuestions.add(question));
  } catch (error) {
    console.error(error);
  }
};

// 定义一个函数来重复请求并写入文件
const repeatRequestAndWriteToFile = async () => {
  for (let i = 0; i < 50; i++) {
    await fetchQuestions();
  }

  // 将所有问题写入到文本文件中, 标上序号, 按首字母顺序排列 加换行符
  let questionsArr = Array.from(allQuestions);
  let questionsWithIndex = questionsArr.sort((a, b) => a.localeCompare(b)).map((q, index) => `${index + 1}. ${q}`);
  fs.writeFile('questions.txt', questionsWithIndex.join('\n'), (err) => {
    if (err) {
      console.error('写入文件时发生错误:', err);
    } else {
      console.log('问题已经被记录到questions.txt文件中');
    }
  });
  // fs.writeFile('questions.txt', Array.from(allQuestions).join(
  //   '\n'
  // ),(err) => {
  //   if (err) {
  //     console.error('写入文件时发生错误:', err);
  //   } else {
  //     console.log('问题已经被记录到questions.txt文件中');
  //   }
  // });
};

// 执行函数
repeatRequestAndWriteToFile();
