const axios = require('axios');
const aesjs = require('./aes-js');
const JSEncrypt = require('node-jsencrypt');
const savefile = require('./savefile');
const { appendDataToExcel, appendDataToJSON } = savefile;
const publicKey = "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCAfPjwMX41Op6FxgFGfVJNMkyhqr+hLiUuYOQopeJBgfoGugsBfkZKhZS7erWL28MF+7GIT9qnWEqwx5wQlh9GbfVYs+5ZqaPC1PkGui5/xq+bxpRlBDF8FVJ5svTVvU1CbKDMvig2sarNZBrCH+M22vrmIsPnZubVfmPDxXJDBwIDAQAB-----END PUBLIC KEY-----"
var aesKey = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] // 随机产生
/**
 * aes加密方法
 * @param {string} text 待加密的字符串
 * @param {array} key 加密key
 */
function aesEncrypt(text, key) {
  const textBytes = aesjs.utils.utf8.toBytes(text) // 把字符串转换成二进制数据

  // 这边使用CTR-Counter加密模式，还有其他模式可以选择，具体可以参考aes加密库
  const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))

  const encryptedBytes = aesCtr.encrypt(textBytes) // 进行加密
  const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes) // 把二进制数据转成十六进制

  return encryptedHex
}

function parmsZh(str) {
  var arr = str.split("&");   //先通过？分解得到？后面的所需字符串，再将其通过&分解开存放在数组里
  var obj = {};
  for (var i of arr) {
    if (i.split("=")[0]) {
      obj[i.split("=")[0]] = (i.split("=")[1]).replace(/%/g, '%25');  //对数组每项用=分解开，=前为对象属性名，=后为属性值
    }
  }
  return obj
}

// 加密参数
function encryptParams(params) {
    params = decodeURIComponent(params)
    var text = parmsZh(params)
    text = JSON.stringify(text)
    const sendData = aesEncrypt(text, aesKey) // 把要发送的数据转成字符串进行加密
    // config.data = {
    //   params: sendData
    // }
    const encrypt = new JSEncrypt()
    let _publicKey = publicKey.replace(/[\r\n]/g,'');
    encrypt.setPublicKey(_publicKey)
    var encrypted = encrypt.encrypt(aesKey.toString())
    if (encrypted.slice(-2) === '==') {
      encrypted = encrypt.encrypt(aesKey.toString())
    }
    __parms = '&parms1=' + sendData + '&parms2=' + encodeURIComponent(encrypted)
    return __parms;
}

/**
 * aes解密方法
 * @param {string} encryptedHex 加密的字符串
 * @param {array} key 加密key
 */
function aesDecrypt(encryptedHex, key) {
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex) // 把十六进制数据转成二进制
  const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))

  const decryptedBytes = aesCtr.decrypt(encryptedBytes) // 进行解密
  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes) // 把二进制数据转成utf-8字符串
  return decryptedText
}






function sendRequest(page) {
const originParams = `num=&word=&sppp=&cj=&arrt=&page=${page}&count=20&kc=1&cfy=0&xlpx=0&jgpx=0&mzcx=0&mjcx=0&cx=0&wj=0&jxq=0&preSale=0&lable=[]&isCjData=1&couponId=&promotionId=`
const data = encryptParams(originParams)


// let data = '&parms1=8c7ffba2ca0183dfb457d607dd73549adad7b98f29fc292213afdda235b0b7c8a0580e71ba67a9ca3b6aeb839bd97bbaa55a097533fd798424e5bc9c906b644c89da50e8c130230bf51df19ae74975e946cca4b5eb2b08d43781687eb8561179c45ea9d4ed192cafd6b1ed9679354980833a1ad777e1cc1c33e3ea976a7a47ac0b45c3dac42c658cad55857e613e457be4261763a28b9b56e12663b53aa89039a8e0f3687ed24a9802ef9a16e26d201510c1ddbe09614cf3e1230ffee929c6b011f809287e11793912e86aa138a38a7f9da417273221b871b622ab4365cfd294f554bef68d3bf3533f744d8f&parms2=OhHE3MGwm4joRuUAXMCl6kkXmgIQyevnvDt37DzMzeehpbmsU2WuOeDhDbOrghqHA7%2BP%2F%2F9tIP0861%2B9u7UW5ARgywiARvnoX80p3ucWg7prZE5ldNmPScDqYu5vKpmFdUas0u0MEdt0fQa3TxK1wPMoAi1LJzPeeAuqPAJqXQE%3D';
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://www.hzjsyysc.com/qt_003_1_pc',
    headers: { 
      'Accept': '*/*', 
      'Accept-Language': 'zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7', 
      'Connection': 'keep-alive', 
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 
      'Cookie': 'b2b=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpcCI6IjEyNC4yMzMuMC4yMTEiLCJyZXEiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTIyLjAuMC4wIFNhZmFyaS81MzcuMzYiLCJleHAiOjE3MDk2ODk3NTc2NTF9.l2mS981E7uqd-etBrAgh-asB4HAQkFhyN7kTblF4wsg; B2B_KH=8879090e6243437956f4ad41ff9d9db9454cca13634226e2ff6aa448bc619ab9; B2B_key=3c929133-b28d-e856-0cea-39d5f3bd8490; B2B_form=pc', 
      'Origin': 'https://www.hzjsyysc.com', 
      'Referer': 'https://www.hzjsyysc.com/xt_allSearch.html?word=&domain=search', 
      'Sec-Fetch-Dest': 'empty', 
      'Sec-Fetch-Mode': 'cors', 
      'Sec-Fetch-Site': 'same-origin', 
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', 
      'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"'
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    let realdata =aesDecrypt(response.data, aesKey);
    realdata = JSON.parse(realdata);
    // appendDataToExcel(realdata[0]);
    appendDataToJSON(realdata[0]);
  })
  .catch((error) => {
    console.log(error);
  });
}


sendRequest(2)


