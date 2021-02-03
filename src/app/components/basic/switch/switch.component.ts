import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SessionService } from '@app/services/session.service';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {

  //通过get和set实现自定义的[(ngModel)]
  @Output() checkedChange = new EventEmitter();
  get checked(): boolean {
    return this.data.checked;
  }
  @Input('checked')
  set checked(value: boolean) {
    this.data.checked = value;
    this.checkedChange.emit(value);
  }

  constructor(
    public session:SessionService
  ) { }

  public data:any = {
    //设备类型 0:PC 1:Pad 2:Mobile
    device: this.session.state.device,
    checked: false
  };

  ngOnInit(): void {
  }

  //改变选中状态
  checkChange() {
    const _this = this;
    _this.data.checked = !_this.data.checked;
    _this.checked = _this.data.checked;
  }

}
