import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '@app/services/utils.service';
import { SessionService } from '@app/services/session.service';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { NzMessageService } from 'ng-zorro-antd/message';
import { InsureService } from '@app/api/insure.service';

@Component({
  selector: 'app-insure-select',
  templateUrl: './insure-select.component.html',
  styleUrls: ['./insure-select.component.scss']
})
export class InsureSelectComponent implements OnInit {

  //加载子组件dom
  @ViewChild('appHistoryList') appHistoryList:any;
  @ViewChild('appBasicInfo') appBasicInfo:any;

  constructor(
    public router: Router,
    public message: NzMessageService,
    public utils: UtilsService,
    public session: SessionService,
    public insureApi: InsureService
  ) { }

  public data:any = {
    //设备类型 0:PC 1:Pad 2:Mobile
    device: this.session.state.device,
    //业务类型 0：试算 1：正式投保
    businessType: this.session.state.businessType,
    teslaRn: this.session.state.teslaRn,
    iconRight: faChevronRight,
    nzOffset: 2,
    contentGutter: 24,
    tooltipOptions: {
      'show-delay': 500,
      'theme': 'light',
      'tooltip-class': 'tesla-tooltip'
    },
    carInfo: {},
    city: '',
    oldCompanyCode: '',
    companyCode: '',
    companyOptions: null,
    companyError: false,
    biVisible: true,
    bi: [],
    biMpVisible: false,
    biMp: [],
    biAddVisible: false,
    biAdd: [],
    biSpecialVisible: false,
    biSpecial: [],
    ciVisible: true,
    ci: [],
    historyBtnVisible: false,
    historyModalVisible: false,
    historyList: [],
    //是否正在读取历史记录
    historyLoading: false,
    biCardDate: false,
    biStartTimeStamp: new Date().getTime(),
    biStartDate: new Date(),
    biStartOldDate: new Date(),
    biStartDateStr: '',
    biEndDate: '',
    ciCardDate: false,
    ciStartTimeStamp: new Date().getTime(),
    ciStartDate: new Date(),
    ciStartOldDate: new Date(),
    ciStartDateStr: '',
    ciEndDate: '',
    //总保费
    salePremium: '',
    //总保额
    sumInsured: '',
    //正在获取险种列表
    isLoadingRisks: false,
    //底部按钮配置
    pageBottomBtn1Label: '',
    pageBottomBtn1Disabled: false,
    pageBottomBtn1Hidden: false,
    pageBottomBtn2Label: '',
    pageBottomBtn2Disabled: false,
    pageBottomBtn2Hidden: false,
    //地区编码
    areaCode: '',
    //业务流水号
    businessOrderNo: '',
    //0新保,1续保,2转保
    insurFlag: "0",
    //是否允许重复投保
    isAllowRepeat: 0,
    //是否有底部条款
    hasClause: false,
    //是否同意底部条款
    clauseChecked: false,
    //是否有底部说明
    hasExplain: false,
    //底部说明文字
    explainTxt: '',
    //默认选中的险种
    defaultRisks: null,
    //是否显示齐全的车辆信息
    rightInfoFill: false,
    //是否显示电机号、车架号
    hasVin: false,
    //本地json的全部险种
    allRisks: null,
    //试算全部险种列表
    calculationRisks: null,
    //购买按钮是否可点击
    insurable: false,
    //是否选择了历史记录
    isSelectHistory: false
  }

  private home:any;

  ngOnInit(): void {
    const _this = this;
    _this.utils.backPageTop();
    _this.initPage();
  }

  ngDoCheck() {
    const _this = this;
    //保司改变时
    if(_this.utils.hasValue(_this.data.companyCode)){
      _this.data.companyError = false;
      if(_this.data.companyCode !== _this.data.oldCompanyCode){
        _this.data.oldCompanyCode = _this.data.companyCode;
        _this.datePromptly('bi');
        _this.datePromptly('ci');
        if(!_this.data.historyLoading){
          _this.getRisks();
        }
        // if(_this.data.businessType == 1){
        //   _this.getSpecial();
        // }
      }
    }

    //生效时间改变时
    let biDate = new Date(_this.data.biStartTimeStamp);
    _this.onBiDateChange(biDate);
    let ciDate = new Date(_this.data.ciStartTimeStamp);
    _this.onCiDateChange(ciDate);

    //险种数据改变时
    _this.data.bi = _this.data.bi.map(item => {
      if(!!item.isCheckbox){
        if(!!item.checked){
          item.moneyId = 0;
        }else{
          item.moneyId = -1;
        }
      }
      return item;
    });
    _this.data.ci = _this.data.ci.map(item => {
      if(!!item.isCheckbox){
        if(!!item.checked){
          item.moneyId = 0;
        }else{
          item.moneyId = -1;
        }
      }
      return item;
    });
    _this.data.biAdd = _this.data.biAdd.map(item => {
      if(!!item.share){
        if(!item.hasMain){
          let notMainChecked = false;
          switch(item.id){
            //附加医保外用药责任险（三者）
            case 'HT_HD_A_0019':
              _this.data.bi.some(itm => {
                if(itm.moneyId != -1){
                  if(itm.id == 'HT_HD_M_0002'){
                    let money = itm.moneyId;
                    if(parseFloat(money) >= 10000){
                      money = parseFloat(money) / 10000;
                      money = money + '万';
                    }
                    item.mainLabel = '机动车第三者责任保险';
                    item.mainMoney = money;
                    return true;
                  }
                }else{
                  if(itm.id == 'HT_HD_M_0002'){
                    _this.message.create('warning', '您未选择对应的主险');
                    notMainChecked = true;
                  }
                }
              });
              break;
            //附加医保外用药责任险（司机）
            case 'HT_HD_A_0020':
              _this.data.bi.some(itm => {
                if(itm.moneyId != -1){
                  if(itm.id == 'HT_HD_M_0003'){
                    let money = itm.moneyId;
                    if(parseFloat(money) >= 10000){
                      money = parseFloat(money) / 10000;
                      money = money + '万';
                    }
                    item.mainLabel = '机动车车上人员责任保险(司机)';
                    item.mainMoney = money;
                    return true;
                  }
                }else{
                  if(itm.id == 'HT_HD_M_0003'){
                    _this.message.create('warning', '您未选择对应的主险');
                    notMainChecked = true;
                  }
                }
              });
              break;
            //附加医保外用药责任险（乘客）
            case 'HT_HD_A_0021':
              _this.data.bi.some(itm => {
                if(itm.moneyId != -1){
                  if(itm.id == 'HT_HD_M_0004'){
                    let money = itm.moneyId;
                    if(parseFloat(money) >= 10000){
                      money = parseFloat(money) / 10000;
                      money = money + '万';
                    }
                    item.mainLabel = '机动车车上人员责任保险(乘客)';
                    item.mainMoney = money;
                    return true;
                  }
                }else{
                  if(itm.id == 'HT_HD_M_0004'){
                    _this.message.create('warning', '您未选择对应的主险');
                    notMainChecked = true;
                  }
                }
              });
              break;
          }
          if(notMainChecked){
            item.share = false;
            item.hasMain = false;
          }else{
            item.hasMain = true;
          }
        }
      }else{
        item.hasMain = false;
      }
      return item;
    });

    //窗口大小改变时
    let screenWidth = _this.session.state.screenWidth;
    if(screenWidth < 1000){
      _this.data.nzOffset = 0;
      _this.data.contentGutter = 48;
    }else{
      _this.data.nzOffset = 2;
      _this.data.contentGutter = 24;
    }
  }

