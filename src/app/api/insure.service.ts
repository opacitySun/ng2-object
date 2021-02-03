import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { AxiosConfigService } from '@app/services/axios-config.service';
import { SessionService } from '@app/services/session.service';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class InsureService {

  constructor(
    public http:AxiosConfigService,
    public session:SessionService
  ) {
    const _this = this;
    //监听session中的state变化
    _this.subscription = _this.session.getState().subscribe(state => {
      _this.token = state.token;
    });
  }

  public subscription: Subscription;
  private request:any = this.http.axiosHttp;
  private token:string = this.session.state.token;
  private prePath:string = '/signup/receive';

  //获取用户信息
  getUserInfo(params) {
    return this.request({
      url: `${this.prePath}?access_token=${this.token}&node=INS001`,
      method: 'post',
      configType: 'JSON',
      params
    })
  }

  //获取测算的险种列表
  getRisksByCalculation(params) {
    return this.request({
      url: `${this.prePath}?access_token=${this.token}&node=INS002`,
      method: 'post',
      configType: 'JSON',
      params
    })
  }

  //获取基本信息
  getBasicInfo(params) {
    return this.request({
      url: `${this.prePath}?access_token=${this.token}&node=INS007`,
      method: 'post',
      configType: 'JSON',
      params
    })
  }

  //获取全部险种
  getAllRisks(params) {
    // return axios.get('assets/json/risk.json');
    return this.request({
      url: `${this.prePath}?access_token=${this.token}&node=INS022`,
      method: 'post',
      configType: 'JSON',
      params
    })
  }

  //获取险种说明
  getRisksDesc() {
    return axios.get('assets/json/risk-desc.json');
  }

  //获取民族列表
  getNations() {
    return axios.get('assets/json/nation.json');
  }

  //获取保司列表
  getCompanyList(params) {
    return this.request({
      url: `${this.prePath}?access_token=${this.token}&node=INS008`,
      method: 'post',
      configType: 'JSON',
      params
    })
  }

  //试算方案结果保存
  saveCalculation(params) {
    return this.request({
      url: `${this.prePath}?access_token=${this.token}&node=INS003`,
      method: 'post',
      configType: 'JSON',
      params
    })
  }

  //正式投保时获取已有方案列表
  getPlan(params) {
    return this.request({
      url: `${this.prePath}?access_token=${this.token}&node=INS009`,
      method: 'post',
      configType: 'JSON',
      params
    })
  }

  //获取特约条款
  getSpecial(params) {
    return this.request({
      url: `${this.prePath}?access_token=${this.token}&node=INS010`,
      method: 'post',
      configType: 'JSON',
      params
    })
  }

  //报价
  quote(params) {
    return this.request({
      url: `${this.prePath}?access_token=${this.token}&node=INS011`,
      method: 'post',
      configType: 'JSON',
      params
    })
  }

  //核保
  examine(params) {
    return this.request({
      url: `${this.prePath}?access_token=${this.token}&node=INS013`,
      method: 'post',
      configType: 'JSON',
      params
    })
  }

  //获取订单详情
  getOrderDetail(params) {
    return this.request({
      url: `${this.prePath}?access_token=${this.token}&node=INS015`,
      method: 'post',
      configType: 'JSON',
      params
    })
  }

  //获取短信验证码
  getMsgCode(params) {
    return this.request({
      url: `${this.prePath}?access_token=${this.token}&node=INS017`,
      method: 'post',
      configType: 'JSON',
      params
    })
  }

  //支付
  pay(params) {
    return this.request({
      url: `${this.prePath}?access_token=${this.token}&node=INS014`,
      method: 'post',
      configType: 'JSON',
      params
    })
  }

  //验证验证码
  verifyPay(params) {
    return this.request({
      url: `${this.prePath}?access_token=${this.token}&node=INS018`,
      method: 'post',
      configType: 'JSON',
      params
    })
  }

  //获取条款说明
  getClauseHTML(type) {
    return axios.get(`assets/file/article${type}.html`);
  }
}
