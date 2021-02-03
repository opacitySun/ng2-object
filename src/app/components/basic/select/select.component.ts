import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PickerService, PickerRef } from 'ng-zorro-antd-mobile';
import { UtilsService } from '@app/services/utils.service';
import { SessionService } from '@app/services/session.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {

  //加载父组件传过来的属性
  @Input() defaultValue:string | number;  
  @Input() options:any[];
  @Input() change:any;
  @Input() optionByParent:boolean;//是否让下拉选择项针对父级悬浮

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
    public picker: PickerService,
    public utils:UtilsService,
    public session:SessionService
  ) { }

  public data:any = {
    //设备类型 0:PC 1:Pad 2:Mobile
    device: this.session.state.device,
    eleId: 'select' + new Date().getTime(),
    active: false,
    value: '',
    oldVal: '',
    label: '--',
    options: null,
    optionsZIndex: 1,
    optionsPosition: 'absolute',
    optionsWidth: '100%',
    optionsLeft: '0',
    optionsTop: '37px',
    tabIndex:new Date().getTime(),
    optionByParent: true
  };

  ngOnInit(): void {
    const _this = this;
    let intervalId: any = setInterval(() => {
      if(!_this.utils.hasValue(_this.data.options)){
        _this.setDataByParent();
      }else{
        clearInterval(intervalId);
      }
    },1000);
  }

  ngDoCheck() {
    const _this = this;
    if(_this.data.value !== _this.data.oldVal){
      _this.data.oldVal = _this.data.value;
      _this.value = _this.data.value;
      if(_this.utils.hasValue(_this.data.options) && _this.data.options.length > 0){
        _this.data.options.some(item => {
          if(item.value == _this.data.value){
            _this.data.label = item.label;
          }
        });
      }
    }
  }

  //将父级带过来的数据赋给组件
  setDataByParent() {
    const _this = this;
    if(_this.utils.hasValue(_this.optionByParent)){
      _this.data.optionByParent = _this.optionByParent;
    }
    if(_this.utils.hasValue(_this.options)){
      _this.data.options = _this.options;
    }
    if(_this.utils.hasValue(_this.defaultValue)){
      _this.data.value = _this.defaultValue;
    }
    if(_this.utils.hasValue(_this.value)){
      _this.data.value = _this.value;
    }
    if(_this.utils.hasValue(_this.data.value)){
      if(_this.utils.hasValue(_this.data.options) && _this.data.options.length > 0){
        _this.data.options.some(item => {
          if(item.value == _this.data.value){
            _this.data.label = item.label;
          }
        });
      }
    }
  }

  //下拉框焦点选择
  selectFocus($event,isParent:boolean) {
    const _this = this;
    $event.stopPropagation();
    //判断是否是父级点击触发的
    if(isParent){
      _this.data.active = !_this.data.active;
    }else{
      _this.data.active = false;
    }
    if(_this.data.active == true){
      _this.changeOptionsZIndex();
      if(!_this.data.optionByParent){
        _this.setAppOptionsStyle($event);
      }
    }
  }

  //设置下拉菜单的悬浮样式
  setAppOptionsStyle($event) {
    const _this = this;
    let $dom = document.getElementById(_this.data.eleId);
    let width = $dom.clientWidth;
    let height = $dom.clientHeight;
    let top = $event.clientY - $event.offsetY + 37;
    if($event.target.offsetHeight < height){
      top = $event.clientY - $event.target.offsetTop + 35;
    }
    let left = $dom.offsetLeft;
    _this.data.optionsPosition = 'fixed';
    _this.data.optionsWidth = width + 'px';
    _this.data.optionsLeft = left + 'px';
    _this.data.optionsTop = top + 'px';
  }

  //更改下拉框选项的层级
  changeOptionsZIndex() {
    const _this = this;
    _this.data.optionsZIndex = _this.utils.getMaxZIndex() + 1;
  }

  //设置下拉框的值
  setValue(item:any) {
    const _this = this;
    _this.data.value = item.value;
    _this.data.label = item.label;
    _this.value = _this.data.value;
    _this.data.active = false;
  }

  //显示移动版下拉框
  showMobilePicker() {
    const _this = this;
    let val = _this.data.value;
    if(_this.utils.hasValue(val)){
      val = [val];
    }
    const ref: PickerRef = _this.picker.showPicker(
      { value: val, data: _this.data.options },
      result => {
        _this.data.value = result[0].value;
        _this.data.label = result[0].label;
      },
      cancel => {
        console.log('cancel');
      }
    );
  }
}