  //初始化页面
  async initPage() {
    const _this = this;
    if(_this.data.businessType == 0){//测算
      const isFirstIn = _this.session.state.isFirstIn;
      if(isFirstIn){
        _this.session.setState({
          isFirstIn: false,
          tipsVisible: true
        });
      }
      _this.data.pageBottomBtn1Label = '下一步';
      _this.data.pageBottomBtn2Disabled = true;
      _this.data.pageBottomBtn2Hidden = true;
      _this.data.pageBottomBtn2Label = '返回';
      _this.data.hasClause = false;
      _this.data.hasExplain = false;
      _this.data.explainTxt = '尊敬的用户您好，建议购买以下险种：交强险，商业险（机动车损失险、第三者责任险）其他险种可根据自身需求购买。';
      await _this.getUserInfo();
    }else{//正式投保
      // _this.nowDatePromptly();
      _this.data.pageBottomBtn1Label = '下一步';
      _this.data.pageBottomBtn1Disabled = false;
      _this.data.pageBottomBtn2Label = '返回';
      // _this.data.hasClause = true;
      _this.data.hasExplain = true;
      _this.data.explainTxt = '尊敬的用户您好，建议购买以下险种：交强险，商业险（机动车损失险、第三者责任险）其他险种可根据自身需求购买。请您务必仔细核对所选险种和保险生效时间，以避免影响您正常使用。';
      _this.data.rightInfoFill = false;
      _this.data.hasVin = true;
      document.onclick = (e: any) => {
        e.stopPropagation();
        if(e.target.className.indexOf("ant-") == -1){
          _this.data.ciCardDate = false;
          _this.data.biCardDate = false;
        }
      };
      await _this.getBasicInfo();
      _this.getPlan();
    }
    _this.getCompanyList();
    _this.getRisks();
  }

  //获取保险公司列表
  async getCompanyList() {
    const _this = this;
    let params = {
      teslaRn: _this.data.teslaRn,
      areaCode: _this.data.areaCode
    };
    let res = await _this.insureApi.getCompanyList(params);
    if(res.resultCode == '0000000'){
      _this.data.companyOptions = res.data.map(item => {
        let obj: any = {
          value: item.insurCode,
          label: item.insurName
        };
        switch(item.insurCode) {
          case 'PAIC':
            obj.sortId = 2;
            break;
          case 'ACIC':
            obj.sortId = 4;
            break;
          case 'CPIC':
            obj.sortId = 3;
            break;
          case 'PICC':
            obj.sortId = 1;
            break;
        }
        return obj;
      });
      _this.data.companyOptions.sort((a,b) => {
        return a.sortId > b.sortId;
      });
      _this.session.setState({
        companyList: _this.data.companyOptions
      });
    }
  }

  //设置太保的生效时间和结束时间
  onCPICDate(type, date) {
    const _this = this;
    const pad = (n: number): string => (n < 10 ? `0${n}` : n.toString());
    let y = date.getFullYear() + "";  //获取选择的年
    let m = pad(date.getMonth() + 1);  //获取选择的月
    let d = pad(date.getDate());  //获取选择的日
    let h = pad(date.getHours());  //获取选择的时
    let i = pad(date.getMinutes());  //获取选择的分
    // if(date.getMinutes() !== 0){
    //   h = pad(date.getHours() + 1);
    // }
    let startDate: any = `${y}/${m}/${d} ${h}:${i}`;
    let end_d: any = 0;
    let temp = "00:00";
    let timeDate: any;
    switch(type) {
      case 'bi':
        timeDate = new Date(startDate);
        timeDate.setFullYear(timeDate.getFullYear() + 1);
        //判断开始时间是否为0点，是：将终报日期天数不加1
        if (parseInt(h) == 0) {
          timeDate.setDate(timeDate.getDate());
        } else {
          timeDate.setDate(timeDate.getDate() + 1);
        }
        timeDate.setHours(0, 0, 0);
        end_d = timeDate.getDate() < 10 ? "0" + timeDate.getDate() : timeDate.getDate();
        break;
      case 'ci':
        timeDate = new Date(startDate);
        timeDate.setFullYear(timeDate.getFullYear() + 1);
        timeDate.setDate(timeDate.getDate());
        end_d = timeDate.getDate() < 10 ? "0" + timeDate.getDate() : timeDate.getDate();
        temp = h + ":" + i;
        break;
    }
    let end_y = timeDate.getFullYear();
    let end_m = timeDate.getMonth() + 1 < 10 ? "0" + (timeDate.getMonth() + 1) : timeDate.getMonth() + 1;

    //判断是否是闰年,并且是2月29号
    if (_this.utils.isLeapYear(y.substring(0, y.length - 1)) == true
    && parseInt(m.substring(0, m.length - 1)) == 2
    && parseInt(d.substring(0, d.length - 1)) == 29) {
      end_d = parseInt(end_d) - 1;
    }

    let startTime = new Date(startDate);
    let endDate = '';
    switch(type) {
      case 'bi':
        _this.data.biStartDate = startTime;
        _this.data.biStartDateStr = _this.utils.dateToStringFormat(_this.data.biStartDate,'mm/dd/yyyy HH:MM:ss');
        // end_d = parseInt(end_d) - 1;
        // end_d = end_d < 10 ? "0" + end_d : end_d;
        endDate = `${end_y}/${end_m}/${end_d} ${temp}`;
        _this.data.biEndDate = new Date(endDate);
        break;
      case 'ci':
        _this.data.ciStartDate = startTime;
        _this.data.ciStartDateStr = _this.utils.dateToStringFormat(_this.data.ciStartDate,'mm/dd/yyyy HH:MM:ss');
        // end_d = parseInt(end_d) - 1;
        // end_d = end_d < 10 ? "0" + end_d : end_d;
        endDate = `${end_y}/${end_m}/${end_d} ${temp}`;
        _this.data.ciEndDate = new Date(endDate);
        break;
    }
  }

  //设置人保的生效时间和结束时间
  onPICCDate(type, date) {
    const _this = this;
    const pad = (n: number): string => (n < 10 ? `0${n}` : n.toString());
    let y = date.getFullYear() + "";  //获取选择的年
    let m = pad(date.getMonth() + 1);  //获取选择的月
    let d = pad(date.getDate());  //获取选择的日
    let h = pad(date.getHours());  //获取选择的时
    let i = '00';  //获取选择的分
    if(date.getMinutes() !== 0){
      h = pad(date.getHours() + 1);
    }
    let startDate: any = `${y}/${m}/${d} ${h}:00`;
    let end_d: any = 0;
    let temp = "00:00";
    let timeDate: any;
    switch(type) {
      case 'bi':
        timeDate = new Date(startDate);
        timeDate.setFullYear(timeDate.getFullYear() + 1);
        //判断开始时间是否为0点，是：将终报日期天数不加1
        if (parseInt(h) == 0) {
          timeDate.setDate(timeDate.getDate());
        } else {
          timeDate.setDate(timeDate.getDate() + 1);
        }
        timeDate.setHours(0, 0, 0);
        end_d = timeDate.getDate() < 10 ? "0" + timeDate.getDate() : timeDate.getDate();
        break;
      case 'ci':
        timeDate = new Date(startDate);
        timeDate.setFullYear(timeDate.getFullYear() + 1);
        timeDate.setDate(timeDate.getDate());
        end_d = timeDate.getDate() < 10 ? "0" + timeDate.getDate() : timeDate.getDate();
        temp = h + ":00";
        break;
    }
    let end_y = timeDate.getFullYear();
    let end_m = timeDate.getMonth() + 1 < 10 ? "0" + (timeDate.getMonth() + 1) : timeDate.getMonth() + 1;

    //判断是否是闰年,并且是2月29号
    if (_this.utils.isLeapYear(y.substring(0, y.length - 1)) == true
    && parseInt(m.substring(0, m.length - 1)) == 2
    && parseInt(d.substring(0, d.length - 1)) == 29) {
      end_d = parseInt(end_d) - 1;
    }

    let startTime: any = new Date(startDate);
    let endDate = '';
    switch(type) {
      case 'bi':
        _this.data.biStartDate = startTime;
        _this.data.biStartDateStr = _this.utils.dateToStringFormat(_this.data.biStartDate,'mm/dd/yyyy HH:MM:ss');
        // end_d = parseInt(end_d) - 1;
        // end_d = end_d < 10 ? "0" + end_d : end_d;
        endDate = `${end_y}/${end_m}/${end_d} ${temp}`;
        _this.data.biEndDate = new Date(endDate);
        break;
      case 'ci':
        _this.data.ciStartDate = startTime;
        _this.data.ciStartDateStr = _this.utils.dateToStringFormat(_this.data.ciStartDate,'mm/dd/yyyy HH:MM:ss');
        // end_d = parseInt(end_d) - 1;
        // end_d = end_d < 10 ? "0" + end_d : end_d;
        endDate = `${end_y}/${end_m}/${end_d} ${temp}`;
        _this.data.ciEndDate = new Date(endDate);
        break;
    }
  }

