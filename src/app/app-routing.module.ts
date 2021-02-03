import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions, Router } from '@angular/router';
import { UtilsService } from '@app/services/utils.service';
import { SessionService } from '@app/services/session.service';

import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './views/home/home.component';
import { InfoConfirmComponent } from './views/info-confirm/info-confirm.component';
import { InsureConfirmComponent } from './views/insure-confirm/insure-confirm.component';
import { VerifySuccessComponent } from './views/verify-success/verify-success.component';
import { VerifyFailComponent } from './views/verify-fail/verify-fail.component';
import { PaySuccessComponent } from './views/pay-success/pay-success.component';
import { PayFailComponent } from './views/pay-fail/pay-fail.component';
import { PayTimeoutComponent } from './views/pay-timeout/pay-timeout.component';
import { InsureSelectComponent } from './views/insure-select/insure-select.component';
import { GetParamsComponent } from './views/get-params/get-params.component';
import { PayTypeComponent } from './views/pay-type/pay-type.component';

const routes: Routes = [
  {
    path: 'layout', 
    component: LayoutComponent,
    children: [
      {path: 'home', component: HomeComponent},
      {path: 'info-confirm', component: InfoConfirmComponent},
      {path: 'insure-confirm', component: InsureConfirmComponent},
      {path: 'insure-select', component: InsureSelectComponent},
      {path: 'verify-success', component: VerifySuccessComponent},
      {path: 'verify-fail', component: VerifyFailComponent},
      {path: 'pay-success', component: PaySuccessComponent},
      {path: 'pay-fail', component: PayFailComponent},
      {path: 'pay-timeout', component: PayTimeoutComponent},
      {path: 'pay-type', component: PayTypeComponent},
      {path: 'get-params', component: GetParamsComponent},
      {path: '**', redirectTo: 'insure-select'}
    ]
  },
  {
    path: '**',
    redirectTo: 'layout',
    pathMatch: 'full'
  }
];

const options: ExtraOptions = {
  useHash: true,
  onSameUrlNavigation: 'reload'
};

@NgModule({
  imports: [RouterModule.forRoot(routes,options)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  constructor(
    public router: Router,
    public utils:UtilsService,
    public session:SessionService
  ) { 
    const _this = this;
    //设置url时间戳，避免html缓存问题
    let urlTimeStampObj:any = _this.utils.urlTimeStamp();
    if(!!urlTimeStampObj) {
      _this.session.setState({
        htmlTag: urlTimeStampObj.tag
      });
      window.location.href = urlTimeStampObj.url;
    }

    //获取url参数
    let params: any = _this.utils.getUrlQueryObj();
    let stateObj: any = {};
    //rn号
    let teslaRn = params.teslaRn;
    if(_this.utils.hasValue(teslaRn)) {
      stateObj.teslaRn = teslaRn;
      stateObj.originRn = teslaRn.replace(/(-T)|(-I)/g,"");
    }
    //业务流水号
    let flowNo = params.flowNo;
    if(_this.utils.hasValue(flowNo)) {
      stateObj.businessOrderNo = flowNo;
    }
    //指定路径跳转
    let path = params.path;
    if(_this.utils.hasValue(path)){
      stateObj.tipsVisible = false;
      let pathParams = { ...params };
      _this.router.navigate([path],{queryParams: pathParams});
    }
    _this.session.setState(stateObj);
    //路由跳转监听
    _this.router.events.subscribe((event) => {
      
    });
  }
}
