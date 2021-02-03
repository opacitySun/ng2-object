import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from '@app/services/utils.service';
import { SessionService } from '@app/services/session.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { InsureService } from '@app/api/insure.service';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pay-type',
  templateUrl: './pay-type.component.html',
  styleUrls: ['./pay-type.component.scss']
})
export class PayTypeComponent implements OnInit {

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
    totalMoney: '',
    icon1: faCheckCircle,
    companyCode: '',
    //1：微信支付 2：支付宝
    payType: 1,
    //验证码
    checkCode: '',
    //二维码地址
    codeUrl: null,
  };

  ngOnInit(): void {
    const _this = this;
    _this.utils.backPageTop();
    _this.session.setState({
      title: '支付',
      headerTitle: '保险服务'
    });
    _this.getPathParams();
  }

  //获取url参数
  getPathParams() {
    const _this = this;
    let urlParams: any = _this.utils.getUrlQueryObj();
    let stateObj: any = {};
    //rn号
    let teslaRn = urlParams.teslaRn;
    if(_this.utils.hasValue(teslaRn)) {
      stateObj.teslaRn = teslaRn;
    }
    //业务流水号
    let flowNo = urlParams.flowNo;
    if(_this.utils.hasValue(flowNo)) {
      stateObj.businessOrderNo = flowNo;
    }
    _this.session.setState(stateObj);
    //验证码
    let checkCode = urlParams.checkCode;
    if(_this.utils.hasValue(checkCode)) {
      _this.data.checkCode = checkCode;
    }
    _this.getOrderData();
    // _this.activatedRoute.queryParams.subscribe(params => {
    //   let stateObj: any = {};
    //   if(_this.utils.hasValue(params.flowNo)){
    //     stateObj.businessOrderNo = params.flowNo;
    //   }
    //   if(_this.utils.hasValue(params.teslaRn)){
    //     stateObj.teslaRn = params.teslaRn;
    //   }
    //   if(_this.utils.hasValue(params.checkCode)){
    //     _this.data.checkCode = params.checkCode;
    //   }
    //   _this.session.setState(stateObj);
    //   _this.getOrderData();
    // });
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
        });
        _this.data.totalMoney = '￥' + _this.utils.formatMoney(totalMoney + "", 2);
      }
      //车辆信息
      if(_this.utils.hasValue(data.carInfo)){
        let companyCode = data.carInfo.insurCode;
        _this.data.companyCode = companyCode;
      }
    }else{
      _this.message.create('error', res.resultMessage);
    }
  }

  async onPay() {
    const _this = this;
    _this.session.setState({
      loading: true
    });
    let params = {
      businessOrderNo: _this.session.state.businessOrderNo,
      insureCode: _this.data.companyCode,
      checkCode: _this.data.checkCode,
      payWay: "0" + _this.data.payType
    };
    let res = await _this.insureApi.pay(params);
    _this.session.setState({
      loading: false
    });
    if(res.resultCode == '0000000'){
      let url = '';
      if(_this.utils.hasValue(res.data.payUrl)){
        url = res.data.payUrl;
      }else{
        if(_this.utils.hasValue(res.data.electronicPolicySigningH5)){
          url = res.data.electronicPolicySigningH5;
        }
      }
      if(_this.utils.hasValue(url)){
        if(_this.data.device == 0){//PC端
          _this.data.codeUrl = url;
        }else{
          window.location.href = url;
        }
      }
    }else{
      _this.session.setState({
        payError: res.resultMessage
      });
      _this.router.navigate(['/layout/pay-fail']);
    }
  }

}
