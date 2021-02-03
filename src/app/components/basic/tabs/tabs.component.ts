import { Component, OnInit } from '@angular/core';
import { SessionService } from '@app/services/session.service';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  constructor(
    public session:SessionService
  ) { }

  public data:any = {
    //设备类型 0:PC 1:Pad 2:Mobile
    device: this.session.state.device,
    //列表
    list: [
      {
        label:'测算方案1',
        left:0,
        zIndex:1,
        price: 8659.74,
        checked: true
      }
    ],
    iconChecked: faCheck
  };

  ngOnInit(): void {
  }

}
