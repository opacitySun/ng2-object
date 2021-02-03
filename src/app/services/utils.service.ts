import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
//工具类
export class UtilsService {

  constructor() { }

  //设置页面的字体尺寸基数
  setPageBaseFontSize(uiWidth:number) {
    let screenW = document.body.clientWidth;
    let uiSize = uiWidth/100;
    let fontSize = screenW/uiSize;
    document.getElementsByTagName('html')[0].style.fontSize = fontSize+"px";
  }

  //判断是否有值
  hasValue(val:any) {
    if (typeof val === "object") {
			return val !== null && val !== {} && JSON.stringify(val).length > 2;
		} else {
			return val !== "" && val !== undefined && !/^\s+$/.test(val);
		}
  }

  //判断是否是数组
  isArray(val:any) {
    return Object.prototype.toString.call(val)== '[object Array]';
  }

  //判断是否是json格式的字符串
  isJSONStr(str:any) {
    if (typeof str == 'string') {
      try {
        let obj = JSON.parse(str);
        if(typeof obj == 'object' && obj ){
          return true;
        }else{
          return false;
        }
      } catch(e) {
        return false;
      }
    }else{
      return false;
    }
  }

  //深拷贝
  deepClone(data:any) {
    return JSON.parse(JSON.stringify(data));
  }

  //判断是否是函数
  isFn(fn:any) {
    return typeof fn === "function";
  }

  //是否是空对象
  isEmptyObject(obj: any) {
    let arr = Object.keys(obj);
    return arr.length === 0;
  }

