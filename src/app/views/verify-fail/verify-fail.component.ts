import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from '@app/services/utils.service';
import { SessionService } from '@app/services/session.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { faTimes, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-verify-fail',
  templateUrl: './verify-fail.component.html',
  styleUrls: ['./verify-fail.component.scss']
})
export class VerifyFailComponent implements OnInit {

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
    serviceTelephone: this.session.state.serviceTelephone,
    icon1: faTimes,
    icon2: faPhoneAlt,
    errorVisible: false,
    errorText: ''
  };

  ngOnInit(): void {
    const _this = this;
    _this.utils.backPageTop();
    _this.getPathParams();
    _this.session.setState({
      title: '核保失败',
      headerTitle: '保险服务'
    });
    _this.data.errorText = _this.session.state.examineError;
    console.log(_this.data.errorText);
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

  //返回账户
  goAccount() {
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