  //设置中国人寿保险的生效时间和结束时间
  onGPICDate(type, date) {
    const _this = this;
    const pad = (n: number): string => (n < 10 ? `0${n}` : n.toString());
    let y = date.getFullYear() + "";  //获取选择的年
    let m = pad(date.getMonth() + 1);  //获取选择的月
    let d = pad(date.getDate());  //获取选择的日
    let h = pad(date.getHours());  //获取选择的时
    let i = '00';  //获取选择的分
    if(date.getMinutes() !== 0){
      i = '30';
      if(date.getMinutes() > 30){
        h = pad(date.getHours() + 1);
        i = '00';
      }
    }
    let startDate: any = `${y}/${m}/${d} ${h}:${i}`;
    let end_d: any = 0;
    let temp = "00:00";
    let timeDate: any;
    switch(type) {
      case 'bi':
        timeDate = new Date(startDate);
        timeDate.setFullYear(timeDate.getFullYear() + 1);
        //判断开始时间是否为0点，是：将终报日期天数不加1
        if (parseInt(h) == 0) {
          timeDate.setDate(timeDate.getDate());
        } else {
          timeDate.setDate(timeDate.getDate() + 1);
        }
        timeDate.setHours(0, 0, 0);
        end_d = timeDate.getDate() < 10 ? "0" + timeDate.getDate() : timeDate.getDate();
        break;
      case 'ci':
        timeDate = new Date(startDate);
        timeDate.setFullYear(timeDate.getFullYear() + 1);
        timeDate.setDate(timeDate.getDate());
        end_d = timeDate.getDate() < 10 ? "0" + timeDate.getDate() : timeDate.getDate();
        temp = h + ":" + i;
        break;
    }
    let end_y = timeDate.getFullYear();
    let end_m = timeDate.getMonth() + 1 < 10 ? "0" + (timeDate.getMonth() + 1) : timeDate.getMonth() + 1;

    //判断是否是闰年,并且是2月29号
    if (_this.utils.isLeapYear(y.substring(0, y.length - 1)) == true
    && parseInt(m.substring(0, m.length - 1)) == 2
    && parseInt(d.substring(0, d.length - 1)) == 29) {
      end_d = parseInt(end_d) - 1;
    }

    let startTime = new Date(startDate);
    let endDate = '';
    switch(type) {
      case 'bi':
        _this.data.biStartDate = startTime;
        _this.data.biStartDateStr = _this.utils.dateToStringFormat(_this.data.biStartDate,'mm/dd/yyyy HH:MM:ss');
        // end_d = parseInt(end_d) - 1;
        // end_d = end_d < 10 ? "0" + end_d : end_d;
        endDate = `${end_y}/${end_m}/${end_d} ${temp}`;
        _this.data.biEndDate = new Date(endDate);
        break;
      case 'ci':
        _this.data.ciStartDate = startTime;
        _this.data.ciStartDateStr = _this.utils.dateToStringFormat(_this.data.ciStartDate,'mm/dd/yyyy HH:MM:ss');
        // end_d = parseInt(end_d) - 1;
        // end_d = end_d < 10 ? "0" + end_d : end_d;
        endDate = `${end_y}/${end_m}/${end_d} ${temp}`;
        _this.data.ciEndDate = new Date(endDate);
        break;
    }
  }

  onBiDateChange(value: Date) {
    const _this = this;
    let home = _this;

    let isChangeDay = false;
    let startD = value.getDate(), 
        startOldD = home.data.biStartOldDate.getDate();
    if(startD != startOldD) {
      isChangeDay = true;
      home.data.biStartOldDate = value;
    }

    let isNotToday = false; //是否是今天
    let y = value.getFullYear();  //获取选择的年
    let m = value.getMonth();  //获取选择的月
    let d = value.getDate();  //获取选择的日
    let now = new Date(),
        nowY = now.getFullYear(),
        nowM = now.getMonth(),
        nowD = now.getDate();
    if(y != nowY || m != nowM || d != nowD){
      isNotToday = true;
    }

    if(home.data.companyCode == 'CPIC'){
      if(isNotToday){
        value.setHours(0,0,0);
      }else{
        value = _this.utils.getDateByAddMinutes(now, 40);
      }
      home.onCPICDate('bi',value);
    }else if(home.data.companyCode == 'PICC'){
      if(isNotToday){
        value.setHours(0,0,0);
      }else{
        value = _this.utils.getDateByAddMinutes(now, 30);
      }
      home.onPICCDate('bi',value);
    }else if(home.data.companyCode == 'GPIC' || home.data.companyCode == 'PAIC'){
      if(isNotToday){
        value.setHours(0,0,0);
      }else{
        value = _this.utils.getDateByAddMinutes(now, 30);
      }
      home.onGPICDate('bi',value);
    }else{
      if(isNotToday){
        value.setHours(0,0,0);
      }else{
        value = _this.utils.getDateByAddMinutes(now, 30);
        if(value.getMinutes() !== 0 && value.getMinutes() > 30){
          value = _this.utils.getDateByAddHours(now, 1);
        }else{
          value = _this.utils.getDateByAddHours(now, 2);
        }
        value.setMinutes(0,0,0);
      }
      home.data.biStartDate = value;
      home.data.biStartOldDate = value;
      home.data.biStartDateStr = home.utils.dateToStringFormat(home.data.biStartDate,'mm/dd/yyyy HH:MM:ss');
      home.data.biEndDate = home.utils.getYearEndDate(value);
    }
    if(isChangeDay){
      home.data.biCardDate = false;
    }
  }

  //显示商业险的时间选择框
  biCardDateShow(e) {
    const _this = this;
    e.stopPropagation();
    _this.data.biCardDate = !_this.data.biCardDate;
    _this.data.ciCardDate = false;
  }

  //商业险时间选择框的点击监听
  biCardDateClick(e) {
    e.stopPropagation();
  }

  onCiDateChange(value: any) {
    const _this = this;
    let home = _this;

    let isChangeDay = false;
    let startD = value.getDate(), 
        startOldD = home.data.ciStartOldDate.getDate();
    if(startD != startOldD) {
      isChangeDay = true;
      home.data.ciStartOldDate = value;
    }

    let isNotToday = false; //是否是今天
    let y = value.getFullYear();  //获取选择的年
    let m = value.getMonth();  //获取选择的月
    let d = value.getDate();  //获取选择的日
    let now = new Date(),
        nowY = now.getFullYear(),
        nowM = now.getMonth(),
        nowD = now.getDate();
    if(y != nowY || m != nowM || d != nowD){
      isNotToday = true;
    }

    if(!isNotToday && home.data.areaCode == '110100'){
      value = value.setDate(value.getDate() + 1);
      value = new Date(value);
      value.setHours(0,0,0);
    }
    if(home.data.companyCode == 'CPIC'){
      if(isNotToday){
        value.setHours(0,0,0);
      }else{
        if(home.data.areaCode != '110100'){
          value = _this.utils.getDateByAddMinutes(now, 40);
        }
      }
      home.onCPICDate('ci',value);
    }else if(home.data.companyCode == 'PICC'){
      if(isNotToday){
        value.setHours(0,0,0);
      }else{
        if(home.data.areaCode != '110100' && home.data.areaCode == '310100'){
          value = value.setDate(value.getDate() + 1);
          value = new Date(value);
          value.setHours(0,0,0);
        }
        if(home.data.areaCode != '110100' && home.data.areaCode != '310100'){
          value = _this.utils.getDateByAddMinutes(now, 30);
        }
      }
      home.onPICCDate('ci',value);
    }else if(home.data.companyCode == 'GPIC' || home.data.companyCode == 'PAIC'){
      if(isNotToday || _this.data.areaCode == '110100'){
        value.setHours(0,0,0);
      }else{
        if(home.data.areaCode != '110100'){
          value = _this.utils.getDateByAddMinutes(now, 30);
        }
      }
      home.onGPICDate('ci',value);
    }else{
      if(isNotToday){
        value.setHours(0,0,0);
      }else{
        if(_this.data.areaCode != '110100'){
          value = _this.utils.getDateByAddMinutes(now, 30);
          if(value.getMinutes() !== 0 && value.getMinutes() > 30){
            value = _this.utils.getDateByAddHours(now, 1);
          }else{
            value = _this.utils.getDateByAddHours(now, 2);
          }
          value.setMinutes(0,0,0);
        }
      }
      home.data.ciStartDate = value;
      home.data.ciStartOldDate = value;
      home.data.ciStartDateStr = home.utils.dateToStringFormat(home.data.ciStartDate,'mm/dd/yyyy HH:MM:ss');
      home.data.ciEndDate = home.utils.getYearEndDate(value);
    }
    if(isChangeDay){
      home.data.ciCardDate = false;
    }
  }

