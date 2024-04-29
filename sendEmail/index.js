

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const transporter = nodemailer.createTransport({
  service: '163',
  // host:'', // 配置单位邮箱系统的发件服务器
  // port: 465, //465
  secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
  auth: {
    user: 'lzw10162@163.com',
    pass: 'KBZDOEYBUXQNLXUW',
  },
});
const app = express();
app.use(bodyParser.json()); // 用于解析JSON格式的请求体


// 暴露POST接口
app.post('/sent_email', (req, res) => {
  const { to, subject, html } = req.body;
  var mailOptions = {
    from: 'lzw10162@163.com',
    to: to,
    subject: subject || 'Test HTML Email',
    html: html,
    // text: 'Your new password is ' + newPassword,
  };


  // 发送邮件
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('邮件发送失败:', error);
      res.status(500).send('邮件发送失败');
    } else {
      console.log('邮件发送成功:', info.response);
      res.send('邮件发送成功');
    }
  });
});

// 启动服务器
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  // 输出ipv4地址
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  for (const key in networkInterfaces) {
    if (networkInterfaces.hasOwnProperty(key)) {
      const element = networkInterfaces[key];
      element.forEach(item => {
        if (item.family === 'IPv4') {
          console.log(item.address);
  console.log(`服务器运行在 http://${item.address}:${PORT}`);

        }
      });
    }
  }
  
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
