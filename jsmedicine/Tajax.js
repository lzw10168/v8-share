/*--------------
 作者:Tennt
 --------------*/
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
 var Tajax = {
     jg: 32, //列队间隔时间,jg的大小可以协调Tajax.send的性能,,当Tajax.jg=0时，Tajax.send与Tajax.sendnow俱备一样的竞争，但前者并发性能要好于后者，一般设置Tajax.jg＝32,这个间隔时间是留给页面渲染的进程
     _PSF: false, //判断列队是否在执行中
     _objLD: [], //列队序列，保存所有请求
     _objPool: [], //ajax连接对象池，没有列队系统情况下，多个并发的竞争会让对象池一直自增，如果有列队，程序会利用空闲的ajax对象来操作
     sendnow: function () {
         if (typeof (arguments[0]) == "string") {//直接调用时发出请求，会与其它请求竞争，可能会增加一个请求对象，不一定会使用到闲置的请求对象
             arguments._ajax = { start: new Date, issend: false, sendtime: null, stop: null, Timeout: null, OPL: null, NL: null, Limit: arguments[4], clear: null, Text: null, Parms: arguments };
             Tajax.sendReq(arguments);
         }
         else {//由列队系统发出的请求
             if(arguments[0][0]=='post'||arguments[0][0]=='get')
             {
                 Tajax.sendReq(arguments[0]);
             }
             //可以在这里判断是否要用jsonp
             if(arguments[0][0]=='jsonp')
             {
                 var arg = arguments[0];
                 arg._ajax.sendtime = new Date;
                 var _bp=document.body.parentNode;
                 var scriptobj = document.createElement('script');
                 //scriptobj._jsonp={ start: new Date, issend: false, sendtime: null, stop: null, Timeout: null, OPL: null, NL: null, Limit: arguments[4], clear: null, Text: null, Parms: arguments };
                 scriptobj.language = "javascript";
                 scriptobj.type = "text/javascript";
                 scriptobj.defer = true; //看情况再加
                 scriptobj.callback=arg[3];
                 scriptobj.src = arg[1]+'?rand=' + Math.random()+"&"+arg[2];//不加会有数据缓存造成一些不可预见的错误
                 _bp.appendChild(scriptobj);
                 var tObj=arg[1].substr(arg[1].lastIndexOf("/")+1);
              //   alert(tObj)
                 //scriptobj.abort();
                 if (!/*@cc_on!@*/0) { //if not IE
                     scriptobj.onload = function () {
                         //alert(_________LZT)
                         clearTimeout(arg._ajax.clear);
 
                        // alert(arg._ajax.Timeout);
                         //alert(_________LZT)
                         if(!arg._ajax.Timeout)
                         {
                             arg._ajax.Timeout = false;
                             arg._ajax.Text = eval(tObj);
                             //arg._ajax.Text = _________LZT;
                             arg._ajax.stop = new Date;
                             arg._ajax.issend = true; //通知计时器这里已经执行了,并且数据已经准备好可供读取
                             scriptobj.callback(arg._ajax);
                             _bp.removeChild(scriptobj);
                         //    alert(1);
                         }
                     }
                 } else {
                     //IE6、IE7 support js.onreadystatechange
                     scriptobj.onreadystatechange = function () {
                         if (scriptobj.readyState == 'loaded' || scriptobj.readyState == 'complete') {
                             //alert(_________LZT)
                             //alert(arg._ajax.clear+"___"+arg._ajax.Timeout);
                             clearTimeout(arg._ajax.clear);
 
                            // alert(arg._ajax.clear+"___"+arg._ajax.Timeout);
                             //alert(_________LZT)
                             if(!arg._ajax.Timeout)
                             {
                                 arg._ajax.Timeout = false;
                                 arg._ajax.Text = eval(tObj);
                                // arg._ajax.Text = _________LZT;
                                 arg._ajax.stop = new Date;
                                 arg._ajax.issend = true; //通知计时器这里已经执行了,并且数据已经准备好可供读取
                                 scriptobj.callback(arg._ajax);
                                 _bp.removeChild(scriptobj);
                             }
                         }
                     }
                 }
                 //这里要开始计时
                 arg._ajax.clear = setTimeout(function () { Tajax._Timeout(scriptobj.callback, scriptobj, arg,_bp) }, arg._ajax.Limit);
             }
         }
     },
     _dostop: function (obj) {//整个列队结束时执行,这里只是设置了一个列队结束标识
         Tajax._PSF = false;
         //document.getElementById("loaddiv").style.display="none";
     },
     cs: function (items, process, callback, t)//列队核心
     {
         Tajax._PSF = true; //开启列队
         var todo = items;
         setTimeout(function () {
             process(todo.shift()); //取出一个请求并执行
             if (todo.length > 0)//列队里还有任务就继续执行
             {
                 setTimeout(arguments.callee, t);
             }
             else {
                 callback(); //处理完毕,更改标识符
             }
         }, t);
     },
     send: function ()//增加一个任务后开始处理
     {
 
             //之所以设置_ajax,为的是给每个请求添加一些属性
         /*if(document.getElementById("loaddiv")!=undefined){
             document.getElementById("loaddiv").style.display="block";
         }else{
             var item = document.createElement("div");
             item.className="tajax_css";
             item.innerHTML='<img src="../images_b/loading2.gif" style="margin-top: 300px;width: 25px;height: 25px;">';
             item.id="loaddiv";
             document.body.appendChild(item);
         }*/
 
         arguments._ajax = { start: new Date, issend: false, sendtime: null, stop: null, Timeout: null, OPL: null, NL: null, Limit: arguments[4], clear: null, Text: null, Parms: arguments };
         Tajax._objLD.push(arguments); //压一个任务进列队
         if (!Tajax._PSF)//如果列队不在处理中，就重新开启
         {
             Tajax.cs(Tajax._objLD, Tajax.sendnow, Tajax._dostop, Tajax.jg);
         }
     },
     _getInstance: function (tob) {//检查哪个请求对象是闲置的
         for (var i = 0; i < this._objPool.length; i++) {
             if (this._objPool[i].readyState == 0 || this._objPool[i].readyState == 4) {
                 tob.NL = i;
                 tob.OPL = this._objPool.length;
                 return this._objPool[i];
             }
         }
 
         this._objPool[this._objPool.length] = this._createObj();
         tob.NL = this._objPool.length - 1;
         tob.OPL = this._objPool.length;
         return this._objPool[this._objPool.length - 1];
     },
     _createObj: function () {//返回一个连接对象
         return (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('MSXML2.XMLHTTP.6.0'));
     },
     _Timeout: function (callback, objXMLHttp, arg,_bp) {
 
         //超时分两种,一种是当地址出错,数据返不回来,延时到超时的情况.
         //另一种是经测试,当请求是通过列队发出,并且超时设置得比较低如10的时候,有可能在正确返回了
         //数据的情况下,计时器还没有取消,导致这里的回调会再一次执行,那么就要先设置arg._ajax.issend
         //然后再判断是否已经执行了回调,如果执行了,那么这里就不会再执行
         //alert(arg[0])
         if(arg[0]!="jsonp")
         {
             objXMLHttp.abort(); //如何把这一行移到callback(arg._ajax);上面,又会出现两次回调,原因是,在这里又没
         }
         //取消的话,objXMLHttp还是在请求中
 
         if (!arg._ajax.issend) {//判断是否已经正确取回数据，这里要加这个是有可能在超时时，仍然取回了数据
             arg._ajax.Timeout = true;
             arg._ajax.stop = new Date;
             //arg._ajax.Text=
             //arg._ajax.issend=false;
             callback(arg._ajax);
             if(arg[0]=="jsonp")
             {
                 _bp.removeChild(objXMLHttp);
             }
         }
     },
     sendReq: function () {// 发送请求(方法[post,get], 地址, 数据, 回调函数)
         var arg = arguments[0];
         arg._ajax.sendtime = new Date; //这个是当前请求发出的时间
         //要查看请求所花的时间是obj.stop - obj.sendtime
         //要查看请求从发出到结束所花的真实时间是obj.stop - obj.start
         var callback = arg[3];
         var objXMLHttp = this._getInstance(arg._ajax);
         url = arg[1];
 
         objXMLHttp.open(arg[0], url, true);
         objXMLHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
 
 
         if(arg[5]!=undefined&&arg[5].SRH!=undefined)
         {
             objXMLHttp.setRequestHeader('x',arg[5].SRH);
         }
       // 对参数进行加密
       let __parms = ''
       if (publicKey && !arg[7]) {
         arg[2] = decodeURIComponent(arg[2])
         var text = parmsZh(arg[2])
         text = JSON.stringify(text)
         const sendData = aesEncrypt(text, aesKey) // 把要发送的数据转成字符串进行加密
         // config.data = {
         //   params: sendData
         // }
         const encrypt = new JSEncrypt()
         publicKey = publicKey.replace(/[\r\n]/g,'');
         encrypt.setPublicKey(publicKey)
         var encrypted = encrypt.encrypt(aesKey.toString())
         if (encrypted.slice(-2) === '==') {
           encrypted = encrypt.encrypt(aesKey.toString())
         }
         __parms = '&parms1=' + sendData + '&parms2=' + encodeURIComponent(encrypted)
       }
       if (__parms) {
         objXMLHttp.send(__parms);
       } else {
         objXMLHttp.send(arg[2]);
       }
         objXMLHttp.onreadystatechange = function () {
             //alert(objXMLHttp.readyState+","+objXMLHttp.status);
             //如果有设置超时,那么这里能够执行，即是在未超时情况下就执行了,但也可能刚好两者都存在,即这里执行了,又执行了超时处理
             //于是要设置arg._ajax.issend = true;然后在计时器里再判断,避免两次回调,计时器回调的是超时的回调
             if (objXMLHttp.readyState == 4 && (objXMLHttp.status == 200 || objXMLHttp.status == 304)) {
                 clearTimeout(arg._ajax.clear); //要明白这里未必会执行到,当目标地址不对,这里是没办法处理的
                 arg._ajax.Timeout = false;
                 arg._ajax.Text = aesDecrypt(objXMLHttp.responseText, aesKey);
                 arg._ajax.stop = new Date;
                 arg._ajax.issend = true; //通知计时器这里已经执行了,并且数据已经准备好可供读取
                 callback(arg._ajax);
             }
             else
             {
                // alert(objXMLHttp.readyState+","+objXMLHttp.status);
             }
         }
         //本来还想设置说当超时时间为0时,就不开启计时器,但这样是不行的,原因是为了通过计时器来避免当目标请求地址出错(如失效之类)时,没有出错回调机制这个问题
         arg._ajax.clear = setTimeout(function () { Tajax._Timeout(callback, objXMLHttp, arg) }, arg._ajax.Limit);
     }
 };
 /*
  //总算可以完成了,注释下来再细化,上面还有很注释是不当的,但代码上基本没什么太大的问题
  使用方法
 
  Tajax.jg 的大小可以协调Tajax.send的性能,当Tajax.jg=0时，Tajax.send与Tajax.sendnow俱备一样的竞争，但前者性能要好于后者，一般设置Tajax.jg＝32,为的是不抢占页面渲染的线程
  Tajax.send("请求类型:建议全是post","请求目标地址","请求的数据","回调函数","超时时间","页面所需要传输的参数,用逗号隔开,这一部分不会发送到服务端,只会在页面本身进行处理,可任意多,不超出系统限制就行");
  Tajax.send("post", "command/cs.ashx", "a=3&b=4&c=5", Init, 100, "b", cc,i);//加入请求列队,重复使用闲置的请求对象
  Tajax.sendnow("post", "command/cs.ashx", "a=3&b=4&c=5", Init, 100, "b", cc,i);//直接发出请求，会与其它请求竞争，可能会增加一个请求对象，不一定会使用到闲置的请求对象，建议不在与多个ajax请求并发情况下使用
  function(obj)
  {
  obj.Limit //超时时间
  obj.OPL //系统当前请求连接池长度
  obj.NL //当前连接使用了连接池里哪个连接
  obj.Parms //连接的各种参数,前五个参数顺序是固定的(请求类型，请求目标，参数，回调函数，设置超时时间0为不设置超时，parms..)之后要设置的参数都可以以逗号隔开，函数也可以作为参数进行传参
  obj.start //发起连接时间
  obj.sendtime//发出请求的时间
  obj.stop //连接完成或超时的时间
  obj.Timeout //是否超时
  obj.Text //返回请求的值
  //要查看请求所花的时间是obj.stop - obj.sendtime
  //要查看请求从发出到结束所花的真实时间是obj.stop - obj.start,且因为列队系统有计时间隔的存在,每一个请求都要比前一个多花一些间隔的时间
  //总体上看来Tajax.send与Tajax.sendnow同时发出100条请求的话,前者花的总时间是多于后者的,但后者这么多请求又没留给时间让页面渲染,用户体验不是很好
  //所以Tajax.send建议应用于需要多个并发请求的环境,Tajax.sendnow则可以作为单独的请求发出,效果会比较好
  //由于有计时器的存在,时间上会不太准确,但已经很接近
  }
  */
 
 function zwtp(obj){
     obj.src="images_b/err.jpg";
     obj.onerror=null;
 }
 function request(paras) {
     var url = window.location + "";
     url = url.replace('#', '?');
     var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
     var paraObj = {}
     for (i = 0; j = paraString[i]; i++) {
         paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
     }
     var returnValue = paraObj[paras.toLowerCase()];
     if (typeof (returnValue) == "undefined") {
         return "";
     } else {
         return returnValue;
     }
 }
 //分页js
 function fy(L, l, All, p,fun,gofun)//L分页长度，l是每页数量，All是总量,p是输入的页数，后面的可有可无，比较粗糙还没优化好
 {
     s_r = Math.floor(p);
     var min = 0;
     var max = 0;
     var D = 0;
     //All暂时变为页数
     var pagecount = (All % l == 0) ? (All / l) : (Math.ceil(All / l))//数量
     //var pagecount=All;//页数
     var L_C = (L % 2 == 0) ? (L / 2) : (Math.ceil(L / 2) + 1); //页码居中
     if (s_r <= 0 || s_r > pagecount)//第一种情况：输入数不在有效的页数内，所以把它定位到第一页
     {
         min = 1;
         D = 1;
         max = (pagecount > L) ? L : pagecount;
 
     }
     else {
         if (pagecount <= L)//第二种情况：当总页数小于页码长度时
         {
             min = 1;
             D = s_r;
             max = pagecount;
         }
         else {
             if (s_r <= L_C)//第三种情况：
             {
                 min = 1;
                 D = s_r;
                 max = L;
             }
             else {
                 if ((pagecount - s_r) <= L_C)//第四种情况：
                 {
                     min = pagecount - L + 1;
                     D = s_r;
                     max = pagecount;
                 }
                 else {
                     min = s_r - L_C + 1;
                     D = s_r;
                     max = (L % 2 == 0) ? (s_r + L_C) : (s_r + L_C - 1);
                     //alert(s_r +"___"+ L_C +"____"+ 1)
                     //alert(min+"____"+max+"____"+D+"____"+s_r+"____"+L_C+"____"+L+"____"+pagecount)
                 }
             }
         }
     }
 
     var fy = "";
     for (var kg = min; kg <= max; kg++) {
         fy += (kg == D) ? "<span class=box1>&thinsp;&thinsp;" + kg + "&thinsp;&thinsp;</span>" : "<span class=box3 onclick=\""+fun+"('" + kg + "')\" >&thinsp;&thinsp;" + kg + "&thinsp;&thinsp;</span>";
     }
     setTimeout(function(){
         if (p == 1) {
             document.getElementById("pre").className="box3 disable";
         }else{
             document.getElementById("pre").className="box3";
         }
         if (p== pagecount) {
             if(document.getElementById("zy_mod") && e!="业务员"){
                 document.getElementById("zy_mod").style.display = "block";
             }
             document.getElementById("next").className="box3 disable";
 
         }else{
             document.getElementById("next").className="box3";
         }
     },50)
 
     var FY = "<span style=\"color:#C94047;display:none;\" >共"+ All +"条</span><span  onclick=\""+fun+"('" + (D == 1 ? 1 : (D - 1)) + "')\" ><span class=\"box3\"id=\"pre\" style='margin-right:10px;'><span style=\"font-family:Arial\" ></span>上一页</span></span>" + fy + "<span onclick=\""+fun+"('" + ((D < max) ? (D == 1 ? 2 : (D + 1)) : ((max == 0 ? max + 1 : max))) + "')\" ><span class=\"box3\" style='margin-left:10px;'  id=\"next\">下一页<span style=\"font-family:Arial\"></span></span></span><span class=box3 onclick=\""+fun+"('" + pagecount + "')\" style=\"color:#6F6F6F;border:none;margin-left:20px\" >共" + pagecount + "页</span>&nbsp;到第 <input type=\"text\" value=\"" + p + "\" style=\"width:30px;text-align:center;\" onBlur=\"getInputF(1,'fyButtom')\" onFocus=\"getInputF(2,'fyButtom')\" id=\"fytext\" /> 页&nbsp;<span type=\"button\" id='fyButtom' value=\"确定\" class=\"fybutton\" onclick=\""+gofun+"('" + pagecount + "')\" style='cursor:pointer;display: inline-block;padding:10px 4px 10px 4px;height:20px;'>确定</span>";
 
     return FY;
 }
 