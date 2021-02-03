import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipModule } from 'ng2-tooltip-directive';
import { QRCodeModule } from 'angular2-qrcode';
import { CodeInputModule } from 'angular-code-input';
import { PdfViewerModule } from 'ng2-pdf-viewer';

/** 配置 angular i18n **/
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);

import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';

import { LocalService } from './services/local.service';
import { SessionService } from './services/session.service';

import { InputNumberDirective } from './directives/input-number.directive';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';

import { SelectComponent } from './components/basic/select/select.component';
import { CheckboxComponent } from './components/basic/checkbox/checkbox.component';
import { SwitchComponent } from './components/basic/switch/switch.component';
import { TabsComponent } from './components/basic/tabs/tabs.component';
import { InputComponent } from './components/basic/input/input.component';
import { LoadingComponent } from './components/basic/loading/loading.component';
import { DatePickerComponent } from './components/basic/date-picker/date-picker.component';
import { CardDatePickerComponent } from './components/basic/card-date-picker/card-date-picker.component';
import { HeaderComponent } from './components/page/header/header.component';
import { BottomMoneyBoxComponent } from './components/page/bottom-money-box/bottom-money-box.component';
import { FooterComponent } from './components/page/footer/footer.component';
import { PageBottomComponent } from './components/page/page-bottom/page-bottom.component';
import { BasicInfoComponent } from './components/page/basic-info/basic-info.component';
import { HistoryListComponent } from './components/page/history-list/history-list.component';

import { HomeComponent } from './views/home/home.component';
import { InfoConfirmComponent } from './views/info-confirm/info-confirm.component';
import { InsureConfirmComponent } from './views/insure-confirm/insure-confirm.component';
import { VerifySuccessComponent } from './views/verify-success/verify-success.component';
import { VerifyFailComponent } from './views/verify-fail/verify-fail.component';
import { PaySuccessComponent } from './views/pay-success/pay-success.component';
import { PayFailComponent } from './views/pay-fail/pay-fail.component';
import { InsureSelectComponent } from './views/insure-select/insure-select.component';
import { GetParamsComponent } from './views/get-params/get-params.component';
import { PayTimeoutComponent } from './views/pay-timeout/pay-timeout.component';
import { PayTypeComponent } from './views/pay-type/pay-type.component';


const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

@NgModule({
  declarations: [
    InputNumberDirective,
    AppComponent,
    LayoutComponent,
    HomeComponent,
    SelectComponent,
    CheckboxComponent,
    SwitchComponent,
    TabsComponent,
    InputComponent,
    LoadingComponent,
    DatePickerComponent,
    CardDatePickerComponent,
    HeaderComponent,
    FooterComponent,
    PageBottomComponent,
    BasicInfoComponent,
    BottomMoneyBoxComponent,
    HistoryListComponent,
    InfoConfirmComponent,
    InsureConfirmComponent,
    VerifySuccessComponent,
    VerifyFailComponent,
    PaySuccessComponent,
    PayFailComponent,
    InsureSelectComponent,
    GetParamsComponent,
    PayTimeoutComponent,
    PayTypeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    TooltipModule,
    QRCodeModule,
    CodeInputModule,
    PdfViewerModule,
    NzGridModule,
    NzDatePickerModule,
    NzCalendarModule,
    NzModalModule,
    NzMessageModule,
    NgZorroAntdMobileModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: NZ_ICONS, useValue: icons },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    LocalService,
    SessionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