  //显示交强险的时间选择框
  ciCardDateShow(e) {
    const _this = this;
    e.stopPropagation();
    _this.data.ciCardDate = !_this.data.ciCardDate;
    _this.data.biCardDate = false;
  }

  //交强险时间选择框的点击监听
  ciCardDateClick(e) {
    e.stopPropagation();
  }

  //当前时间设置
  nowDatePromptly() {
    const _this = this;
    let now = new Date();
    _this.data.biStartDate = now;
    _this.data.biStartDateStr = _this.utils.dateToStringFormat(_this.data.biStartDate,'mm/dd/yyyy');
    _this.data.biEndDate = _this.utils.getYearEndDate(now);
    _this.data.ciStartDate = now;
    _this.data.ciStartDateStr = _this.utils.dateToStringFormat(_this.data.ciStartDate,'mm/dd/yyyy');
    _this.data.ciEndDate = _this.utils.getYearEndDate(now);
  }

  //计时生效
  datePromptly(type: string) {
    const _this = this;
    let now = new Date();
    let time: any = _this.utils.getDateByAddMinutes(now, 30);
    switch(type) {
      case 'bi':
        if(_this.data.companyCode == 'CPIC'){
          time = _this.utils.getDateByAddMinutes(now, 40);
          _this.onCPICDate('bi',time);
        }else if(_this.data.companyCode == 'PICC'){
          _this.onPICCDate('bi',time);
        }else if(_this.data.companyCode == 'GPIC' || _this.data.companyCode == 'PAIC' ){
          _this.onGPICDate('bi',time);
        }else{
          // if(time.getMinutes() !== 0 && time.getMinutes() > 30){
          //   time = _this.utils.getDateByAddHours(now, 1);
          //   time.setMinutes(0,0,0);
          // }else{
          //   time = _this.utils.getDateByAddHours(now, 2);
          //   time.setMinutes(0,0,0);
          // }
          time = _this.utils.getDateByAddMinutes(now, 30);
          _this.data.biStartDate = time;
          _this.data.biStartDateStr = _this.utils.dateToStringFormat(_this.data.biStartDate,'mm/dd/yyyy HH:MM:ss');
          _this.data.biEndDate = _this.utils.getYearEndDate(time);
        }
        break;
      case 'ci':
        if(_this.data.areaCode == '110100'){
          time = time.setDate(time.getDate() + 1);
          time = new Date(time);
          time.setHours(0,0,0);
        }
        if(_this.data.companyCode == 'CPIC'){
          if(_this.data.areaCode != '110100'){
            time = _this.utils.getDateByAddMinutes(now, 40);
          }
          _this.onCPICDate('ci',time);
        }else if(_this.data.companyCode == 'PICC'){
          if(_this.data.areaCode != '110100' && _this.data.areaCode == '310100'){
            time = time.setDate(time.getDate() + 1);
            time = new Date(time);
            time.setHours(0,0,0);
          }
          _this.onPICCDate('ci',time);
        }else if(_this.data.companyCode == 'GPIC' || _this.data.companyCode == 'PAIC'){
          _this.onGPICDate('ci',time);
        }else{
          if(_this.data.areaCode != '110100'){
            // if(time.getMinutes() !== 0 && time.getMinutes() > 30){
            //   time = _this.utils.getDateByAddHours(now, 1);
            //   time.setMinutes(0,0,0);
            // }else{
            //   time = _this.utils.getDateByAddHours(now, 2);
            //   time.setMinutes(0,0,0);
            // }
            time = _this.utils.getDateByAddMinutes(now, 30);
          }
          _this.data.ciStartDate = time;
          _this.data.ciStartDateStr = _this.utils.dateToStringFormat(_this.data.ciStartDate,'mm/dd/yyyy HH:MM:ss');
          _this.data.ciEndDate = _this.utils.getYearEndDate(time);
        }
        break;
    }
  }

  //触发险种选择的收缩功能
  onExtendByInsureList(type: string) {
    const _this = this;
    let keyName = `${type}Visible`;
    _this.data[keyName] = !_this.data[keyName];
    setTimeout(() => {
      _this.utils.scrollToBottom('layoutContent');
    },500);
  }

  //请求获取基本信息
  async getBasicInfo() {
    const _this = this;
    let params = {
      teslaRn: _this.data.teslaRn.replace("-T","-I")
    };
    let res = await _this.insureApi.getBasicInfo(params);
    if(res.resultCode == '0000000'){
      let data = res.data;
      _this.data.carInfo = {
        ..._this.data.carInfo,
        ..._this.session.state.carInfo,
        ...data,
        ...data.carInfo,
        carNo: (!!_this.session.state.carInfo && !!_this.session.state.carInfo.carNo)?_this.session.state.carInfo.carNo : '',
        purchasePrice: parseFloat(data.carInfo.purchasePrice),
        model: data.carInfo.modelDes,
        price: data.vehiclePrice,
        city: data.areaName
      };
      _this.data.city = data.areaName;
      _this.data.areaCode = data.areaCode;
      _this.data.insurFlag = data.insurFlag;
      if(_this.utils.hasValue(_this.session.state.businessOrderNo)){
        _this.data.businessOrderNo = _this.session.state.businessOrderNo;
      }else{
        _this.data.businessOrderNo = data.businessOrderNo;
      }
      //默认选中的险种
      if(_this.utils.hasValue(data.riskList) && data.riskList.length > 0){
        _this.data.defaultRisks = _this.utils.deepClone(data.riskList);
      }
      //默认保司code
      if(_this.utils.hasValue(data.insurerCode)){
        _this.data.companyCode = data.insurerCode;
      }
      //设置默认时间
      _this.datePromptly('bi');
      _this.datePromptly('ci');
    }
  }

  //获得险种列表
  getRisks() {
    const _this = this;
    if(_this.data.businessType == 0){
      _this.getRisksByCalculation({
        teslaRn: _this.data.teslaRn.replace("-I","-T"),
        insurCode: _this.data.companyCode
      });
    }else{
      _this.getAllRisks();
    }
  }

