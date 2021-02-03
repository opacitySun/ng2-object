import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(public utils:UtilsService) { }

  //存储session的key标记
  private tag:string = "tag";

  //默认数据
  private defaultState:any = {
    token: '',
    //设备类型 0:PC 1:Pad 2:Mobile
    device: 2,
    //区域设置
    locale: 'zh',
    //屏幕可视区域宽度
    screenWidth: 0,
    //全局域名
    domain: 'http://st.tiancaibaoxian.com',
    //页面title
    title: 'Tesla',
    //公共头部标题
    headerTitle: '',
    //步骤 0:保费测算 1:投保 2:精准报价 3:提交支付
    step: 0,
    //投保流程提示框的显示隐藏
    tipsVisible: false,
    //loading是否显示
    loading: false,
    //是否第一次进入页面
    isFirstIn: true,
    //初始业务类型 0:试算 1:正式投保
    initBusinessType: 0,
    //业务类型 0:试算 1:正式投保
    businessType: 0,
    //tesla原始的唯一识别号
    originRn: null,
    //tesla唯一识别号
    teslaRn: null,
    //车辆信息
    carInfo: null,
    //车主
    owner: null,
    //投保人
    policy: null,
    //被保人
    insured: null,
    //保司列表
    companyList: null,
    //保司code
    companyCode: null,
    //险种列表
    risks: null,
    //总保费
    salePremium: null,
    //总保额
    sumInsured: null,
    //投保系统订单号
    businessOrderNo: null,
    //核保失败文字描述
    examineError: '',
    //支付失败文字描述
    payError: '',
    //商业险生效时间
    biStartTime: null,
    //交强险生效时间
    ciStartTime: null,
    //保单状态
    policyStatus: null,
    //客服中心电话
    serviceTelephone: '400-000-0000',
    //可回溯code
    traceableCode: null,
    //地区编码
    areaCode: ''
  };

  //全局数据
  public state:any = this.getSessionState();
  //rxjs的subject
  private subject = new Subject<any>();

  //获取session的state
  getSessionState() {
    const _this = this;
    if(!_this.utils.hasValue(_this.state)){
      return _this.defaultState;
    }
    const sessionKey = `${_this.tag}-${_this.state.businessOrderNo}`;
    let result = sessionStorage.getItem(sessionKey);
    if(_this.utils.hasValue(result)){
      return JSON.parse(result);
    }else{
      return _this.defaultState;
    }
  }

  //获取state
  getState():Observable<any> {
    return this.subject.asObservable();
  }

  //设置session
  setState(obj:any) {
    const _this = this;
    let sessionKey:string = '';
    if(_this.utils.hasValue(_this.state.businessOrderNo)){
      sessionKey = `${_this.tag}-${_this.state.businessOrderNo}`;
    }else if(_this.utils.hasValue(obj.businessOrderNo)){
      sessionKey = `${_this.tag}-${obj.businessOrderNo}`;
    }else{
      return false;
    }
    for(let i in obj){
      _this.state[i] = obj[i];
    }
    sessionStorage.setItem(sessionKey,JSON.stringify(_this.state));
    _this.subject.next(_this.state);
  }
}
