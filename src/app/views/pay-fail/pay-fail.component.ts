import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '@app/services/utils.service';
import { SessionService } from '@app/services/session.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pay-fail',
  templateUrl: './pay-fail.component.html',
  styleUrls: ['./pay-fail.component.scss']
})
export class PayFailComponent implements OnInit {

  constructor(
    public router: Router,
    public utils:UtilsService,
    public session:SessionService
  ) { }

  public data:any = {
    //设备类型 0:PC 1:Pad 2:Mobile
    device: this.session.state.device,
    errorVisible: false,
    errorText: '',
    icon1: faTimes,
  };

  ngOnInit(): void {
    const _this = this;
    _this.utils.backPageTop();
    _this.session.setState({
      title: '支付失败',
      headerTitle: '保险服务'
    });
    _this.data.errorText = _this.session.state.payError;
  }

  onPay() {
    const _this = this;
    _this.router.navigate(['/layout/verify-success']);
  }

}