  //获得全部险种列表(正式投保)
  async getAllRisks() {
    const _this = this;
    _this.data.ci = [];
    _this.data.bi = [];
    _this.data.biAdd = [];
    _this.data.biSpecial = [];
    _this.data.biMp = [];
    let risksDesc: any = [];
    risksDesc = await _this.insureApi.getRisksDesc();
    let params = {
      areaCode: _this.data.areaCode,
      insurCode: _this.data.companyCode
    };
    let res: any = await _this.insureApi.getAllRisks(params);
    res = res.data;
    if(_this.utils.hasValue(res) && res.length > 0){
      _this.data.allRisks = _this.utils.deepClone(res);
      let defaultRisks = _this.data.defaultRisks || [];
      let requiredRisks = _this.getRequiredRiskCode();
      let ciArr:any = [], biArr:any = [], biAddArr:any = [], biMpArr:any = [];
      res.some(item => {
        if(item.insurCode == _this.data.companyCode || !_this.utils.hasValue(item.insurCode)){
          let obj: any = {};
          obj = {
            id: item.riskCode,
            label: item.riskName,
            state: item.riskState,
            type: item.riskType,
            moneyId: -1,
            moneyOptions: [{value: -1, label: '不投保'}]
          };
          // defaultRisks.some(itm => {
          //   if(itm.riskCode == item.riskCode){
          //     if(itm.riskCode == 'HT_HD_M_0001' 
          //     || itm.riskCode == 'TRAFFIC_INS'
          //     || itm.riskCode == 'VESSEL_TAX'){
          //       item.risk_amount = itm.riskAmount;
          //     }
          //     return true;
          //   }
          // });
          if(item.riskState == 0 || 
            item.riskCode == 'HT_HD_M_0001'){
            obj.isCheckbox = true;
            obj.checked = true;
          }
          if(_this.utils.hasValue(item.riskAmount)){
            item.riskAmount = item.riskAmount.split(",");
            item.riskAmount.some((itm,idx) => {
              let o = {
                value: itm,
                label: itm
              };
              if(item.riskState == 1 || item.riskState == 2){
                if(parseFloat(itm) >= 10000){
                  o.label = (parseFloat(itm) / 10000) + '万';
                }else{
                  o.label = _this.utils.formatMoney(itm, null);
                }
                if(parseFloat(itm) == 999){
                  o.label = '共享主险保额';
                  obj.hasShare = true;
                  obj.share = false;
                }
              }
              if(item.riskState == 0 || 
                item.riskCode == 'HT_HD_M_0001'){
                o.label = '投保';
              }
              if(item.riskCode == 'HT_HD_A_0006' &&
               item.riskAmount.length == 1){
                o.label = '投保';
              }
              if(parseFloat(itm) != 999){
                obj.moneyOptions.push(o);
              }
            });
          }else{
            obj.moneyOptions = [
              {value: -1, label: '不投保'},
              {value: 0, label: '投保'}
            ];
          }
          //必选险种
          requiredRisks.some(itm => {
            if(itm == item.riskCode && !!obj.moneyOptions[1]){
              obj.moneyId = obj.moneyOptions[1].value;
            }
          });
          if(item.riskCode == 'HT_HD_M_0002'){
            obj.moneyId = '1000000';
          }
          if(item.riskCode == 'VESSEL_TAX'){//车船税不可选择
            obj.moneyId = item.riskAmount;
            obj.disabled = true;
          }
          //从接口拿出的默认险种
          defaultRisks.some(itm => {
            if(itm.riskCode == item.riskCode){
              let hasAmount = false;
              obj.moneyOptions.some(it => {
                if(it.value == itm.riskAmount){
                  hasAmount = true;
                  return true;
                }
              });
              if(hasAmount){
                if(itm.riskCode != 'HT_HD_M_0001' 
                && itm.riskCode != 'TRAFFIC_INS'){
                  obj.moneyId = itm.riskAmount;
                }
              }
              return true;
            }
          });
          //险种说明
          if(risksDesc.length > 0){
            risksDesc.some(itm => {
              if(itm.riskCode == item.riskCode){
                obj.tooltip = itm.riskDesc;
                return true;
              }
            });
          }
          if(!_this.utils.hasValue(_this.data.companyCode) && obj.moneyOptions.length <= 1){
            obj.moneyId = '0';
            obj.moneyOptions = [
              {value: -1, label: '不投保'},
              {value: 0, label: '0'}
            ];
          }
          switch(item.riskState){
            case 0:
              if(item.riskCode != 'VESSEL_TAX'){
                ciArr.push(obj);
              }
              break;
            case 1:
              biArr.push(obj);
              break;
            case 2:
              if(item.riskCode != 'HT_HD_A_0006'){
                biAddArr.push(obj);
              }
              break;
            case 3:
              // _this.data.biSpecial.push(obj);
              break;
            case 4:
              obj.moneyOptions = [{value: -1, label: '不投保'}];
              item.riskAmount.some((itm,idx) => {
                let o = {
                  value: itm,
                  label: itm + '%'
                };
                obj.moneyOptions.push(o);
              });
              biMpArr.push(obj);
              break;
          }
        }
      });
      _this.data.ci = _this.utils.deepClone(ciArr);
      _this.data.bi = _this.utils.deepClone(biArr);
      _this.data.biAdd = _this.utils.deepClone(biAddArr);
      _this.data.biMp = _this.utils.deepClone(biMpArr);
    }

    _this.data.isLoadingRisks = false;
  }

  //获取试算的险种列表
  async getRisksByCalculation(params){
    const _this = this;
    _this.data.ci = [];
    _this.data.bi = [];
    _this.data.biAdd = [];
    _this.data.biSpecial = [];
    _this.data.biMp = [];
    _this.session.setState({
      loading: true
    });
    let risksDesc: any = [];
    risksDesc = await _this.insureApi.getRisksDesc();
    let res = await _this.insureApi.getRisksByCalculation(params);
    _this.session.setState({
      loading: false
    });
    let requiredRisks = _this.getRequiredRiskCode();
    if(res.resultCode == '0000000'){
      //向页面数组中装数据
      let listObjFn = (dataArr) => {
        let pageArr = [];
        dataArr.some(item => {
          let obj: any = {};
          obj = {
            id: item.riskCode,
            label: item.riskName,
            state: item.riskState,
            type: item.riskType,
            moneyId: -1,
            moneyOptions: [{value: -1, label: '不投保'}],
            premiums: [{value: -1, label: '--'}]
          };
          if(item.riskState == 0 || 
            item.riskCode == 'HT_HD_M_0001'){
            obj.isCheckbox = true;
            obj.checked = true;
          }
          item.riskAmount = item.riskAmount.split(",");
          item.riskAmount.some(itm => {
            let label: string = '';
            label = itm;
            if(item.riskState == 4){
              label = itm + '次';
            }
            if(item.riskState == 4){
              label = itm + '%';
            }
            if(item.riskState == 1 || item.riskState == 2){
              if(parseFloat(itm) >= 10000){
                label = (parseFloat(itm) / 10000) + '万';
              }else{
                label = _this.utils.formatMoney(itm, null);
              }
              if(parseFloat(itm) == 999){
                label = '共享主险保额';
                obj.hasShare = true;
                obj.share = false;
              }
            }
            let o = {
              value: parseFloat(itm), label: label
            };
            if(item.riskState == 0 || 
              item.riskCode == 'HT_HD_M_0001'){
              o.label = '投保';
            }
            if(item.riskState == 1 || item.riskState == 2){
              if(itm != 0 && parseFloat(itm) != 999){
                obj.moneyOptions.push(o);
              }
            }else{
              obj.moneyOptions.push(o);
            }
          });
          //必选险种
          requiredRisks.some(itm => {
            if(itm == item.riskCode && !!obj.moneyOptions[1]){
              obj.moneyId = obj.moneyOptions[1].value;
            }
          });
          if(item.riskCode == 'HT_HD_M_0002'){
            obj.moneyId = '1000000';
          }
          if(item.riskCode == 'VESSEL_TAX'){//车船税不可选择
            obj.moneyId = item.riskAmount;
            obj.disabled = true;
          }
          item.riskPremium = item.riskPremium.split(",");
          item.riskPremium.some(itm => {
            obj.premiums.push({
              value: itm, label: itm
            });
          });
          //险种说明
          if(risksDesc.length > 0){
            risksDesc.some(itm => {
              if(itm.riskCode == item.riskCode){
                obj.tooltip = itm.riskDesc;
                return true;
              }
            });
          }
          if(!_this.utils.hasValue(_this.data.companyCode) && obj.moneyOptions.length <= 1){
            obj.moneyId = '0';
            obj.moneyOptions = [
              {value: -1, label: '不投保'},
              {value: 0, label: '0'}
            ];
          }
          if(item.riskCode != 'VESSEL_TAX' && 
          item.riskCode != 'HT_HD_A_0006'){
            pageArr.push(obj);
          }
        });
        return pageArr;
      };

      let data = res.data;
      //交强险
      if(_this.utils.hasValue(data.forceRisk)){
        _this.data.ci = listObjFn(data.forceRisk);
      }
      //商业险主险
      if(_this.utils.hasValue(data.mainRisk)){
        _this.data.bi = listObjFn(data.mainRisk);
      }
      //商业险绝对免赔
      if(_this.utils.hasValue(data.absoluteRisk)){
        _this.data.biMp = listObjFn(data.absoluteRisk);
      }
      //商业险附加险
      if(_this.utils.hasValue(data.addRisk)){
        _this.data.biAdd = listObjFn(data.addRisk);
      }
      //商业险特约
      if(_this.utils.hasValue(data.specialRisk)){
        // _this.data.biSpecial = listObjFn(data.specialRisk);
      }

      _this.data.isLoadingRisks = false;
    }else{
      _this.message.create('error', res.resultMessage);
    }
  }

