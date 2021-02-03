import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from '@app/services/utils.service';
import { SessionService } from '@app/services/session.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-pay-success',
  templateUrl: './pay-success.component.html',
  styleUrls: ['./pay-success.component.scss']
})
export class PaySuccessComponent implements OnInit {

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public message: NzMessageService,
    public utils:UtilsService,
    public session:SessionService
  ) { }

  public data:any = {
    //设备类型 0:PC 1:Pad 2:Mobile
    device: this.session.state.device,
    teslaRn: this.session.state.teslaRn,
    serviceTelephone: this.session.state.serviceTelephone,
    topOffset: 0,
    bottomOffset: 1,
  };

  ngOnInit(): void {
    const _this = this;
    _this.utils.backPageTop();
    _this.getPathParams();
    _this.session.setState({
      title: '支付成功',
      headerTitle: '保险服务'
    });
  }

  ngDoCheck() {
    const _this = this;
    let screenWidth = _this.session.state.screenWidth;
    if(screenWidth < 900){
      _this.data.topOffset = 1;
      _this.data.bottomOffset = 0;
    }else{
      _this.data.topOffset = 0;
      _this.data.bottomOffset = 1;
    }
  }

  //获取url参数
  getPathParams() {
    const _this = this;
    let urlParams: any = _this.utils.getUrlQueryObj();
    //rn号
    let teslaRn = urlParams.teslaRn;
    if(_this.utils.hasValue(teslaRn)) {
      _this.session.setState({
        teslaRn: teslaRn
      });
    }
    _this.activatedRoute.queryParams.subscribe(params => {
      let stateObj: any = {};
      if(_this.utils.hasValue(params.teslaRn)){
        stateObj.teslaRn = params.teslaRn;
      }
      _this.session.setState(stateObj);
    });
  }

  goHome() {
    const _this = this;
    let teslaRn = _this.data.teslaRn;
    if(!!teslaRn){
      teslaRn = teslaRn.replace("-T","");
      teslaRn = teslaRn.replace("-I","");
    }
    _this.session.setState({
      loading: true
    });
    window.location.href = `https://www.tesla.cn/teslaaccount/profile?rn=${teslaRn}`;
  }

}
