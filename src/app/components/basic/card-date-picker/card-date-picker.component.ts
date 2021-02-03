import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from '@app/services/utils.service';
import { SessionService } from '@app/services/session.service';

@Component({
  selector: 'app-card-date-picker',
  templateUrl: './card-date-picker.component.html',
  styleUrls: ['./card-date-picker.component.scss']
})
export class CardDatePickerComponent implements OnInit {

  //加载父组件传过来的属性
  @Input() home:any;
  @Input() valueChange:any;
  @Input() panelChange:any;

  constructor(
    public utils:UtilsService,
    public session:SessionService
  ) { }

  public data:any = {
    //设备类型 0:PC 1:Pad 2:Mobile
    device: this.session.state.device,
    state: {
      show: true,
      date: new Date(),
      pickTime: false,
      type: 'one',
      rowSize: 'normal',
      infinite: true,
      enterDirection: 'vertical',
      onSelect: undefined,
      showShortcut: false,
      minDate: new Date(new Date().getTime() - 5184000000),
      maxDate: new Date(new Date().getTime() + 31536000000)
    }
  }

  ngOnInit(): void {
    const _this = this;
    _this.data.state = {
      ..._this.data.state,
      show: true
    };
  }

  onValueChange(value: Date){
    const _this = this;
    if(_this.utils.hasValue(_this.valueChange)){
      _this.valueChange(value);
    }
  }

  onPanelChange(change: { date: Date; mode: string }){
    const _this = this;
    if(_this.utils.hasValue(_this.panelChange)){
      _this.panelChange(change);
    }
  }

  triggerCancel() {
    const _this = this;
    let home = _this.home;
    home.data.biCardDate = false;
    home.data.ciCardDate = false;
  }

  triggerConfirm(value) {
    const _this = this;
    const { startDate, endDate } = value;
    _this.data.state = {
      ..._this.data.state,
      ...{ startDate, endDate },
      date: startDate
    };
    if(_this.utils.hasValue(_this.valueChange)){
      _this.valueChange(startDate);
    }
    _this.triggerCancel();
  }

  triggerSelectHasDisableDate(dates) {
    console.warn('onSelectHasDisableDate', dates);
  }

}
