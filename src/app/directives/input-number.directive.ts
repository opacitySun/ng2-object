import { Directive } from '@angular/core';
import { NgModel }   from '@angular/forms';
import { UtilsService } from '@app/services/utils.service';

@Directive({
  selector: '[appInputNumber]',
  host: {
    '(keypress)': 'onkeypress($event)',
    '(keyup)': 'onkeyup($event)'
  },
  inputs: ['maxValue']
})
export class InputNumberDirective {

  constructor(
    public control: NgModel,
    public utils:UtilsService
  ) { }

  public maxValue: number;

  onkeyup(event) {
    // let input = event.target;
    // if (input.value == "") {
    //   input.value = 0;
    //   this.control.viewToModelUpdate(0);
    // }
    // let newValue = parseInt(input.value);
    // if (newValue > this.maxValue) {
    //   input.value = this.maxValue;
    //   this.control.viewToModelUpdate(this.maxValue);
    // }
    // else
    // {
    //   input.value = newValue;
    //   this.control.viewToModelUpdate(newValue);
    // }
  }

  onkeypress(event) {
    // 判断是否为数字
    let inputStr = String.fromCharCode(event.keyCode);
    if (!parseInt(inputStr)) {
      return false;
    }
  }

}
