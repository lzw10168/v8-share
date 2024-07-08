const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

// 你的目标服务器地址
const targetUrl = 'http://theronts.dev-plus.day2plus.net/';

// 使用cookie-parser中间件
app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  console.log('req: ', req.method, req.url);
  // 设置cookie
  res.cookie('accessToken', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYW51cy1zZXJ2aWNlLWF1dGgiLCJ1c2VySWQiOiI4MDA4MDU4NzI3MDYzNTUyMiIsInVzZXJOYW1lIjoiemhpd2VpLmxpIiwiZGVwdElkIjoiLTEiLCJjb21wYW55SWQiOiIxIiwiY29tcGFueVR5cGUiOiJNQU5BR0VSIiwicG9ydGFsVHlwZSI6Ik1BTkFHRVIiLCJqdGkiOiJlYzE1OTg2YmMxODU0MjlkYjhlZmRmYWZmNWM1OWM5OCIsImlhdCI6MTcyMDQwNzc3NH0.QJUMaoPd9_wzZX8m8UJi_SUi1sIHvCl3z2dlGo66SCo;')
  res.cookie('token', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYW51cy1zZXJ2aWNlLWF1dGgiLCJ1c2VySWQiOiI4MDA4MDU4NzI3MDYzNTUyMiIsInVzZXJOYW1lIjoiemhpd2VpLmxpIiwiZGVwdElkIjoiLTEiLCJjb21wYW55SWQiOiIxIiwiY29tcGFueVR5cGUiOiJNQU5BR0VSIiwicG9ydGFsVHlwZSI6Ik1BTkFHRVIiLCJqdGkiOiJlYzE1OTg2YmMxODU0MjlkYjhlZmRmYWZmNWM1OWM5OCIsImlhdCI6MTcyMDQwNzc3NH0.QJUMaoPd9_wzZX8m8UJi_SUi1sIHvCl3z2dlGo66SCo;')

  next();
}  
)

const corsOptions = {
  origin: 'http://localhost:7700',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(cors(corsOptions));

// 设置代理中间件
const proxyOptions = {
  target: targetUrl,
  changeOrigin: true,
  // pathRewrite: {
  //   '^/api': '', // 如果你的前端API请求带有/api前缀，需要重写路径
  // },
  onProxyReq: (proxyReq, req, res) => {
    // console.log('res: ', res);
    // 可以在这里添加自定义的cookie
    proxyReq.setHeader('Cookie', 'sidebar_collapsed=false; _pk_id.2.1fff=5b9bb28a5fc9923d.1690955965.; locale=zh-cn; _pk_id.11.1fff=54922ad53d32f958.1704778900.; _pk_id.12.1fff=c20b7c7d1c32a42a.1706079364.; _ga=GA1.1.1837755207.1708307087; _clck=1hpf6j8%7C2%7Cfmm%7C0%7C1509; _ga_DB2D2Z3SF3=GS1.1.1718349570.22.0.1718349570.0.0.0; 11=11; _pk_ses.11.1fff=1; accessToken=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYW51cy1zZXJ2aWNlLWF1dGgiLCJ1c2VySWQiOiI4MDA4MDU4NzI3MDYzNTUyMiIsInVzZXJOYW1lIjoiemhpd2VpLmxpIiwiZGVwdElkIjoiLTEiLCJjb21wYW55SWQiOiIxIiwiY29tcGFueVR5cGUiOiJNQU5BR0VSIiwicG9ydGFsVHlwZSI6Ik1BTkFHRVIiLCJqdGkiOiJlYzE1OTg2YmMxODU0MjlkYjhlZmRmYWZmNWM1OWM5OCIsImlhdCI6MTcyMDQwNzc3NH0.QJUMaoPd9_wzZX8m8UJi_SUi1sIHvCl3z2dlGo66SCo; token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYW51cy1zZXJ2aWNlLWF1dGgiLCJ1c2VySWQiOiI4MDA4MDU4NzI3MDYzNTUyMiIsInVzZXJOYW1lIjoiemhpd2VpLmxpIiwiZGVwdElkIjoiLTEiLCJjb21wYW55SWQiOiIxIiwiY29tcGFueVR5cGUiOiJNQU5BR0VSIiwicG9ydGFsVHlwZSI6Ik1BTkFHRVIiLCJqdGkiOiJlYzE1OTg2YmMxODU0MjlkYjhlZmRmYWZmNWM1OWM5OCIsImlhdCI6MTcyMDQwNzc3NH0.QJUMaoPd9_wzZX8m8UJi_SUi1sIHvCl3z2dlGo66SCo');
  },
  onProxyRes: (proxyRes, req, res) => {
    // console.log('res: ', res);
    // 如果需要，可以在这里修改响应头
    // 例如，添加Access-Control-Allow-Origin来解决跨域问题
    res.header('Access-Control-Allow-Origin', '*');
  },
};
// 监听/open/auth/saml/portal/support响应头

app.use('/open/auth/saml/portal/support', (req, res) => {
  // console.log('req: ', req);
  res.header('Access-Control-Allow-Origin', '*');
  res.send({"code":0,"msg":"success","data":{"portalSupportSaml":false,"redirectIdp":''}});
})

// 使用代理中间件转发请求

app.use('/', createProxyMiddleware(proxyOptions));
// app.use('/open/', createProxyMiddleware(proxyOptions));
// app.use('/', createProxyMiddleware(proxyOptions));
// 监听端口
const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
