import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionService } from '@app/services/session.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  constructor(
    public session:SessionService
  ) { 
    const _this = this;
    //监听session中的state变化
    _this.subscription = _this.session.getState().subscribe(state => {
      _this.show = state.loading;
    });
  }

  //rxjs的订阅对象
  public subscription: Subscription;
  public show:boolean = false;

  ngOnInit(): void {
  }

  ngAfterContentChecked() {
    // this.show = this.session.state.loading;
  }

}
