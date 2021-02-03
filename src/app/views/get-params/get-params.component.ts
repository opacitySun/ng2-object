import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from '@app/services/session.service';
import { UtilsService } from '@app/services/utils.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { InsureService } from '@app/api/insure.service';

@Component({
  selector: 'app-get-params',
  templateUrl: './get-params.component.html',
  styleUrls: ['./get-params.component.scss']
})
export class GetParamsComponent implements OnInit {

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public message: NzMessageService,
    public utils:UtilsService,
    public session:SessionService,
    public insureApi: InsureService
  ) { }

  ngOnInit(): void {
    const _this = this;
    _this.getPathParams();
  }

  //获取url参数
  getPathParams() {
    const _this = this;
    _this.activatedRoute.queryParams.subscribe(params => {
      _this.onPay(params);
    });
  }

  //请求支付
  async onPay(paramsObj) {
    const _this = this;
    let params = {
      ...paramsObj
    };
    let res = await _this.insureApi.pay(params);
    if(res.resultCode == '0000000'){
      if(_this.utils.hasValue(res.data.payUrl)){
        window.location.href = res.data.payUrl;
      }
    }else{
      _this.session.setState({
        payError: res.resultMessage
      });
      _this.router.navigate(['/layout/pay-fail']);
      // _this.message.create('error', res.resultMessage);
    }
  }

}