  //根据保司code获取保司名称
  getCompanyNameByCode(code) {
    const _this = this;
    let list = _this.session.state.companyList;
    let companyName = '';
    switch(code) {
      case 'PAIC':
        companyName = '平安保险';
        break;
      case 'ACIC':
        companyName = '人寿保险';
        break;
      case 'CPIC':
        companyName = '太平洋保险';
        break;
      case 'PICC':
        companyName = '人民保险';
        break;
    }
    return companyName;
  }

  //获取试算用户信息（只有试算流程才调用此函数）
  async getUserInfo() {
    const _this = this;
    let params = {
      teslaRn: _this.data.teslaRn.replace("-I","-T")
    };
    let res = await _this.insureApi.getUserInfo(params);
    if(res.resultCode == '0000000'){
      let data = res.data;
      //购买按钮是否可点击
      // if(_this.utils.hasValue(data.insurable) && parseInt(data.insurable) == 1){
      //   _this.data.insurable = true;
      //   _this.data.pageBottomBtn1Disabled = false;
      // }else{
      //   _this.data.insurable = false;
      //   _this.data.pageBottomBtn1Disabled = true;
      // }
      //历史记录
      if(_this.utils.hasValue(data.trialRecord) && data.trialRecord.length > 0){
        _this.data.historyBtnVisible = true;
        _this.data.historyList = [];
        data.trialRecord.some(item => {
          let obj = {
            companyCode: item.insurCode,
            companyName: _this.getCompanyNameByCode(item.insurCode),
            sumInsured: item.sumInsured,
            salePremium: item.salePremium,
            forceRisk: item.forceRisk,
            mainRisk: item.mainRisk,
            addRisk: item.addRisk,
            specialRisk: item.specialRisk,
            absoluteRisk: item.absoluteRisk
          };
          _this.data.historyList.push(obj);
        });
      }else{
        _this.data.historyBtnVisible = false;
      }
      //车辆信息
      if(_this.utils.hasValue(data.carInfo)){
        _this.data.carInfo = {
          ..._this.data.carInfo,
          carNo: data.carInfo.licenseNo || '',
          model: data.carInfo.modelDes,
          price: data.carInfo.vehiclePrice,
          city: data.carInfo.areaName
        };
        _this.data.city = data.carInfo.areaName;
      }
      //默认保司code
      if(_this.utils.hasValue(data.insurerCode)){
        _this.data.companyCode = data.insurerCode;
      }
    }
  }

  //正式投保时获取已有方案列表
  async getPlan() {
    const _this = this;
    let params = {
      teslaRn: _this.data.teslaRn.replace("-T","-I")
    };
    let res = await _this.insureApi.getPlan(params);
    if(res.resultCode == '0000000'){
      let data = res.data;
      console.log(data);
      //历史记录
      if(_this.utils.hasValue(data.trialRecord) && data.trialRecord.length > 0){
        _this.data.historyBtnVisible = true;
        _this.data.historyList = [];
        data.trialRecord.some(item => {
          let obj = {
            companyCode: item.insurCode,
            companyName: _this.getCompanyNameByCode(item.insurCode),
            sumInsured: item.sumInsured,
            salePremium: item.salePremium,
            forceRisk: item.forceRisk,
            mainRisk: item.mainRisk,
            addRisk: item.addRisk,
            specialRisk: item.specialRisk,
            absoluteRisk: item.absoluteRisk
          };
          _this.data.historyList.push(obj);
        });
      }else{
        _this.data.historyBtnVisible = false;
      }
    }
  }

  //获取特约条款(正式投保)
  async getSpecial() {
    const _this = this;
    let params = {
      businessOrderNo: _this.data.businessOrderNo,
      areaCode: _this.data.areaCode,
      insurCode: _this.data.companyCode
    };
    let res = await _this.insureApi.getSpecial(params);
    if(res.resultCode == '0000000'){
      let data = res.data;
      if(_this.utils.hasValue(data) && data.length > 0){
        data.some(item => {
          let label: string = '';
          _this.data.allRisks.some(itm => {
            if(itm.risk_code == item.riskCode){
              label = itm.risk_name;
              return true;
            }
          });
          let obj: any = {
            id: item.riskCode,
            label: label,
            state: 3,
            type: 2,
            moneyId: -1,
            moneyOptions: [{value: -1, label: '不选择'}]
          };
          item.optionNum = item.optionNum.split(",");
          item.optionNum.some(itm => {
            obj.moneyOptions.push({
              value: itm, 
              label: itm + '次'
            });
          });
          if(item.isChecked == "Y"){
            // obj.moneyOptions.splice(0, 1);
            obj.moneyOptions = [{
              value: item.defaultDisplayNum, 
              label: item.defaultDisplayNum + '次'
            }];
            obj.moneyId = item.defaultDisplayNum;
          }
          if(item.isShown == "Y"){
            _this.data.biSpecial.push(obj);
          }
        });
      }
    }else{
      _this.message.create('error', res.resultMessage);
    }
  }

  onBtn1() {
    const _this = this;
    const home = _this.home;
    if(home.data.businessType == 1){
      home.onNext();
    }else{
      // if(_this.data.insurable){
      //   home.onGoBuy();
      // }
      home.onCalculation();
    }
  }

  onBtn2() {
    const _this = this;
    const home = _this.home;
    if(home.data.businessType == 0){
      home.onCalculation();
    }else{
      home.onPre();
    }
  }

  //正式投保 下一步(报价)
  async onNext() {
    const _this = this;
    if(!_this.utils.hasValue(_this.data.companyCode)){
      _this.data.companyError = true;
      _this.message.create('error', '请选择保险公司');
      return false;
    }else{
      _this.data.companyError = false;
    }
    // if(!_this.data.clauseChecked){
    //   _this.message.create('warning', '您还未阅读并同意说明条款');
    //   return false;
    // }
    let riskFlag = _this.insureSelectValidate();
    if(!riskFlag){
      return false;
    }

    let riskList = _this.getSelectedRisks();
    if(riskList.length == 0){
      let errorInfo = '请至少选择一项险种';
      _this.message.create('warning', errorInfo);
      return false;
    }
    // let requiredList = _this.getRequiredRiskCode();
    // let requiredNum = 0;
    // riskList.some(item => {
    //   if(requiredList.indexOf(item.riskCode) > -1){
    //     requiredNum++;
    //   }
    // });
    // if(requiredNum < requiredList.length){
    //   _this.message.create('warning', '车辆损失险、第三者责任险、交强险是必选险种');
    //   return false;
    // }
    let biEndDate = _this.utils.dateToStringFormat(_this.data.biEndDate,'yyyymmddHHMMss');
    let endDate = _this.utils.dateToStringFormat(_this.data.ciEndDate,'yyyymmddHHMMss');
    if(_this.data.companyCode == 'PICC'){//人保
      let biEndY = biEndDate.substring(0,4),
          biEndM = biEndDate.substring(4,6),
          biEndD = biEndDate.substring(6,8),
          endY = endDate.substring(0,4),
          endM = endDate.substring(4,6),
          endD = endDate.substring(6,8),
          endH = endDate.substring(8,10);
      biEndD = parseInt(biEndD) - 1;
      biEndD = biEndD < 10?`0${biEndD}` : biEndD.toString();
      biEndDate = `${biEndY}${biEndM}${biEndD}240000`;
      if(endH == '00'){
        endD = parseInt(endD) - 1;
        endD = endD < 10?`0${endD}` : endD.toString();
        endDate = `${endY}${endM}${endD}240000`;
      }
    }
    let params: any = {
      teslaRn: _this.data.teslaRn.replace("-T","-I"),
      businessOrderNo: _this.data.businessOrderNo,
      areaCode: _this.data.areaCode,
      startDate: _this.utils.dateToStringFormat(_this.data.ciStartDate,'yyyymmddHHMMss'),
      endDate: endDate,
      biStartDate: _this.utils.dateToStringFormat(_this.data.biStartDate,'yyyymmddHHMMss'),
      biEndDate: biEndDate,
      insurFlag: _this.data.insurFlag,
      carInfo: _this.getCarInfoToQuote(),
      personList: _this.getPersonList(),
      insurCode: _this.data.companyCode,
      salePremium: _this.data.salePremium,
      // sumInsured: _this.data.sumInsured,
      riskList: riskList
    };
    if(_this.data.companyCode == 'PAIC'){
      params.isAllowRepeat = _this.data.isAllowRepeat;
    }

    //去除为空的字段参数
    Object.keys(params).forEach(key => {
      if(params[key] == null){
        delete params[key];
      }
    });

    // console.log(params);
    // return false;
    _this.session.setState({
      loading: true
    });
    let res = await _this.insureApi.quote(params);
    _this.session.setState({
      loading: false
    });
    if(res.resultCode == '0000000'){
      _this.session.setState({
        risks: res.data.riskList,
        areaCode: _this.data.areaCode,
        companyCode: _this.data.companyCode,
        businessOrderNo: _this.data.businessOrderNo,
        biStartTime: _this.data.biStartDate.getTime(),
        ciStartTime: _this.data.ciStartDate.getTime()
      });
      _this.router.navigate(['/layout/insure-confirm']);
    }else{
      _this.message.create('error', res.resultMessage);
    }
  }

