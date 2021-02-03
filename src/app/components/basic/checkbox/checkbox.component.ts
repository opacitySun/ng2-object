import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { UtilsService } from '@app/services/utils.service';
import { SessionService } from '@app/services/session.service';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

  //加载父组件传过来的属性
  @Input() label:string;  

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
    public utils:UtilsService,
    public session:SessionService
  ) { }

  public data:any = {
    //设备类型 0:PC 1:Pad 2:Mobile
    device: this.session.state.device,
    checked: false,
    label: '',
    iconChecked: faCheck
  };

  ngOnInit(): void {
    const _this = this;
    _this.setDataByParent();
  }

  //将父级带过来的数据赋给组件
  setDataByParent() {
    const _this = this;
    if(_this.utils.hasValue(_this.label)){
      _this.data.label = _this.label;
    }
  }

  //改变选中状态
  checkChange() {
    const _this = this;
    _this.data.checked = !_this.data.checked;
    _this.checked = _this.data.checked;
  }

}
