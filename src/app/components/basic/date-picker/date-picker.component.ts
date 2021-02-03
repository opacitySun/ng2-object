import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilsService } from '@app/services/utils.service';
import { SessionService } from '@app/services/session.service';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {

  //加载父组件传过来的属性
  @Input() placeholder:string;
  @Input() disabled:boolean;

  //通过get和set实现自定义的[(ngModel)]
  @Output() valueChange = new EventEmitter();
  get value(): string | number {
    return this.data.value;
  }
  @Input('value')
  set value(value: string | number) {
    this.data.value = value;
    this.valueChange.emit(value);
  }

  constructor(
    public utils:UtilsService,
    public session:SessionService
  ) { }

  public data:any = {
    //设备类型 0:PC 1:Pad 2:Mobile
    device: this.session.state.device,
    value: '',
    date: '',
    placeholder: '请输入',
    disabled: false
  };

  ngOnInit(): void {
    const _this = this;
    _this.setDataByParent();
  }

  ngDoCheck() {
    const _this = this;
    _this.setDataByParent();
  }

  //将父级带过来的数据赋给组件
  setDataByParent() {
    const _this = this;
    if(_this.utils.hasValue(_this.placeholder)){
      _this.data.placeholder = _this.placeholder;
    }
    if(_this.utils.hasValue(_this.disabled)){
      _this.data.disabled = _this.disabled;
      if(_this.disabled){
        _this.data.placeholder = "";
      }
    }
  }

  onDateChange(val: any) {
    const _this = this;
    let dateVal = _this.utils.dateToStringFormat(val, 'yyyy/mm/dd');
    _this.data.value = dateVal;
    _this.value = val.getTime();
  }

  onMobileDateChange(val: any) {
    const _this = this;
    let dateVal = _this.utils.dateToStringFormat(val, 'yyyy/mm/dd');
    _this.data.date = val;
    _this.data.value = dateVal;
    _this.value = val.getTime();
  }

}
