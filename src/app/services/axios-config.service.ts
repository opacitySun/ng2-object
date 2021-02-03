import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import axios from 'axios';
import * as JsEncryptModule from 'jsencrypt';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SessionService } from './session.service';
import { UtilsService } from './utils.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AxiosConfigService {

  constructor(
    public message: NzMessageService,
    public session:SessionService,
    public utils:UtilsService
  ) { 
    //request 拦截器
    axios.interceptors.request.use(
      config => {
        return config;
      },
      error => {
        let _this = this;
        _this.session.setState({
          loading: false
        });
        if(error.message.indexOf('timeout') != -1){
          _this.message.create('error', '服务请求超时，请您稍后再试！');
        }else{
          _this.message.create('error', '连接服务器失败');
        }
        return Promise.reject(error);
      }
    );
    //response 拦截器
    axios.interceptors.response.use(
      response => {
        let _this = this;        
        if(_this.utils.isArray(response)){
          return response;
        }else{
          // if(typeof(response.data) === 'string'){
          //   response.data = JSON.parse(_this.getRSADecryptStr(response.data));
          // }
          return response.data;
        }
      },
      error => {
        let _this = this;
        _this.session.setState({
          loading: false
        });
        if(error.message.indexOf('timeout') != -1){
          _this.message.create('error', '服务请求超时，请您稍后再试！');
        }else{
          _this.message.create('error', '连接服务器失败');
        }
        return Promise.reject(error);
      }
    );
  }

  private http:any;
  private apiPrefix:string = environment.production ? '' : '/api';
  private path:string = environment.production ? this.session.state.domain : 'http://' + window.location.host;
  private timeout:number = 1000 * 30;
  private baseURL:string = this.path + this.apiPrefix;
  private defaultContentType:string = 'application/json;charset=utf-8';
  private responseType:string = 'json';
  private axiosLoading:boolean = false;
  private auth:string = '99999999';
  
  axiosFn({url,params,contentType,method,configType}) {
    let _this = this;
    if(!!_this.http){
      _this = _this.http;
    }
    let axiosSetting:any = {
      method:method,
      url:url,
      responseType:_this.responseType,
      baseURL:_this.baseURL,
      timeout:_this.timeout,
      headers:{
        'Content-Type': contentType || _this.defaultContentType,
        'Authorization': "Basic " + _this.utils.stringToBase64(_this.auth)
      }
    };
    if(method === 'post' || method === 'POST'){
      axiosSetting.data = params;
    }else{
      axiosSetting.params = params;
    }
    return axios(axiosSetting);
  }

  axiosHttp({url,params,method = "POST",configType = ""}) {
    let _this = this;
    if(!!_this.http){
      _this = _this.http;
    }
    let newParams = '';
    let contentType = '';
    if(configType === 'JSON'){
      //参数RSA加密
      // params = _this.getRSAStr(JSON.stringify(params));
      // params = JSON.parse(_this.getRSADecryptStr(params));
      newParams = params;
      contentType = 'application/json;charset=utf-8';
    }else{
      newParams = '';
      Object.keys(params).forEach(key => {
        newParams += key + '=' + params[key] + '&'
      })
      newParams = newParams.substring(0,newParams.length-1);
      contentType = 'application/x-www-form-urlencoded;charset=utf-8';
    }
    return _this.axiosFn({
      url: url,
      method: method,
      params: newParams,
      configType: configType,
      contentType: contentType
    });
  }
  
  rxHttp({url,params,method = "POST",configType = ""}) {
    let _this = this;
    if(!!_this.http){
      _this = _this.http;
    }
    return new Observable((observer) => {
      _this.axiosFn({
        url: url,
        method: method,
        params: params,
        configType: configType,
        contentType: "application/json;charset=utf-8"
      }).then(response => {
        observer.next(response);
      }).catch(function (error) {
        observer.next(error);
      })
    });
  }

  //获取RSA加密字符串
  getRSAStr(str: string) {
    let publicKey = '';
    //自定义的加密串
    let privateStr = "";
    let encrypt = new JsEncryptModule.JSEncrypt();
    encrypt.setPublicKey(publicKey);
    let signature = encrypt.encrypt(privateStr + str);
    return signature;
  }

  //RSA解密字符串
  getRSADecryptStr(str: string) {
    let privateKey = '';
    let encrypt = new JsEncryptModule.JSEncrypt();
    encrypt.setPrivateKey(privateKey);
    return encrypt.decrypt(str.trim());
  }
}
