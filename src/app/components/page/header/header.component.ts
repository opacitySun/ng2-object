import { Component, OnInit } from '@angular/core';
import { SessionService } from '@app/services/session.service';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public session:SessionService
  ) { }

  public data:any = {
    //设备类型 0:PC 1:Pad 2:Mobile
    device: this.session.state.device,
    iconBars: faBars
  };

  ngOnInit(): void {
    
  }

  //每次完成被投影组件内容的变更检测之后调用
  ngAfterContentChecked() {
    
  }

}
