import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SessionService } from '@app/services/session.service';
import { UtilsService } from '@app/services/utils.service';
import { UserService } from '@app/api/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { InsureService } from '@app/api/insure.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public message: NzMessageService,
    public userApi:UserService,
    public utils:UtilsService,
    public session:SessionService,
    public insureApi: InsureService
  ) { 
    const _this = this;
    //监听session中的state变化
    _this.subscription = _this.session.getState().subscribe(state => {
      window.document.title = state.title;
      if(state.loading){
        _this.loadingZIndex = _this.utils.getMaxZIndex() + 1;
      }
    });
  }

  //rxjs的订阅对象
  public subscription: Subscription;
  //全局state
  private state:any = this.session.getSessionState();
  //是否重载
  public rerender:boolean = false;
  //设备类型 0:PC 1:Pad 2:Mobile
  public device:any = this.state.device;
  //全局loading弹出框的层级
  public loadingZIndex:string | number = '1';
  //例外路径
  private exceptionPath: any = [
    '/layout/get-params',
    '/layout/verify-success',
    '/layout/pay-success',
    '/layout/pay-fail',
    '/layout/pay-type',
    '/layout/pay-timeout'
  ];

  //组件加载完成
  ngOnInit(): void {
    const _this = this;
    _this.pageInit();
  }

  ngAfterContentChecked() {
    
  }

  //dom加载完成的生命周期
  ngAfterViewInit() {
    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  //页面初始化
  pageInit() {
    const _this = this;
    _this.getPathParams(() => {
      _this.getToken(async () => {
        _this.session.setState({
          loading: false,
          title: '保险服务',
          headerTitle: '保险服务'
        });
        _this.comfirmDevice();
        _this.getResizeScreenWidth();
        // let teslaRn = _this.session.state.teslaRn;
        // if(!!teslaRn && teslaRn.indexOf("-I") > -1){
          await _this.getOrderData();
        // }
        _this.rerender = true;
      });
    });
  }

  //获取token
  getToken(callback) {
    const _this = this;
    let params = {
      grant_type: 'password',
      username: 'sale',
      password: 'h8946erdw6'
    };
    _this.userApi.getToken(params).then(res => {
      _this.session.setState({
        token: res.access_token
      });
      callback();
    }).catch(error => {
      console.log(error);
      setTimeout(() => {
        _this.pageInit();
      },5000);
    });
  }

  //获取url参数
  getPathParams(callback) {
    const _this = this;
    _this.activatedRoute.queryParams.subscribe(params => {
      let stateObj: any = {};
      let businessType: any = null;
      let hasRn: boolean = false;
      //rn号
      let teslaRn = params.teslaRn || _this.session.state.teslaRn;
      if(_this.utils.hasValue(teslaRn)) {
        hasRn = true;
        stateObj.teslaRn = teslaRn;
        let tag = teslaRn.substr(teslaRn.length-1,1);
        businessType = (tag == 'T')? 0 : 1;
        stateObj.initBusinessType = businessType;
        stateObj.businessType = businessType;
      }
      //业务流水号
      let flowNo = params.flowNo;
      if(_this.utils.hasValue(flowNo)) {
        stateObj.businessOrderNo = flowNo;
      }
      //错误信息
      let errorMsg = params.errorMsg;
      if(_this.utils.hasValue(errorMsg)) {
        if(_this.utils.hasValue(params.path)){
          if(params.path == '/layout/pay-fail'){
            stateObj.payError = errorMsg;
          }else{
            stateObj.examineError = errorMsg;
          }
        }
      }
      //设置本地缓存
      _this.session.setState(stateObj);
      //跳转地址
      let path = params.path;
      let pathParams = { ...params };
      delete pathParams.path;
      if(_this.utils.hasValue(path)){
        if(_this.utils.isEmptyObject(pathParams)){
          _this.router.navigate([path]);
        }else{
          _this.router.navigate([path],{queryParams: pathParams});
        }
      }else{
        let urlHash = _this.utils.getUrlHash();
        if(_this.exceptionPath.indexOf(urlHash) == -1){
          if(!hasRn){
            _this.message.create('warning', '缺少Rn号');
            return false;
          }
          if(_this.session.state.isFirstIn){
            //根据businessType判断跳到哪个流程
            if(businessType == 0){//试算
              _this.router.navigate(['/layout/insure-select']);
            }else{//正式投保
              _this.router.navigate(['/layout/info-confirm']);
            }
          }
        }
      }
      callback();
    });
  }

  //设置页面的字体尺寸基数
  setFontSize() {
    const _this = this;
    if(_this.device == 1){
      _this.utils.setPageBaseFontSize(1440);
    }else{
      _this.utils.setPageBaseFontSize(360);
    }
  }

  //实时获取屏幕宽度
  getResizeScreenWidth() {
    const _this = this;
    getWidth();
    window.onresize = () => {
      getWidth();
    }

    function getWidth() {
      let screenWidth = _this.utils.getScreenWidth();
      _this.session.setState({
        screenWidth: screenWidth
      });
    }
  }

  //确定设备类型
  comfirmDevice() {
    const _this = this;
    const deviceType = _this.utils.getDeviceType();
    switch(deviceType){
      case 'pc':
        _this.device = 0;
        break;
      case 'pad':
        _this.device = 1;
        break;
      case 'phone':
        _this.device = 2;
        break;
    }
    _this.session.setState({
      device: _this.device
    });
    // _this.device = _this.state.device;
    // if(_this.device == 1 || _this.device == 2){
    //   _this.setFontSize();
    // }
  }

  //关闭流程提示框
  onTipsClose() {
    const _this = this;
    _this.session.setState({
      tipsVisible: false
    });
  }

  //获取订单详情
  async getOrderData() {
    const _this = this;
    let businessOrderNo = _this.session.state.businessOrderNo;
    let params = {
      businessOrderNo: businessOrderNo
    };
    let res = await _this.insureApi.getOrderDetail(params);
    if(res.resultCode == '0000000'){
      let data = res.data;
      //保单信息
      if(_this.utils.hasValue(data.policyList) && data.policyList.length > 0){
        data.policyList.some(item => {
          //保单状态
          let policyStatus = item.policyStatus;
          if(_this.utils.hasValue(policyStatus)){
            _this.session.setState({
              policyStatus: policyStatus
            });
            if(policyStatus >= 3){
              _this.router.navigate(['/layout/pay-success']);
            }
          }
        });
      }
      //车辆信息
      if(_this.utils.hasValue(data.carInfo)){
        //是否超时
        let isTimeout = data.carInfo.payTimeOut;
        if(isTimeout == '1'){
          _this.router.navigate(['/layout/pay-timeout']);
        }
      }
    }else{
      // console.log(res.resultMessage);
    }
  }
}
