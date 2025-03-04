const axios = require('axios');
const nodemailer = require('nodemailer');
const express = require('express');
const moment = require('moment'); // 引入moment.js用于时间处理
const app = express();
const HttpProxyAgent = require('http-proxy-agent');

let index = 0;

function isWorkingTime() {
  const now = moment();
  const hour = now.hour();
  const dayOfWeek = now.day();

  // 工作日为周一到周五，day()返回的值是0（周日）到6（周六）
  const isWeekday = dayOfWeek !== 0 && dayOfWeek !== 6;

  // 检查是否在9:30-11:30或13:00-15:00之间
  const isMorningSession = hour >= 9 && hour < 11.5;
  const isAfternoonSession = hour >= 13 && hour < 15;

  return isWeekday && (isMorningSession || isAfternoonSession);
}
// 设置定时任务，每20秒请求一次API

// 设置邮件发送函数
function sendEmail(content) {
    let transporter = nodemailer.createTransport({
        service: '163', // 这里填写你的邮件服务提供商
        secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
        auth: {
          user: 'lzw10162@163.com',
          pass: 'KBZDOEYBUXQNLXUW',
        },
    });

    let mailOptions = {
        from: 'lzw10162@163.com', // 发件人地址
        to: 'zhiwei.li@theronts.biz,lzw10168@163.com,evechee@163.com', // 收件人地址
        subject: 'Latest message push', // 邮件主题
        html: content // 邮件内容
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
const proxy = {
  host: '54.67.125.45',
  port: 3128,
   
};

// 记录已经发送的
const sentContents = {}

function run_ths_monitor() {
    
    // setInterval(() => {

    if (!isWorkingTime()) {
      return;
    }
    // const proxyAgent = new HttpProxyAgent('61.160.202.88:80'); // 替换为你的代理服务器地址和

    const url = 'https://t.10jqka.com.cn/user_center/open/api/content/v2/get_by_uid';
    const headers = {
      'Content-Type': 'application/json'

    };
    const data = JSON.stringify({ user_id: 487881105 });

    axios.post(url, data, { headers})
        .then(({data: response}) => {
          console.log(`第 ${++index} 次请求结果:`, response.status_msg)
          if (response.status_code !== 0) {
            console.error('Error fetching data:', response.status_msg);
            sendEmail('Error fetching data')
            return;
          }
            const currentTime = Date.now();
            const contentTime = new Date(response.data.contents[0].info.ctime).getTime();
            // different ours = 
            const diffHours = Math.abs(currentTime - contentTime) / 3600000;
            console.log('different time:', diffHours)
            if (Math.abs(currentTime - contentTime) < 300000) { // 300秒以内
              console.log('New content found!', abstractContent);
              const abstractContent = response.data.contents[0].abstract.content;
              const imgurl = response.data.contents[0].share.display_info.image
                const imgHtml = `<img src="${imgurl}" />`;
                const newContent = `<div>
                <p>${abstractContent}</p>
                ${imgHtml}
                </div>`
                if (sentContents[response.data.contents[0].info.id]) {
                  return;
                }
                sendEmail(newContent);
                sentContents[response.data.contents[0].info.id] = true;
            } else {
                console.log('No new content found.');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
// }, 5000);
}
run_ths_monitor()

// module.exports = {
//   run_ths_monitor
// }
