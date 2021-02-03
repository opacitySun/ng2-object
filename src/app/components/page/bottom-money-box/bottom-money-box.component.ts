import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { UtilsService } from '@app/services/utils.service';
import { SessionService } from '@app/services/session.service';

@Component({
  selector: 'app-bottom-money-box',
  templateUrl: './bottom-money-box.component.html',
  styleUrls: ['./bottom-money-box.component.scss']
})
export class BottomMoneyBoxComponent implements OnInit {

  //加载父组件传过来的属性
  @Input() bi:string | number;
  @Input() ci:string | number;
  @Input() total:string | number;
  @Input() run:any;

  constructor(
    public router: Router,
    public utils:UtilsService,
    public session:SessionService
  ) { }

  public data:any = {
    //设备类型 0:PC 1:Pad 2:Mobile
    device: this.session.state.device,
    bi: '',
    ci: '',
    total: ''
  };

  ngOnInit(): void {
    const _this = this;
    _this.setDataByParent();
  }

  //将父级带过来的数据赋给组件
  setDataByParent() {
    const _this = this;
    if(_this.utils.hasValue(_this.bi)){
      _this.data.bi = _this.bi;
    }
    if(_this.utils.hasValue(_this.ci)){
      _this.data.ci = _this.ci;
    }
    if(_this.utils.hasValue(_this.total)){
      _this.data.total = _this.total;
    }
  }

  //方案保存
  onSave() {
    const _this = this;
    if(_this.utils.hasValue(_this.run)){
      _this.run();
    }
  }
}
