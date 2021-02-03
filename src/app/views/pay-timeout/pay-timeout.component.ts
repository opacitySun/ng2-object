import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from '@app/services/utils.service';
import { SessionService } from '@app/services/session.service';
import { faExclamation, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pay-timeout',
  templateUrl: './pay-timeout.component.html',
  styleUrls: ['./pay-timeout.component.scss']
})
export class PayTimeoutComponent implements OnInit {

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public utils:UtilsService,
    public session:SessionService
  ) { }

  public data:any = {
    //设备类型 0:PC 1:Pad 2:Mobile
    device: this.session.state.device,
    serviceTelephone: this.session.state.serviceTelephone,
    icon1: faExclamation,
    icon2: faPhoneAlt
  };

  ngOnInit(): void {
    const _this = this;
    _this.utils.backPageTop();
    _this.session.setState({
      title: '支付超时',
      headerTitle: '保险服务'
    });
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
    });
  }

  //重新报价
  onQuote() {
    const _this = this;
    _this.router.navigate(['/layout/info-confirm']);
  }

}
