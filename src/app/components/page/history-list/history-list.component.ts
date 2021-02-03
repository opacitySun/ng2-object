import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from '@app/services/utils.service';
import { SessionService } from '@app/services/session.service';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnInit {

  //加载父组件传过来的属性
  @Input() home:any;
  @Input() list:any;
  @Input() run:any;

  constructor(
    public utils:UtilsService,
    public session:SessionService
  ) { }

  public data:any = {
    //设备类型 0:PC 1:Pad 2:Mobile
    device: this.session.state.device,
    list: [],
    checkedKey: null
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
    if(_this.utils.hasValue(_this.list)){
      _this.data.list = _this.list;
    }
  }

  onSelect(){
    const _this = this;
    if(_this.utils.hasValue(_this.run)){
      _this.run(_this.data.checkedKey);
    }
  }

}
