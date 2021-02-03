import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '@app/services/utils.service';
import { SessionService } from '@app/services/session.service';
import { InsureService } from '@app/api/insure.service';

@Component({
  selector: 'app-page-bottom',
  templateUrl: './page-bottom.component.html',
  styleUrls: ['./page-bottom.component.scss']
})
export class PageBottomComponent implements OnInit {

  //加载父组件传过来的属性
  @Input() home:any;
  @Input() label1:string;
  @Input() run1:any;
  @Input() btn1Disabled:boolean;
  @Input() btn1Hidden:boolean;
  @Input() label2:string;
  @Input() run2:any;
  @Input() btn2Disabled:boolean;
  @Input() btn2Hidden:boolean;
  @Input() hasClause:boolean;
  @Input() hasExplain:boolean;
  @Input() explainTxt:string;

  //通过get和set实现自定义的[(ngModel)]
  @Output() clauseCheckedChange = new EventEmitter();
  get clauseChecked(): any {
    return this.data.clauseChecked;
  }
  @Input('clauseChecked')
  set clauseChecked(value: any) {
    this.clauseCheckedChange.emit(value);
  }

  @Output() explainCheckedChange = new EventEmitter();
  get explainChecked(): any {
    return this.data.explainChecked;
  }
  @Input('explainChecked')
  set explainChecked(value: any) {
    this.explainCheckedChange.emit(value);
  }

  constructor(
    public router: Router,
    public utils:UtilsService,
    public session:SessionService,
    public insureApi: InsureService
  ) { }

  public data:any = {
    //设备类型 0:PC 1:Pad 2:Mobile
    device: this.session.state.device,
    serviceTelephone: this.session.state.serviceTelephone,
    lable1: '',
    btn1Disabled: false,
    btn1Hidden: false,
    lable2: '',
    btn2Disabled: false,
    btn2Hidden: false,
    clauseChecked: false,
    //是否显示条款
    hasClause: false,
    //是否显示说明
    hasExplain: false,
    //说明文字
    explainTxt: '',
    //文案弹出框
    articleModalVisible: false,
    //文案内容
    article: '',
    //文案pdf地址
    pdfSrc: ''
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
    if(_this.utils.hasValue(_this.label1)){
      _this.data.label1 = _this.label1;
    }
    if(_this.utils.hasValue(_this.btn1Disabled)){
      _this.data.btn1Disabled = _this.btn1Disabled;
    }
    if(_this.utils.hasValue(_this.btn1Hidden)){
      _this.data.btn1Hidden = _this.btn1Hidden;
    }
    if(_this.utils.hasValue(_this.label2)){
      _this.data.label2 = _this.label2;
    }
    if(_this.utils.hasValue(_this.btn2Disabled)){
      _this.data.btn2Disabled = _this.btn2Disabled;
    }
    if(_this.utils.hasValue(_this.btn2Hidden)){
      _this.data.btn2Hidden = _this.btn2Hidden;
    }
    if(_this.utils.hasValue(_this.hasClause)){
      _this.data.hasClause = _this.hasClause;
    }
    if(_this.utils.hasValue(_this.hasExplain)){
      _this.data.hasExplain = _this.hasExplain;
    }
    if(_this.utils.hasValue(_this.explainTxt)){
      _this.data.explainTxt = _this.explainTxt;
    }
  }

  onBtn1() {
    const _this = this;
    if(_this.utils.hasValue(_this.run1)){
      _this.run1();
    }
  }

  onBtn2() {
    const _this = this;
    if(_this.utils.hasValue(_this.run2)){
      _this.run2();
    }
  }

  //显示文案弹出框
  async onArticleShow(type) {
    const _this = this;
    switch(type) {
      case 0:
        _this.data.article = 'assets/file/article1.html';
        _this.data.pdfSrc = 'assets/file/article1.pdf';
        break;
      case 1:
        _this.data.article = 'assets/file/article2.html';
        _this.data.pdfSrc = 'assets/file/article2.pdf';
        break;
      case 2:
        _this.data.article = 'assets/file/article3.html';
        _this.data.pdfSrc = 'assets/file/article3.pdf';
        break;
    }
    // let res = await _this.insureApi.getClauseHTML(parseInt(type) + 1);
    // _this.data.article = res;
    _this.data.articleModalVisible = true;
    // window.open(_this.data.article);
  }

  //关闭文案弹出框
  onArticleClose() {
    const _this = this;
    _this.data.articleModalVisible = false;
  }

  //取消定制保险
  goAccount() {
    const _this = this;
    let teslaRn = _this.session.state.teslaRn;
    if(!!teslaRn){
      teslaRn = teslaRn.replace("-T","");
      teslaRn = teslaRn.replace("-I","");
    }
    _this.session.setState({
      loading: true
    });
    window.location.href = `https://www.tesla.cn/teslaaccount/profile?rn=${teslaRn}`;
  }

}
