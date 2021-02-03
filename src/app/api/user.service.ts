import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { AxiosConfigService } from '@app/services/axios-config.service';
import { SessionService } from '@app/services/session.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    public http:AxiosConfigService,
    public session:SessionService
  ) {
    const _this = this;
    //监听session中的state变化
    _this.subscription = _this.session.getState().subscribe(state => {
      _this.token = state.token;
    });
  }

  public subscription: Subscription;
  private request:any = this.http.axiosHttp;
  private token:string = this.session.state.token;

  //获取token
  getToken(params) {
    return this.request({
      url: '/oauth/token',
      method: 'post',
      params
    })
  }
}
