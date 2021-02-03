import { Component, OnInit } from '@angular/core';
import { SessionService } from '@app/services/session.service';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public session:SessionService
  ) { }

  public data:any = {
    selectVal: 1,
    options: [
      {value:0,label:'选项一'},
      {value:1,label:'选项二'},
      {value:2,label:'选项三'}
    ],
    selectVal2: 0,
    options2: [
      {value:0,label:'测试一'},
      {value:1,label:'测试二'},
      {value:2,label:'测试三'}
    ],
    myIcon: faCoffee,
    checkLabel: '投保',
    checked: false,
    tooltipOptions: {
      'show-delay': 500,
      'theme': 'light'
    },
    date: '',
    mobileDate: new Date(),
    inputVal: ''
  };

  ngOnInit(): void {
    const _this = this;
    _this.session.setState({
      step: 0
    });
  }

  //每次完成被投影组件内容的变更检测之后调用
  ngAfterContentChecked() {
    const _this = this;
    console.log(_this.data);
  }

  changeState() {
    this.session.setState({
      step: 3
    });
  }

  onDateChange(event) {

  }

  currentDateFormat(date, format: string = 'yyyy-mm-dd HH:MM'): any {
    const pad = (n: number): string => (n < 10 ? `0${n}` : n.toString());
    return format
      .replace('yyyy', date.getFullYear())
      .replace('mm', pad(date.getMonth() + 1))
      .replace('dd', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('MM', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()));
  }

  onMobileDateChange(event) {

  }
}
