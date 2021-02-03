import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilsService } from '@app/services/utils.service';
import { SessionService } from '@app/services/session.service';
import { InsureService } from '@app/api/insure.service';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {

  //加载父组件传过来的属性
  @Input() isWhole:boolean = false;
  @Input() rightInfoFill:boolean = false;
  @Input() hasVin:boolean = false;

  //通过get和set实现自定义的[(ngModel)]
  @Output() propsChange = new EventEmitter();
  get props(): any {
    return this.data.carInfo;
  }
  @Input('props')
  set props(value: any) {
    this.data.carInfo = value;
    this.propsChange.emit(value);
  }

  constructor(
    public utils:UtilsService,
    public session:SessionService,
    public insureApi: InsureService
  ) { }

  public data:any = {
    //设备类型 0:PC 1:Pad 2:Mobile
    device: this.session.state.device,
    teslaRn: this.session.state.teslaRn,
    businessType: this.session.state.businessType,
    carInfo: {
      model: '',
      vinNo: '',
      engineNo: '',
      imgSrc: '',
      price: '',
      isNew: false,
      carNo: '',
      city: '北京'
    },
  };

  ngOnInit(): void {
    const _this = this;
  }

  ngDoCheck() {
    const _this = this;
    _this.props = _this.utils.deepClone(_this.data.carInfo);
  }
}