  //将车辆信息对象组拼成报价接口需要的格式
  getCarInfoToQuote() {
    const _this = this;
    let carInfo = {
      ..._this.data.carInfo
    };
    carInfo.registerDate = carInfo.registerDate.replace(/-/g,"/");
    carInfo.registerDate = new Date(carInfo.registerDate);
    carInfo.registerDate = _this.utils.dateToStringFormat(carInfo.registerDate,'yyyymmddHHMMss');
    carInfo.modelName = carInfo.model;
    carInfo.uname = _this.session.state.owner.name;
    carInfo.uphone = _this.session.state.owner.phone;
    if(carInfo.isNew){
      if(!_this.utils.hasValue(carInfo.carNo)){
        carInfo.licenseNo = '新车';
      }else{
        carInfo.licenseNo = carInfo.carNo;
      }
    }else{
      carInfo.licenseNo = carInfo.carNo;
    }
    delete carInfo.businessOrderNo;
    delete carInfo.carInfo;
    delete carInfo.personList;
    delete carInfo.policyList;
    delete carInfo.riskList;

    //去除为空的字段参数
    Object.keys(carInfo).forEach(key => {
      if(carInfo[key] == null){
        delete carInfo[key];
      }
    });

    return carInfo;
  }

  //根据缓存数据组拼人员信息
  getPersonList() {
    const _this = this;
    //拼装对象
    const pushPersonList = (obj,utype) => {
      let newObj: any = {
        uphone: obj.phone,
        uname: obj.name,
        uemail: obj.email,
        ucertNo: obj.idNo,
        utype: utype,
        certType: '01',
        receiveMode: 1,
        address: '北京市骡马市大街18号中国再保险中心12层'
      };
      if(_this.data.areaCode == '110100'){//北京地区
        newObj = {
          ...newObj,
          address: obj.address,
          certiStartDate: _this.utils.dateToStringFormat(new Date(obj.idStartDate),'yyyymmdd'),
          certiEndDate: _this.utils.dateToStringFormat(new Date(obj.idEndDate),'yyyymmdd'),
          issuer: obj.institution,
          nation: obj.nation
        };
      }
      personList.push(newObj);
    };

    let personList: any = [];
    let owner = _this.session.state.owner;
    pushPersonList(owner,'owner');
    let policy = _this.session.state.policy;
    pushPersonList(policy,'holder');
    let insured = _this.session.state.insured;
    pushPersonList(insured,'insured');

    return personList;
  }

  //正式投保 上一步
  onPre() {
    const _this = this;
    _this.router.navigate(['/layout/info-confirm']);
  }

  //购买保险
  onGoBuy() {
    const _this = this;
    _this.session.setState({
      businessType: 1
    });
    _this.router.navigate(['/layout/info-confirm']);
  }

  //测算
  async onCalculation(){
    const _this = this;
    if(!_this.utils.hasValue(_this.data.companyCode)){
      _this.data.companyError = true;
      _this.message.create('error', '请选择保险公司');
      return false;
    }else{
      _this.data.companyError = false;
    }
    let riskFlag = _this.insureSelectValidate();
    if(!riskFlag){
      return false;
    }

    let riskList = _this.getSelectedRisks();
    if(riskList.length == 0){
      let errorInfo = '请至少选择一项险种';
      _this.message.create('warning', errorInfo);
      return false;
    }
    // let requiredList = _this.getRequiredRiskCode();
    // let requiredNum = 0;
    // riskList.some(item => {
    //   if(requiredList.indexOf(item.riskCode) > -1){
    //     requiredNum++;
    //   }
    // });
    // if(requiredNum < requiredList.length){
    //   _this.message.create('warning', '车辆损失险、第三者责任险、交强险是必选险种');
    //   return false;
    // }
    _this.data.salePremium = _this.utils.formatFloat(_this.data.salePremium, 2);
    let params = {
      teslaRn: _this.data.teslaRn.replace("-I","-T"),
      insurCode: _this.data.companyCode,
      salePremium: _this.data.salePremium,
      sumInsured: _this.data.sumInsured,
      riskList: riskList
    };
    _this.session.setState({
      loading: true
    });
    let res = await _this.insureApi.saveCalculation(params);
    _this.session.setState({
      loading: false
    });
    if(res.resultCode == '0000000'){
      _this.session.setState({
        risks: riskList,
        salePremium: _this.data.salePremium,
        sumInsured: _this.data.sumInsured,
        companyCode: _this.data.companyCode
      });
      _this.router.navigate(['/layout/insure-confirm']);
    }else{
      _this.message.create('error', res.resultMessage);
    }
  }

  //险种选择验证
  insureSelectValidate() {
    const _this = this;
    //结果
    let result: boolean = true;
    //错误信息
    let errorInfo: string = '';
    //车辆损失险是否被选择
    let lossFlag = false;
    //三者险是否被选择
    let threeFlag = false;
    //车责（司机）险是否被选择
    let driverFlag = false;
    //车责（乘客）险是否被选择
    let passengerFlag = false;
    _this.data.bi.some(item => {
      if(item.moneyId != -1){
        if(item.id == 'HT_HD_M_0001'){
          lossFlag = true;
        }
        if(item.id == 'HT_HD_M_0002'){
          threeFlag = true;
        }
        if(item.id == 'HT_HD_M_0003'){
          driverFlag = true;
        }
        if(item.id == 'HT_HD_M_0004'){
          passengerFlag = true;
        }
      }
    });

    let mainName = '',addName = '';
    _this.data.biAdd.some(item => {
      if(item.moneyId != -1){
        if(!lossFlag && result){
          mainName = '机动车损失保险';
          if(item.id == 'HT_HD_A_0005'){
            result = false;
            addName = '附加车身划痕损失险';
            return true;
          }
          if(item.id == 'HT_HD_A_0006'){
            result = false;
            addName = '附加车轮单独损失险';
            return true;
          }
        }
        if(!threeFlag && result){
          mainName = '机动车第三者责任保险';
          if(item.id == 'HT_HD_A_0016'){
            result = false;
            addName = '附加精神损害抚慰金责任险（三者）';
            return true;
          }
          if(item.id == 'HT_HD_A_0019'){
            result = false;
            addName = '附加医保外用药责任险（三者）';
            return true;
          }
        }
        if(!driverFlag && result){
          mainName = '机动车车上人员责任保险(司机)';
          if(item.id == 'HT_HD_A_0017'){
            result = false;
            addName = '附加精神损害抚慰金责任险（司机）';
            return true;
          }
          if(item.id == 'HT_HD_A_0020'){
            result = false;
            addName = '附加医保外用药责任险（司机）';
            return true;
          }
        }
        if(!passengerFlag && result){
          mainName = '机动车车上人员责任保险(乘客)';
          if(item.id == 'HT_HD_A_0018'){
            result = false;
            addName = '附加精神损害抚慰金责任险（乘客）';
            return true;
          }
          if(item.id == 'HT_HD_A_0021'){
            result = false;
            addName = '附加医保外用药责任险（乘客）';
            return true;
          }
        }
      }
    });

    _this.data.biMp.some(item => {
      if(item.moneyId != -1){
        if(!lossFlag && result){
          mainName = '机动车损失保险';
          if(item.id == 'HT_HD_A_0012'){
            result = false;
            addName = '附加绝对免赔率特约险（车损）';
            return true;
          }
        }
        if(!threeFlag && result){
          mainName = '机动车第三者责任保险';
          if(item.id == 'HT_HD_A_0013'){
            result = false;
            addName = '附加绝对免赔率特约险（三者）';
            return true;
          }
        }
        if(!driverFlag && result){
          mainName = '机动车车上人员责任保险(司机)';
          if(item.id == 'HT_HD_A_0014'){
            result = false;
            addName = '附加绝对免赔率特约险（车上人员司机）';
            return true;
          }
        }
        if(!passengerFlag && result){
          mainName = '机动车车上人员责任保险(乘客)';
          if(item.id == 'HT_HD_A_0015'){
            result = false;
            addName = '附加绝对免赔率特约险（车上人员乘客）';
            return true;
          }
        }
      }
    });

    _this.data.biSpecial.some(item => {
      if(item.moneyId != -1){
        if(!lossFlag && result){
          mainName = '机动车损失保险';
          if(item.id == 'HT_HD_A_0011'){
            result = false;
            addName = '附加发动机进水损坏除外特约条款';
            return true;
          }
        }
        if(!threeFlag && result){
          mainName = '机动车第三者责任保险';
        }
        if(!driverFlag && result){
          mainName = '机动车车上人员责任保险(司机)';
        }
        if(!passengerFlag && result){
          mainName = '机动车车上人员责任保险(乘客)';
        }
      }
    });

    if(!result){
      errorInfo = `选择${addName}前，要先选择${mainName}`;
      _this.message.create('warning', errorInfo);
    }
    return result;
  }