  //判断是否是电脑端
  isPc() {
    let sUserAgent:any = navigator.userAgent.toLowerCase();
    let bIsIpad:boolean = sUserAgent.match(/ipad/i) == "ipad";
    let bIsIphoneOs:boolean = sUserAgent.match(/iphone os/i) == "iphone os";
    let bIsMidp:boolean = sUserAgent.match(/midp/i) == "midp";
    let bIsUc7:boolean = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    let bIsUc:boolean = sUserAgent.match(/ucweb/i) == "ucweb";
    let bIsAndroid:boolean = sUserAgent.match(/android/i) == "android";
    let bIsCE:boolean = sUserAgent.match(/windows ce/i) == "windows ce";
    let bIsWM:boolean = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
      return false;
    } else {
      return true;
    }
  }

  //获取设备类型
  getDeviceType() {
    let os = function() {
      let ua = navigator.userAgent,
          isWindowsPhone = /(?:Windows Phone)/.test(ua),
          isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
          isAndroid = /(?:Android)/.test(ua),
          isFireFox = /(?:Firefox)/.test(ua),
          isChrome = /(?:Chrome|CriOS)/.test(ua),
          isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
          isPhone = /(?:iPhone)/.test(ua) && !isTablet,
          isPc = !isPhone && !isAndroid && !isSymbian;
      return {
          isTablet: isTablet,
          isPhone: isPhone,
          isAndroid: isAndroid,
          isPc: isPc
      };
    }();

    if(os.isAndroid || os.isPhone) {
        return 'phone';
    } else if(os.isTablet) {
        return 'pad';
    } else if(os.isPc) {
        return 'pc';
    }
  }

  //获取浏览器宽度
  getScreenWidth() {
    return document.body.clientWidth;
  }

  //获取页面中最大的 z-index
  getMaxZIndex() {
    return [...document.body.querySelectorAll('*')].reduce( (r, e) => Math.max(r, +window.getComputedStyle(e).zIndex || 0), 0) || 1;
  }

  /*
   * 向字符串指定位置插入新字符
   * source是原字符串，start是插入位置，newStr是要插入的字符
   */
  insertStr(source:string ,start:number, newStr:string) {
    return source.slice(0, start) + newStr + source.slice(start);
  }

  //获取url地址中参数的值
  getUrlQueryObj() {
    const search = location.search.replace(/^\?/, "");
    if (!search) {
      return {};
    }
    const obj = {};
    search.split("&").forEach(function(item) {
      const arr = item.split("=");
      obj[arr[0]] = arr[1];
    });
    return obj;
  }

  //获取url的hash地址
  getUrlHash() {
    let url = location.hash;
    let end = url.length;
    if(url.indexOf("?") > -1){
      end = url.indexOf("?");
    }
    url = url.substring(1,end);
    return url;
  }

  //给url添加页面时间戳
  urlTimeStamp() {
    let newUrl = '';
    let oldUrl = window.location.href;
    const tag = new Date().getTime();
    if (oldUrl.indexOf('?') == -1) {
      let position = oldUrl.indexOf('#');
      let str = '?timestamp=' + tag;
      newUrl = this.insertStr(oldUrl, position, str);
    } else if (oldUrl.indexOf('timestamp') == -1) {
      let position = oldUrl.indexOf('?');
      position = position + 1;
      let str = 'timestamp=' + tag + '&';
      newUrl = this.insertStr(oldUrl, position, str);
    } else {
      return false;
    }
    return {
      url: newUrl,
      tag: tag
    };
  }

  //返回页面顶部
  backPageTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  //滚动到指定区域的底部
  scrollToBottom(eleId: string) {
    let ele = window.document.getElementById(eleId);
    let y = ele.scrollHeight;
    ele.scrollTop = y;
  }

  //格式化金额
  formatMoney(str: any, num: any) {
    if(this.hasValue(num)){
      let newStr = this.formatFloat(parseFloat(str), num);
      newStr = newStr + "";
      return newStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }else{
      return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }

  /*
   * 计算小数保留多位小数
   * val是数值，pos是要保留几位
   */
  formatFloat(val: number, pos: number) {
    pos = pos || 0;
    if(pos == 0){
      return Math.round(val);
    }else{
      let num: string | number = Math.round(val*Math.pow(10, pos))/Math.pow(10, pos);
      num = num + "";
      let index = num.indexOf(".");
      let indexofNum = num.substr(index+1,num.length-1);
      let indexofNumLen = indexofNum.length;
      let zeroNum = "";
      if(index == -1){
        for(let i=0;i<pos;i++){
          zeroNum += "0";
        }
        num = num + "." + zeroNum;
      }else if(indexofNumLen == 1){
        for(let i=0;i<pos-1;i++){
          zeroNum += "0";
        }
        num = num + zeroNum;
      }
      return num;
    }
  }

  //字符串转base64
  stringToBase64(str:string) {
    // 对字符串进行编码
    let encode = encodeURI(str);
    // 对编码的字符串转化base64
    let base64 = btoa(encode);
    return base64;
  }

  //日期转字符串
  dateToStringFormat(date, format: string = 'yyyy-mm-dd HH:MM'): any {
    if(date === '') return date;
    const pad = (n: number): string => (n < 10 ? `0${n}` : n.toString());
    return format
      .replace('yyyy', date.getFullYear())
      .replace('mm', pad(date.getMonth() + 1))
      .replace('dd', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('MM', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()));
  }

  //根据开始日期获取一年期限的最后一天
  getYearEndDate(d:Date) {
    let dateTime: any = new Date(d.getTime());
    dateTime = dateTime.setFullYear(dateTime.getFullYear() + 1); //加一年
    dateTime = new Date(dateTime);
    dateTime = dateTime.setDate(dateTime.getDate() - 1);  //减一天
    return new Date(dateTime);
  }

  //增加小时
  getDateByAddHours(d: Date, h: number) {
    let dateTime: any = new Date(d.getTime());
    dateTime = dateTime.setHours(dateTime.getHours() + h);
    dateTime = new Date(dateTime);
    return dateTime;
  }

  //增加分钟
  getDateByAddMinutes(d: Date, m: number) {
    let dateTime: any = new Date(d.getTime());
    dateTime = dateTime.setMinutes(dateTime.getMinutes() + m);
    dateTime = new Date(dateTime);
    return dateTime;
  }

  //判断是否闰年
  isLeapYear(intYear) {
    if (intYear % 100 == 0) {
      if (intYear % 400 == 0) {
        return true;
      }
    } else {
      if ((intYear % 4) == 0) {
        return true;
      }
    }
    return false;
  }

  //获取浏览器类型
  getBrowserType() {
    let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    let isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    let isIE = userAgent.indexOf("compatible") > -1
            && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
    let isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
    let isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
    let isSafari = userAgent.indexOf("Safari") > -1
            && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
    let isChrome = userAgent.indexOf("Chrome") > -1
            && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

    if (isIE) {
      let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
      reIE.test(userAgent);
      let fIEVersion = parseFloat(RegExp["$1"]);
      if (fIEVersion == 7) {
        return "IE7";
      } else if (fIEVersion == 8) {
        return "IE8";
      } else if (fIEVersion == 9) {
        return "IE9";
      } else if (fIEVersion == 10) {
        return "IE10";
      } else if (fIEVersion == 11) {
        return "IE11";
      } else {
        return "0";
      }//IE版本过低
      return "IE";
    }
    if (isOpera) {
      return "Opera";
    }
    if (isEdge) {
      return "Edge";
    }
    if (isFF) {
      return "FF";
    }
    if (isSafari) {
      return "Safari";
    }
    if (isChrome) {
      return "Chrome";
    }
  }

  //验证
  validate(type: string, val: any) {
    const fnValidate = {
      Require: /.+/,
      Email: /\w+@\w+\.\w+/,
      Phone: /^1[3-8]\d{9}$/,
      Mobile: /^((\(\d{3}\))|(\d{3}\-))?(1(3\d|5\d|8\d|7\d|7[0678]))\d{8}?$/, ///1(3\d|5[0-3]|5[5-9]|8[6-9])\d{8}$/,  ///^((\(\d{3}\))|(\d{3}\-))?(13|15|18)\d{9}?$/,
      MobileList: /^(\d{11}){1,2}$/,///(^((\(\d{3}\))|(\d{3}\-))?(13|15|18)\d{9}\r?)?(^((\(\d{3}\))|(\d{3}\-))?(13|15|18)\d{9}\r?)$/,///^[\d\r\n]+$/,
      Url: /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
      IdCard: /^\d{15}(\d{2}[A-Za-z0-9])?$/,
      Currency: /^\d+(\.\d+)?$/,
      Number: /^\d+$/,
      Zip: /^[1-9]\d{5}$/,
      QQ: /^[1-9]\d{4,8}$/,
      IP: /^(([01]?[\d]{1,2})|(2[0-4][\d])|(25[0-5]))(\.(([01]?[\d]{1,2})|(2[0-4][\d])|(25[0-5]))){3}$/,
      IPPORT: /^(([01]?[\d]{1,2})|(2[0-4][\d])|(25[0-5]))(\.(([01]?[\d]{1,2})|(2[0-4][\d])|(25[0-5]))){3}(:\d{1,})?$/,
      Integer: /^[-\+]?\d{1,9}$/,
      PositiveInteger: /^[+]?\d{1,9}$/,	//正整数
      One: /^\d+(\.\d)?$/,    //精确到小数点后一位
      Double: /^[-\+]?\d+(\.\d+)?$/,  //精确到小数点后两位
      English: /^[A-Za-z]+$/,
      Chinese: /^[\u0391-\uFFE5]+$/,
      UnSafe: /^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/,
      PostCode: /^\d{6}$/,
      LessThanRowNum: /^(\d{1,11}\n?){1,1000}$/,
      Illegal: /^[^ %&,'$\x22][^%&'$\x22]*$/,
      Engine: /^[0-9a-zA-Z]+$/,
      CarNo: /^[\u4e00-\u9fa5]{1}[A-Za-z]{1}[A-Za-z_0-9]{5}$/,
      includeCN: /.*[\u4e00-\u9fa5]+.*$/,
      IllegalDiy: null
    };

    return fnValidate[type].test(val);
  }

  //验证身份证
  validateIdCard(value) {
    function checkDate (ID) {
      let year: any, month: any, day: any, tempDate: any;
      let length18Or15 = ID.length;
      if (length18Or15 === 18) {
        year = ID.substring(6, 10);
        month = ID.substring(10, 12);
        day = ID.substring(12, 14);
        // with parseInt, 05 will be 5
        tempDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return !(tempDate.getFullYear() !== parseInt(year) || tempDate.getMonth() !== parseInt(month) - 1 || tempDate.getDate() !== parseInt(day));
      } else if (length18Or15 === 15) {
        year = ID.substring(6, 8);
        month = ID.substring(8, 10);
        day = ID.substring(10, 12);
        // with parseInt, 05 will be 5
        tempDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        // .getYear() is not recommended for use any longer,
        // so here getFullYear() is used although it may seem not simple enough
        return !(('' + tempDate.getFullYear()).substring(2) !== (parseInt(year) + "") || tempDate.getMonth() !== parseInt(month) - 1 || tempDate.getDate() !== parseInt(day));
      } else {
        console.log('Unknown error!');
        // return
      }
    }
    let ID = '' + value;
    if (/^[1-9][0-9]{16}([0-9]|[xX])$/.test(ID)) {
      if (checkDate(ID)) {
        // turn ID to an array
        let arrID: any = ID.split('');
        // factors for 1st-17st ID digits
        let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
        // the check code for the 18th digit in the ID number
        let checkCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
        let sum = 0;
        // if the 18th digit is the letter X (or x), change it to be the digit 10
        if (arrID[17].toLowerCase() === 'x') {
          arrID[17] = 10;
        }
        // multiply first 17 ID digits by corresponding factor elements, and sum these results
        for (let i = 16; i >= 0; i--) {
          sum += arrID[i] * factor[i];
        }
        // let remainder = sum % 11
        return parseInt(arrID[17]) === checkCode[sum % 11];
      }
      return false;
    } else if (/^[1-9][0-9]{14}$/.test(ID)) {
      return checkDate(ID);
    } else {
      return false;
    }
  }
}
