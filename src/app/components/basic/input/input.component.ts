import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilsService } from '@app/services/utils.service';
import { SessionService } from '@app/services/session.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  //加载父组件传过来的属性
  @Input() type:string;
  @Input() placeholder:string;
  @Input() disabled:boolean;
  @Input() maxlength:number | string;
  @Input() isMoney:boolean;
  @Input() inputType:string;

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
    //浏览器类型
    browserType: 'Chrome',
    //第一次赋值
    isFirst: true,
    type: 'text',
    placeholder: '请输入',
    value: '',
    disabled: false,
    isMoney: false,
    pattern: ''
  };

  ngOnInit(): void {
    const _this = this;
    _this.data.browserType = _this.utils.getBrowserType();
    _this.setDataByParent();
  }

  ngDoCheck() {
    const _this = this;
    // if(_this.data.isFirst){
      _this.setDataByParent();
    // }
  }

  //将父级带过来的数据赋给组件
  setDataByParent() {
    const _this = this;
    if(_this.utils.hasValue(_this.type)){
      _this.data.type = _this.type;
    }
    if(_this.utils.hasValue(_this.placeholder)){
      _this.data.placeholder = _this.placeholder;
    }
    if(_this.utils.hasValue(_this.disabled)){
      _this.data.disabled = _this.disabled;
      if(_this.disabled){
        _this.data.placeholder = "";
      }
    }
    if(_this.utils.hasValue(_this.isMoney)){
      _this.data.isMoney = _this.isMoney;
    }
    if(_this.utils.hasValue(_this.inputType)){
      if(_this.inputType == 'number'){
        // 判断是否为数字
        _this.data.pattern = '^[0-9]{1,11}$';
      }
    }
    _this.data.isFirst = false;
  }

  //监听输入
  onKey(event) {
    const _this = this;
    let val = event.target.value;
    let keyCode = event.keyCode;
    if(_this.utils.hasValue(_this.inputType) && event.keyCode !== 8){
      if(_this.inputType == 'number'){
        // 判断是否为数字
        if(!((keyCode >= 48 && keyCode <= 57) || 
        (keyCode >= 96 && keyCode <= 105) || 
        (event.ctrlKey && keyCode == 65) || 
        (event.ctrlKey && keyCode == 67) || 
        (event.ctrlKey && keyCode == 86) || 
        (event.ctrlKey && keyCode == 88))){
          return false;
        }
        // let reg = /^[0-9]+$/g;
        // if (!reg.test(_val)) {
        //   return false;
        // }
      }
      if(_this.inputType == 'idNo'){
        // 判断是否为数字和字母
        let reg = /^[0-9xX]+/g;
        if (!(reg.test(event.key) || 
        (event.ctrlKey && keyCode == 65) || 
        (event.ctrlKey && keyCode == 67) || 
        (event.ctrlKey && keyCode == 86) || 
        (event.ctrlKey && keyCode == 88))){
          return false;
        }
      }
    }
    // if(_this.utils.hasValue(_this.maxlength) && 
    // !(event.keyCode == 8 || 
    // (event.ctrlKey && keyCode == 65) || 
    // (event.ctrlKey && keyCode == 67) || 
    // (event.ctrlKey && keyCode == 86) || 
    // (event.ctrlKey && keyCode == 88))){
    //   if(val.length >= _this.maxlength){
    //     return false;
    //   }
    // }
    _this.data.value = val;
  }

  onKeyUp(event) {
    const _this = this;
    let val = event.target.value;
    // if(_this.utils.hasValue(_this.inputType)){
    //   //身份证
    //   if(_this.inputType == 'idNo'){
    //     val = val.toUpperCase();
    //   }
    //   _this.data.value = val;
    // }
    _this.value = val;
  }

  onInput(event) {
    const _this = this;
    let val = event.target.value;
    if(_this.utils.hasValue(_this.inputType) && event.keyCode !== 8){
      if(_this.inputType == 'number'){
        // 判断是否为数字
        let reg = /[^0-9]/ig;
        const newVal = val.replace(reg,"");
        _this.data.value = newVal;
      }
    }
    // if(_this.utils.hasValue(_this.maxlength) && event.keyCode !== 8){
    //   if(val.length > _this.maxlength){
    //     _this.data.value = _this.data.value.replace(event.data,"");
    //   }
    // }
    // _this.data.value = val;
    // _this.value = val;
    console.log(_this.data.value);
  }


  onModelChange(val) {
    const _this = this;
    let newVal: any = '';
    if(_this.utils.hasValue(_this.inputType)){
      if(_this.inputType == 'number'){
        // 判断是否为数字
        let reg = /[^0-9]/ig;
        newVal = val.replace(reg,"");
      }
    }
    _this.data.value = newVal;
  }

  //验证中文输入法
  validateZhVal(event) {
    const _this = this;
    let val: any = event.target.value;
    if(_this.utils.hasValue(_this.inputType)){
      if(_this.inputType == 'number'){
        // 判断是否为数字
        let reg = /[^0-9]/ig;
        val = val.replace(reg,"");
      }
      if(_this.inputType == 'idNo'){
        // 判断是否为数字和字母的组合
        let reg = /[^A-Za-z0-9]+$/g;
        val = val.replace(reg,"");
      }
    }
    // if(_this.utils.hasValue(_this.maxlength)){
    //   if(val.length > _this.maxlength){
    //     val = val.substring(0, _this.maxlength);
    //   }
    // }
    event.target.value = val;
  }

  //监听粘贴操作
  onPaste(event) {
    const _this = this;
    let clipboardData = event.clipboardData || (<any>window).clipboardData;
    let val = clipboardData.getData('text');
    if(_this.utils.hasValue(_this.inputType)){
      if(_this.inputType == 'number'){
        // 判断是否为数字
        let reg = /[^0-9]/g;
        val = val.replace(reg,"");
      }
      if(_this.inputType == 'idNo'){
        // 判断是否为数字和字母的组合
        let reg = /[^A-Za-z0-9]+$/g;
        val = val.replace(reg,"");
      }
    }
    clipboardData.setData('text',val);
  }
  
}