  //默认选择险种
  getRequiredRiskCode() {
    let arr: any = ['HT_HD_M_0001','HT_HD_M_0002','TRAFFIC_INS'];
    return arr;
  }

  //组装险种列表中选择的险种
  getSelectedRisks() {
    const _this = this;
    //总保费
    _this.data.salePremium = 0;
    //总保额
    _this.data.sumInsured = 0;
    let riskList = [];

    //获取要存储的单个险种的对象
    let getRiskListItem = (item) => {
      let obj = null;
      //共享主险保额
      if(!!item.share){
        item.moneyId = 999;
      }
      if(parseFloat(item.moneyId) !== -1){
        let index = 0;
        item.moneyOptions.some((itm,idx) => {
          if(itm.value == item.moneyId){
            index = idx;
            return true;
          }
        });
        let money:string | number = item.moneyId + "";
        if(money.indexOf("万") > -1){
          money = money.replace("万","0000");
        }
        money = parseFloat(money);
        if(item.state != 3 && item.state != 4){//不是特约和绝对免赔
          _this.data.sumInsured += money;
        }
        obj = {
          riskAmount: money,
          riskCode: item.id,
          riskState: item.state,
          riskName: item.label,
          riskType: item.type
        };
        if(_this.data.businessType == 0){
          let premiums = item.premiums[index].value;
          obj.riskPremium = premiums;
          if(obj.riskCode == 'TRAFFIC_INS'){//交强险
            obj.riskPremium = 950;
          }
          if(obj.riskPremium != -9999){
            _this.data.salePremium += parseFloat(obj.riskPremium);
          }
        }
      }
      return obj;
    };
    
    //主险
    _this.data.bi.some(item => {
      let obj = getRiskListItem(item);
      if(_this.utils.hasValue(obj)){
        riskList.push(obj);
      }
    });
    //附加险
    _this.data.biAdd.some(item => {
      let obj = getRiskListItem(item);
      if(_this.utils.hasValue(obj)){
        riskList.push(obj);
      }
    });
    //不计免赔
    _this.data.biMp.some(item => {
      let obj = getRiskListItem(item);
      if(_this.utils.hasValue(obj)){
        riskList.push(obj);
      }
    });
    //特约
    _this.data.biSpecial.some(item => {
      let obj = getRiskListItem(item);
      if(_this.utils.hasValue(obj)){
        riskList.push(obj);
      }
    });
    //交强险
    _this.data.ci.some(item => {
      let obj = getRiskListItem(item);
      if(_this.utils.hasValue(obj)){
        riskList.push(obj);
      }
    });

    return riskList;
  }

  //选择历史记录
  onSelectHistory(key) {
    const _this = this;
    const home = _this.home;
    if(_this.utils.hasValue(_this.data.checkedKey)){
      home.setRisksByHistory(key);
      home.data.isSelectHistory = true;
    }else{
      home.message.create('warning', '请选择一个历史方案记录');
    }
  }

  //根据历史记录设置险种列表的值
  setRisksByHistory(key) {
    const _this = this;
    if(_this.utils.hasValue(key)){
      const setData = (pageArr,dataArr) => {
        pageArr = pageArr.map(item => {
          dataArr.some(itm => {
            if(item.id == itm.riskCode){
              let amount: any = itm.riskAmount;
              item.moneyId = parseFloat(amount);
              if(_this.data.businessType == 1){
                if(item.id == 'HT_HD_M_0001' || item.id == 'TRAFFIC_INS'){
                  item.moneyId = 0;
                }
              }
            }
          });
          return item;
        });
      };

      //设置险种的值
      const setRiskDataByCalculation = (data) => {
        //交强险
        if(_this.utils.hasValue(data.forceRisk)){
          let hasJQ = false;//有无交强险
          data.forceRisk.some(item => {
            if(item.riskCode == 'TRAFFIC_INS'){
              hasJQ = true;
              return true;
            }
          });
          if(!hasJQ){
            _this.data.ci = _this.data.ci.map(item => {
              if(item.id == 'TRAFFIC_INS'){
                item.moneyId = -1;
              }
              return item;
            });
          }
          setData(_this.data.ci,data.forceRisk);
        }else{
          _this.data.ci = _this.data.ci.map(item => {
            if(item.id == 'TRAFFIC_INS'){
              item.moneyId = -1;
            }
            return item;
          });
        }
        //商业险主险
        if(_this.utils.hasValue(data.mainRisk)){
          let hasCS = false;//有无车损险
          let hasThird = false;//有无三者险
          data.mainRisk.some(item => {
            if(item.riskCode == 'HT_HD_M_0001'){
              hasCS = true;
            }
            if(item.riskCode == 'HT_HD_M_0002'){
              hasThird = true;
            }
          });
          if(!hasCS){
            _this.data.bi = _this.data.bi.map(item => {
              if(item.id == 'HT_HD_M_0001'){
                item.moneyId = -1;
              }
              return item;
            });
          }
          if(!hasThird){
            _this.data.bi = _this.data.bi.map(item => {
              if(item.id == 'HT_HD_M_0002'){
                item.moneyId = -1;
              }
              return item;
            });
          }
          setData(_this.data.bi,data.mainRisk);
        }else{
          _this.data.bi = _this.data.bi.map(item => {
            if(item.id == 'HT_HD_M_0001' || item.id == 'HT_HD_M_0002'){
              item.moneyId = -1;
            }
            return item;
          });
        }
        //商业险附加险
        if(_this.utils.hasValue(data.addRisk)){
          setData(_this.data.biAdd,data.addRisk);
        }
        //商业险特约
        if(_this.utils.hasValue(data.specialRisk)){
          // setData(_this.data.biSpecial,data.specialRisk);
        }
        //商业险绝对免赔
        if(_this.utils.hasValue(data.absoluteRisk)){
          setData(_this.data.biMp,data.absoluteRisk);
        }
      };

      _this.session.setState({
        loading: true
      });
      const data = _this.utils.deepClone(_this.data.historyList[key]);
      _this.data.historyLoading = true;
      _this.data.companyCode = data.companyCode;
      _this.data.salePremium = data.salePremium;
      _this.data.sumInsured = data.sumInsured;
      _this.data.isLoadingRisks = true;
      _this.getRisks();
      // if(_this.data.businessType == 0){
        let timeId = setInterval(() => {
          if(!_this.data.isLoadingRisks){
            setRiskDataByCalculation(data);
            _this.data.historyLoading = false;
            clearInterval(timeId);
            _this.session.setState({
              loading: false
            });
          }
        },1000);
      // }else{
      //   setRiskDataByCalculation(data);
      //   _this.data.historyLoading = false;
      // }
      _this.data.historyModalVisible = false;
    }
  }

  //关闭历史记录弹出窗
  onCloseHistoryModal() {
    const _this = this;
    _this.data.historyModalVisible = false;
    if(!_this.data.isSelectHistory){
      _this.appHistoryList.data.checkedKey = null;
    }
  }

}
