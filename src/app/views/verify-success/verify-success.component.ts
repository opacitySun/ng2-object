import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from '@app/services/utils.service';
import { SessionService } from '@app/services/session.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { $WebSocket, WebSocketSendMode } from 'angular2-websocket/angular2-websocket';
import { InsureService } from '@app/api/insure.service';

@Component({
  selector: 'app-verify-success',
  templateUrl: './verify-success.component.html',
  styleUrls: ['./verify-success.component.scss']
})
export class VerifySuccessComponent implements OnInit {

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public message: NzMessageService,
    public utils:UtilsService,
    public session:SessionService,
    public insureApi: InsureService
  ) { }

  public data:any = {
    //设备类型 0:PC 1:Pad 2:Mobile
    device: this.session.state.device,
    //地区编码
    areaCode: '',
    companyCode: '',
    companyName: '',
    totalMoney: '',
    phone: '',
    //验证码
    code: '',
    //二次验证码
    secondCode: '',
    //验证码输入框个数
    codeLength: 0,
    //是否已发送过验证码
    codeBeenSent: false,
    //验证码按钮数字
    codeBtnTextNum: 60,
    //验证码按钮文字
    codeBtnText: '重发验证码',
    //支付弹出框
    payModalVisible: false,
    //二次支付错误提示
    secondError: '',
    //商业险生效时间
    biStartTime: '',
    //交强险生效时间
    ciStartTime: '',
    //二维码地址
    codeUrl: null,
    //是否重新支付
    isRepay: false,
    //重新支付跳转地址
    repayUrl: null,
    //验证码弹出窗的错误信息
    payError: null,
    //是否存在验证码输入框
    hasVerifyCode: true,
    //验证码弹出窗的按钮文字
    payBtnText: '确定'
  };

  ngOnInit(): void {
    const _this = this;
    _this.utils.backPageTop();
    _this.session.setState({
      title: '核保成功',
      headerTitle: '保险服务'
    });
    _this.getPathParams();
  }

  //获取url参数
  getPathParams() {
    const _this = this;
    _this.activatedRoute.queryParams.subscribe(params => {
      let stateObj: any = {};
      if(_this.utils.hasValue(params.flowNo)){
        stateObj.businessOrderNo = params.flowNo;
      }
      if(_this.utils.hasValue(params.teslaRn)){
        stateObj.teslaRn = params.teslaRn;
      }
      _this.session.setState(stateObj);
      _this.getOrderData();
    });
  }

  //根据保司code获取保司名称
  getCompanyNameByCode(list, code) {
    const _this = this;
    let companyName = '';
    if(_this.utils.hasValue(list) && list.length > 0){
      list.some(item => {
        if(item.insurCode == code){
          companyName = item.insurName;
          return true;
        }
      });
    }
    return companyName;
  }

  async getCompanyList(companyCode) {
    const _this = this;
    let params = {
      teslaRn: _this.session.state.teslaRn,
      areaCode: _this.data.areaCode
    };
    let res = await _this.insureApi.getCompanyList(params);
    if(res.resultCode == '0000000'){
      _this.data.companyName = _this.getCompanyNameByCode(res.data, companyCode);
    }
  }

  //获取订单详情
  async getOrderData() {
    const _this = this;
    let businessOrderNo = _this.session.state.businessOrderNo;
    let params = {
      businessOrderNo: businessOrderNo
    };
    _this.session.setState({
      loading: true
    });
    let res = await _this.insureApi.getOrderDetail(params);
    _this.session.setState({
      loading: false
    });
    if(res.resultCode == '0000000'){
      let data = res.data;
      //保单信息
      if(_this.utils.hasValue(data.policyList) && data.policyList.length > 0){
        let totalMoney = 0;
        data.policyList.some(item => {
          let salePremium = item.salePremium;
          if(_this.utils.hasValue(salePremium)){
            totalMoney += parseFloat(salePremium);
          }
          if(item.policyType == 1){//交强
            _this.data.ciStartTime = item.startDate;
          }else{//商业
            _this.data.biStartTime = item.startDate;
          }
        });
        _this.data.totalMoney = '￥' + _this.utils.formatMoney(totalMoney + "", 2);
      }
      //车辆信息
      if(_this.utils.hasValue(data.carInfo)){
        let companyCode = data.carInfo.insurCode || _this.session.state.companyCode;
        _this.data.areaCode = data.carInfo.areaCode;
        _this.data.companyCode = companyCode;
        _this.getCompanyList(companyCode);
        //验证码长度
        let codeLength = data.carInfo.veriDigit;
        if(_this.utils.hasValue(codeLength)){
          _this.data.codeLength = parseInt(codeLength);
          if(_this.data.codeLength == 0 || _this.data.codeLength == 1){
            let payUrl = data.carInfo.payUrl;
            if(_this.utils.hasValue(payUrl)){
              _this.data.isRepay = true;
              _this.data.repayUrl = payUrl;
            }
          }
        }
      }
      //人员信息
      if(_this.utils.hasValue(data.personList) && data.personList.length > 0){
        data.personList.some(item => {
          if(item.utype == 'holder'){
            _this.data.phone = item.uphone || '';
            return true;
          }
        });
      }
    }else{
      _this.message.create('error', res.resultMessage);
    }
  }

  onCodeChanged(code: string) {
    const _this = this;
    if(code.length == _this.data.codeLength){
      code = code.toUpperCase();
    }
    _this.data.secondCode = code;
  }

  onCodeCompleted(code: string) {
    
  }

  //获取短信验证码
  async onGetCode() {
    const _this = this;
    if(_this.data.codeBeenSent){
      return false;
    }
    _this.session.setState({
      loading: true
    });
    let params = {
      businessOrderNo: _this.session.state.businessOrderNo,
      insurCode: _this.data.companyCode
    };
    let res = await _this.insureApi.getMsgCode(params);
    _this.session.setState({
      loading: false
    });
    if(res.resultCode != '0000000'){
      _this.message.create('error', res.resultMessage);
    }else{
      let callInterfaceFiag = res.data.callInterfaceFiag;
      if(_this.utils.hasValue(callInterfaceFiag)){
        if(callInterfaceFiag == 0){
          if(_this.data.codeLength == 2 && _this.data.companyCode == 'GPIC'){
            _this.data.hasVerifyCode = false;
            _this.data.payBtnText = '我已完成支付';
          }
          _this.data.payModalVisible = true;
        }else{
          if(_this.data.isRepay){
            if(_this.data.device == 0){//PC端
              _this.data.codeUrl = _this.data.repayUrl;
            }else{
              window.location.href = _this.data.repayUrl;
            }
          }else{
            let payUrl = res.data.payUrl;
            if(_this.utils.hasValue(payUrl)){
              if(_this.data.device == 0){//PC端
                _this.data.codeUrl = payUrl;
              }else{
                window.location.href = payUrl;
              }
            }
          }
        }
      }
      _this.data.codeBeenSent = true;
      _this.data.codeBtnTextNum = 60;
      _this.data.codeBtnText = `${_this.data.codeBtnTextNum}s后可重发验证码`;
      let intervalId = setInterval(() => {
        _this.data.codeBtnTextNum--;
        if(_this.data.codeBtnTextNum == 0){
          _this.data.codeBeenSent = false;
          _this.data.codeBtnText = '重发验证码';
          clearInterval(intervalId);
        }else{
          _this.data.codeBtnText = `${_this.data.codeBtnTextNum}s后可重发验证码`;
        }
      },1000);
    }
  }

  //创建websocket通信
  connectWebsocket() {
    const _this = this;
    if("WebSocket" in window){
      let url = "ws://127.0.0.1:7000";
      let ws = new $WebSocket(url);
      ws.onMessage(
        (msg: MessageEvent)=> {
          console.log("onMessage ", msg.data);
        },
        {autoApply: false}
      );
    }else{
      console.log("浏览器不支持WebSocket");
    }
  }

  async onPay() {
    const _this = this;
    if(_this.data.isRepay){
      if(_this.data.device == 0){//PC端
        _this.data.codeUrl = _this.data.repayUrl;
      }else{
        window.location.href = _this.data.repayUrl;
      }
    }else{
      if(_this.data.companyCode == 'PICC' && _this.data.codeLength == 0){//人保
        let payTypeUrl = `${_this.session.state.domain}/teslainsure/index.html?flowNo=${ _this.session.state.businessOrderNo}#/layout/pay-type`;
        if(_this.data.device == 0){//PC端
          _this.data.codeUrl = payTypeUrl;
        }else{
          window.location.href = payTypeUrl;
        }
      }else{
        _this.onGetCode();
      }
    }
  }

  //验证码弹出框确认按钮
  onPayModalConfirm() {
    const _this = this;
    if(!_this.utils.hasValue(_this.data.secondCode)){
      _this.data.secondError = '还未填写验证码';
      return false;
    }else{
      if(_this.data.secondCode.length < _this.data.codeLength){
        _this.data.secondError = '您的验证码位数不够';
        return false;
      }
    }
    _this.data.secondError = '';
    _this.onVerifyPay();
  }

  //验证验证码
  async onVerifyPay() {
    const _this = this;
    _this.session.setState({
      loading: true
    });
    let params = {
      businessOrderNo: _this.session.state.businessOrderNo,
      insurCode: _this.data.companyCode,
      checkCode: _this.data.secondCode
    };
    let res = await _this.insureApi.verifyPay(params);
    _this.session.setState({
      loading: false
    });
    if(res.resultCode == '0000000'){
      if(_this.data.companyCode == 'PICC'){//人保
        let payTypeUrl = `${_this.session.state.domain}/teslainsure/index.html?flowNo=${ _this.session.state.businessOrderNo}&checkCode=${_this.data.secondCode}#/layout/pay-type`;
        if(_this.data.device == 0){//PC端
          _this.data.codeUrl = payTypeUrl;
        }else{
          window.location.href = payTypeUrl;
        }
      }else{
        if(_this.utils.hasValue(res.data.payUrl)){
          if(_this.data.device == 0){//PC端
            _this.data.codeUrl = res.data.payUrl;
          }else{
            window.location.href = res.data.payUrl;
          }
        }else{
          if(_this.utils.hasValue(res.data.electronicPolicySigningH5)){
            if(_this.data.device == 0){//PC端
              _this.data.codeUrl = res.data.electronicPolicySigningH5;
            }else{
              window.location.href = res.data.electronicPolicySigningH5;
            }
          }
        }
      }
    }else{
      _this.data.payError = res.resultMessage;
      // _this.session.setState({
      //   payError: res.resultMessage
      // });
      // _this.router.navigate(['/layout/pay-fail']);
    }
  }

}
