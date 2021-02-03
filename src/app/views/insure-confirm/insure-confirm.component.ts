import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '@app/services/utils.service';
import { SessionService } from '@app/services/session.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { InsureService } from '@app/api/insure.service';

@Component({
  selector: 'app-insure-confirm',
  templateUrl: './insure-confirm.component.html',
  styleUrls: ['./insure-confirm.component.scss']
})
export class InsureConfirmComponent implements OnInit {

  //加载子组件dom
  @ViewChild('appHistoryList') appHistoryList:any;

  constructor(
    public router: Router,
    public message: NzMessageService,
    public utils:UtilsService,
    public session:SessionService,
    public insureApi: InsureService
  ) { }

  public data:any = {
    //设备类型 0:PC 1:Pad 2:Mobile
    device: this.session.state.device,
    //业务类型 0：试算 1：正式投保
    businessType: this.session.state.businessType,
    teslaRn: this.session.state.teslaRn,
    nzOffset: 2,
    contentGutter: 24,
    ownerInfo: {},
    carInfo: {},
    //地区编码
    areaCode: '',
    companyCode: '',
    companyName: '',
    //商业险主险
    bi: [],
    //绝对免赔
    biMp: [],
    //商业险附加险
    biAdd: [],
    //特约条款
    biSpecial: [],
    ci: [],
    biMoney: 0,
    ciMoney: 0,
    pageBottomBtn1Label: '',
    pageBottomBtn2Label: '',
    historyBtnVisible: false,
    historyModalVisible: false,
    historyList: [],
    //车辆价格
    carPrice: 0,
    //总保费
    salePremium: '',
    //总保额
    sumInsured: '',
    //业务流水号
    businessOrderNo: '',
    //是否有底部条款
    hasClause: false,
    //是否同意底部条款
    clauseChecked: false,
    //是否有底部说明
    hasExplain: false,
    //底部说明文字
    explainTxt: '',
    //商业险生效时间
    biStartTime: '',
    //交强险生效时间
    ciStartTime: '',
    //是否显示电机号、车架号
    hasVin: false,
    //购买按钮是否可点击
    insurable: false,
    pageBottomBtn1Disabled: false,
    //是否选择了历史记录
    isSelectHistory: false
  };

  private home:any;

  ngOnInit(): void {
    const _this = this;
    _this.utils.backPageTop();
    _this.session.setState({
      title: '投保确认',
      headerTitle: '保险服务'
    });
    _this.data.salePremium = _this.session.state.salePremium;
    if(_this.data.businessType == 0){
      _this.data.pageBottomBtn1Label = '购买保险';
      _this.data.pageBottomBtn2Label = '返回修改保单';
      _this.data.hasClause = false;
      _this.data.hasExplain = true;
      _this.data.explainTxt = '此价格为试算价格，仅供参考，实际投保价格以保司核保结果为准';
      _this.getUserInfo();
    }else{
      _this.data.pageBottomBtn1Label = '确认投保';
      _this.data.pageBottomBtn2Label = '返回修改保单';
      _this.data.hasClause = true;
      _this.data.hasVin = true;
      // let biStartTime = _this.session.state.biStartTime;
      // biStartTime = new Date(parseInt(biStartTime));
      // _this.data.biStartTime = _this.utils.dateToStringFormat(biStartTime,'mm/dd/yyyy HH:MM:ss');
      // let ciStartTime = _this.session.state.ciStartTime;
      // ciStartTime = new Date(parseInt(ciStartTime));
      // _this.data.ciStartTime = _this.utils.dateToStringFormat(ciStartTime,'mm/dd/yyyy HH:MM:ss');
      _this.getBasicInfo(() => {
        _this.getOrderDetail();
      });
      // _this.getPlan();
    }
  }

  ngDoCheck() {
    const _this = this;
    let screenWidth = _this.session.state.screenWidth;
    if(screenWidth < 1000){
      _this.data.nzOffset = 0;
      _this.data.contentGutter = 48;
    }else{
      _this.data.nzOffset = 2;
      _this.data.contentGutter = 24;
    }
  }

  //请求获取基本信息(正式投保)
  async getBasicInfo(callback) {
    const _this = this;
    let params = {
      teslaRn: _this.data.teslaRn.replace("-T","-I")
    };
    let res = await _this.insureApi.getBasicInfo(params);
    if(res.resultCode == '0000000'){
      let data = res.data;
      if(!_this.utils.hasValue(data)){
        callback();
        return false;
      }
      _this.data.areaCode = data.areaCode;
      //车辆信息
      if(_this.utils.hasValue(data.carInfo)){
        _this.data.carInfo = {
          ..._this.data.carInfo,
          ...data.carInfo,
          model: data.carInfo.modelDes,
          price: data.vehiclePrice,
          city: data.areaName,
          carNo: (!!_this.session.state.carInfo && !!_this.session.state.carInfo.carNo)?_this.session.state.carInfo.carNo:'',
          vinNo: data.carInfo.vinNo,
          engineNo: data.carInfo.engineNo
        };
        _this.data.carPrice = data.vehiclePrice;
        // delete _this.data.carInfo.engineNo;
      }
      //基础信息
      _this.data.city = data.areaName;
      if(_this.utils.hasValue(_this.session.state.businessOrderNo)){
        _this.data.businessOrderNo = _this.session.state.businessOrderNo;
      }else{
        _this.data.businessOrderNo = data.businessOrderNo;
      }
    }
    callback();
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
      //历史记录
      if(_this.utils.hasValue(data.trialRecord) && data.trialRecord.length > 0){
        // _this.data.historyBtnVisible = true;
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
        //获取最近的历史记录信息
        _this.setRisksByHistory(0);
      }else{
        _this.data.historyBtnVisible = false;
      }
    }
  }

  //获取缓存中的险种列表（正式投保时调用）
  async setRisksByOrderDetail(risks) {
    const _this = this;
    _this.data.ci = [];
    _this.data.bi = [];
    _this.data.biAdd = [];
    _this.data.biSpecial = [];
    // let params = {
    //   areaCode: _this.data.areaCode,
    //   insurCode: _this.data.companyCode
    // };
    // let allRisks: any = await _this.insureApi.getAllRisks(params);
    // allRisks = allRisks.data;
    if(_this.utils.hasValue(risks) && risks.length > 0){
      //商业险保费
      let biPremium = 0;
      //交强险保费
      let ciPremium = 0;

      let listObjFn = (item,pageArr) => {
        let amount: any = !!item.riskAmount?item.riskAmount:"0";
        let price: any = '￥' + _this.utils.formatMoney(item.riskPremium, 2);
        if(item.riskCode == 'HT_HD_M_0001' && _this.data.carPrice > 0){
          amount = _this.data.carPrice;
        }
        if(item.riskState == 1 || item.riskState == 2){
          amount = parseFloat(amount);
          if(amount >= 10000) {
            amount = (amount / 10000) + '万';
          }
          if(amount == 999) {
            amount = '共享主险保额';
          }
        }
        if(item.riskState == 3){
          //太保的代为送检为0时，次数定死为1
          if(_this.data.companyCode == 'CPIC' && 
          item.riskCode == 'HT_HD_A_0010' && amount == 0){
            amount = 1;
          }
          amount = amount + "";
          if(amount.indexOf("公里") == -1){
            amount = amount + '次';
          }
          // if(item.riskPremium == 0){
          //   price = '未匹配到数据';
          // }
        }
        if(item.riskPremium == -9999){
          price = '该险种不可投保';
        }
        let obj = {
          code: item.riskCode,
          label: item.riskName,
          money: amount,
          price: price,
          priceFloat: parseFloat(item.riskPremium),
          state: item.riskState
        };
        pageArr.push(obj);
      };

      risks.some(item => {
        // allRisks.some(itm => {
        //   if(itm.riskCode == item.riskCode){
        //     item.riskState = itm.riskState;
        //     return true;
        //   }
        // });
        item.riskPremium = !!item.riskPremium?item.riskPremium:0;
        item.riskPremium = _this.utils.formatFloat(item.riskPremium, 2);
        switch(parseInt(item.riskState)){
          //交强
          case 0:
            if(item.riskPremium != -9999){
              ciPremium += parseFloat(item.riskPremium);
            }
            if(item.riskCode != 'VESSEL_TAX'){
              listObjFn(item, _this.data.ci);
            }
            break;
          //主险
          case 1:
            if(item.riskPremium != -9999){
              biPremium += parseFloat(item.riskPremium);
            }
            listObjFn(item, _this.data.bi);
            break;
          //附加险
          case 2:
            if(item.riskPremium != -9999){
              biPremium += parseFloat(item.riskPremium);
            }
            listObjFn(item, _this.data.biAdd);
            break;
          //特约
          case 3:
            if(item.riskPremium != -9999){
              biPremium += parseFloat(item.riskPremium);
            }
            listObjFn(item, _this.data.biSpecial);
            break;
          //绝对免赔
          case 4:
            if(item.riskPremium != -9999){
              biPremium += parseFloat(item.riskPremium);
            }
            listObjFn(item, _this.data.biMp);
            let biCode = '';
            if(item.riskCode == 'HT_HD_A_0012'){
              biCode = 'HT_HD_M_0001';
            }
            if(item.riskCode == 'HT_HD_A_0013'){
              biCode = 'HT_HD_M_0002';
            }
            if(item.riskCode == 'HT_HD_A_0014'){
              biCode = 'HT_HD_M_0003';
            }
            if(item.riskCode == 'HT_HD_A_0015'){
              biCode = 'HT_HD_M_0004';
            }
            _this.data.bi = _this.data.bi.map(itm => {
              if(itm.code == biCode){
                itm.mp = item.riskAmount + '%';
                itm.price = parseFloat(itm.priceFloat) + parseFloat(item.riskPremium);
                itm.price = '￥' + _this.utils.formatMoney(itm.price, 2);
              }
              return itm;
            });
            break;
        }
      });

      _this.data.ciMoney = _this.utils.formatMoney(ciPremium, 2);
      _this.data.biMoney = _this.utils.formatMoney(biPremium, 2);
      let salePremium = ciPremium + biPremium;
      _this.data.salePremium = _this.utils.formatMoney(salePremium, 2);
    }
  }

  //获取保单详情
  async getOrderDetail() {
    const _this = this;
    let businessOrderNo = _this.session.state.businessOrderNo;
    let params = {
      businessOrderNo: businessOrderNo
    };
    _this.session.setState({
      loading: true
    });
    let res = await _this.insureApi.getOrderDetail(params);
    _this.session.setState({
      loading: false
    });
    if(res.resultCode == '0000000'){
      let data = res.data;
      //保单信息
      if(_this.utils.hasValue(data.policyList) && data.policyList.length > 0){
        data.policyList.some(item => {
          //保单状态
          let policyStatus = item.policyStatus;
          if(_this.utils.hasValue(policyStatus)){
            _this.session.setState({
              policyStatus: policyStatus
            });
          }
          //生效时间
          if(item.policyType == 1){//交强
            _this.data.ciStartTime = item.startDate;
          }else{//商业
            _this.data.biStartTime = item.startDate;
          }
        });
      }
      //车辆信息
      if(_this.utils.hasValue(data.carInfo)){
        _this.data.areaCode = data.carInfo.areaCode;
        _this.data.companyCode = data.carInfo.insurCode;
        _this.getCompanyList(_this.data.companyCode);
      }
      //险种列表
      if(_this.utils.hasValue(data.riskList) && data.riskList.length > 0){
        _this.setRisksByOrderDetail(data.riskList);
      }
      //车主信息
      if(_this.utils.hasValue(data.personList) && data.personList.length > 0){
        data.personList.some(item => {
          if(item.utype == 'owner'){
            _this.data.ownerInfo = {
              ..._this.data.ownerInfo,
              name: item.uname.replace(" ",""),
              idNo: item.ucertNo,
              phone: item.uphone,
              email: item.uemail
            };
            if(_this.data.areaCode == '110100'){//北京
              let idStartDate = '',idEndDate = '',nation = '',institution = '',address = '';
              try{
                idStartDate = _this.session.state.owner.idStartDate;
                if(_this.utils.hasValue(idStartDate)){
                  idStartDate = _this.utils.dateToStringFormat(new Date(idStartDate),'mm/dd/yyyy');
                }else{
                  idStartDate = '';
                }
                idEndDate = _this.session.state.owner.idEndDate;
                if(_this.utils.hasValue(idEndDate)){
                  idEndDate = _this.utils.dateToStringFormat(new Date(idEndDate),'mm/dd/yyyy');
                }else{
                  idEndDate = '';
                }
                address = _this.session.state.owner.address;
                nation = _this.session.state.owner.nation;
                institution = _this.session.state.owner.institution;
              }catch(error){
                console.log(error);
              }
              _this.data.ownerInfo = {
                ..._this.data.ownerInfo,
                idStartDate: idStartDate,
                idEndDate: idEndDate,
                address: item.uaddress || address,
                nation: nation,
                institution: institution
              };
            }
            return true;
          }
        });
      }
    }
  }

  //根据保司code获取保司名称
  getCompanyNameByCode(code) {
    const _this = this;
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

  //根据保司code获取保司名称
  getCompanyNameByCode2(list, code) {
    const _this = this;
    let companyName = '';
    list.some(item => {
      if(item.insurCode == code){
        companyName = item.insurName;
        return true;
      }
    });
    return companyName;
  }

  //获取保司列表
  async getCompanyList(companyCode) {
    const _this = this;
    let params = {
      teslaRn: _this.session.state.teslaRn,
      areaCode: _this.data.areaCode
    };
    let res = await _this.insureApi.getCompanyList(params);
    if(res.resultCode == '0000000'){
      _this.data.companyName = _this.getCompanyNameByCode2(res.data, companyCode);
    }
  }

  //获取用户信息(测算的)
  async getUserInfo() {
    const _this = this;
    let params = {
      teslaRn: _this.data.teslaRn.replace("-I","-T")
    };
    let res = await _this.insureApi.getUserInfo(params);
    if(res.resultCode == '0000000'){
      let data = res.data;
      //保单状态
      let policyStatus = _this.session.state.policyStatus;
      //购买按钮是否可点击
      if(_this.utils.hasValue(data.insurable) && parseInt(data.insurable) == 1){
        if(_this.utils.hasValue(policyStatus) && policyStatus >= 3){
          _this.data.insurable = false;
          _this.data.pageBottomBtn1Disabled = true;
        }else{
          _this.data.insurable = true;
          _this.data.pageBottomBtn1Disabled = false;
        }
      }else{
        _this.data.insurable = false;
        _this.data.pageBottomBtn1Disabled = true;
      }
      //车辆信息
      if(_this.utils.hasValue(data.carInfo)){
        _this.data.carInfo = {
          ..._this.data.carInfo,
          ...data.carInfo,
          carNo: data.carInfo.licenseNo || '',
          model: data.carInfo.modelDes,
          price: data.carInfo.vehiclePrice,
          city: data.carInfo.areaName
        };
        _this.data.carPrice = data.carInfo.vehiclePrice;
        _this.data.areaCode = data.carInfo.areaCode;
        _this.data.city = data.carInfo.areaName;
      }
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
        //获取最近的历史记录信息
        _this.setRisksByHistory(0);
      }else{
        _this.data.historyBtnVisible = false;
      }
    }
  }

  onBtn1() {
    const _this = this;
    const home = _this.home;
    if(home.data.businessType == 0){
      home.onGoBuy();
    }else{
      home.onExamine();
    }
  }

  onBtn2() {
    const _this = this;
    const home = _this.home;
    if(home.data.businessType == 0){
      home.onResetRisks();
    }else{
      home.onCancel();
    }
  }

  //选择历史记录
  onSelectHistory(key) {
    const _this = this;
    const home = _this.home;  //此文件本身的this
    if(_this.utils.hasValue(_this.data.checkedKey)){
      home.setRisksByHistory(key);
      home.data.isSelectHistory = true;
    }else{
      home.message.create('warning', '请选择一个历史方案记录');
    }
  }

  //根据历史记录设置数据列表
  setRisksByHistory(key) {
    const _this = this;
    _this.data.ci = [];
    _this.data.bi = [];
    _this.data.biAdd = [];
    _this.data.biSpecial = [];
    if(_this.utils.hasValue(key)){
      const setData = (pageArr,dataArr) => {
        dataArr.some(item => {
          item.riskPremium = !!item.riskPremium?item.riskPremium:0;
          if(item.riskPremium != -9999){
            if(item.riskState == 0){
              ciMoney += parseFloat(item.riskPremium);
            }else{
              biMoney += parseFloat(item.riskPremium);
            }
          }
          if(item.riskState == 1 || item.riskState == 2){
            if(item.riskCode == 'HT_HD_M_0001' && _this.data.carPrice > 0){
              item.riskAmount = _this.data.carPrice;
            }
            if(parseFloat(item.riskAmount) >= 10000){
              item.riskAmount = (parseFloat(item.riskAmount) / 10000) + '万';
            }
            if(parseFloat(item.riskAmount) == 999){
              item.riskAmount = '共享主险保额';
            }
          }
          
          if(item.riskState == 4){
            let biCode = '';
            if(item.riskCode == 'HT_HD_A_0012'){
              biCode = 'HT_HD_M_0001';
            }
            if(item.riskCode == 'HT_HD_A_0013'){
              biCode = 'HT_HD_M_0002';
            }
            if(item.riskCode == 'HT_HD_A_0014'){
              biCode = 'HT_HD_M_0003';
            }
            if(item.riskCode == 'HT_HD_A_0015'){
              biCode = 'HT_HD_M_0004';
            }
            pageArr = pageArr.map(itm => {
              if(itm.code == biCode){
                itm.mp = item.riskAmount + '%';
                itm.price = parseFloat(itm.priceFloat) + parseFloat(item.riskPremium);
                itm.price = '￥' + _this.utils.formatMoney(itm.price, 2);
              }
              return itm;
            });            
          }
          let obj = {
            code: item.riskCode,
            label: item.riskName,
            money: item.riskAmount,
            priceFloat: parseFloat(item.riskPremium),
            price: '￥' + _this.utils.formatMoney(item.riskPremium, 2),
            state: item.riskState
          };
          if(item.riskState == 3){
            //太保的代为送检为0时，次数定死为1
            if(_this.data.companyCode == 'CPIC' && 
            obj.code == 'HT_HD_A_0010' && obj.money == 0){
              obj.money = 1;
            }
            obj.money = obj.money + "";
            if(obj.money.indexOf("公里") == -1){
              obj.money = obj.money + "次";
            }
          }
          if(item.riskPremium == 0){
            obj.price = '未匹配到数据';
          }
          if(item.riskPremium == -9999){
            obj.price = '该险种不可投保';
          }
          if(item.riskState == 4){
            _this.data.biMp.push(obj);
          }else{
            if(item.riskCode != 'VESSEL_TAX'){
              pageArr.push(obj);
            }
          }

          let riskObj = {
            riskPremium: item.riskPremium,
            riskAmount: item.riskAmount,
            riskCode: item.riskCode,
            riskState: item.riskState,
            riskName: item.riskName
          };
          riskList.push(riskObj);
        });
      };

      //设置险种的值
      const setRiskDataByCalculation = (data) => {
        //交强险
        if(_this.utils.hasValue(data.forceRisk)){
          setData(_this.data.ci,data.forceRisk);
        }
        //商业险主险
        if(_this.utils.hasValue(data.mainRisk)){
          setData(_this.data.bi,data.mainRisk);
        }
        //商业险附加险
        if(_this.utils.hasValue(data.addRisk)){
          setData(_this.data.biAdd,data.addRisk);
        }
        //商业险特约
        if(_this.utils.hasValue(data.specialRisk)){
          setData(_this.data.biSpecial,data.specialRisk);
        }
        //商业险绝对免赔
        if(_this.utils.hasValue(data.absoluteRisk)){
          setData(_this.data.bi,data.absoluteRisk);
        }
      };

      _this.session.setState({
        loading: true
      });
      const data = _this.utils.deepClone(_this.data.historyList[key]);
      _this.data.companyCode = data.companyCode;
      _this.data.companyName = _this.getCompanyList(_this.data.companyCode);
      _this.data.salePremium = _this.utils.formatMoney(data.salePremium, 2);
      _this.data.sumInsured = data.sumInsured;
      let riskList = [];
      let biMoney = 0,ciMoney = 0;
      setRiskDataByCalculation(data);
      _this.data.historyModalVisible = false;
      _this.data.biMoney = _this.utils.formatMoney(biMoney, 2);
      _this.data.ciMoney = _this.utils.formatMoney(ciMoney, 2);
      _this.session.setState({
        loading: false,
        risks: riskList,
        salePremium: _this.data.salePremium,
        sumInsured: _this.data.sumInsured,
        companyCode: _this.data.companyCode
      });
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

  //购买保险
  onGoBuy() {
    const _this = this;
    if(!_this.data.insurable){
      return false;
    }
    //获取要存储的单个险种的对象
    let getRiskListItem = (item) => {
      let obj = null;
      obj = {
        riskPremium: item.price.substring(1),
        riskAmount: item.money,
        riskCode: item.code,
        riskState: item.state,
        riskName: item.label
      };
      return obj;
    };

    let riskList = [];
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
    _this.session.setState({
      businessType: 1,
      risks: riskList,
      salePremium: _this.data.salePremium,
      sumInsured: _this.data.sumInsured,
      companyCode: _this.data.companyCode
    });
    _this.router.navigate(['/layout/info-confirm']);
  }

  //重新选择保险
  onResetRisks() {
    const _this = this;
    _this.session.setState({
      businessType: 0
    });
    _this.router.navigate(['/layout/insure-select']);
  }

  //核保
  async onExamine() {
    const _this = this;
    // if(!_this.data.clauseChecked){
    //   _this.message.create('warning', '您还未阅读并同意说明条款');
    //   return false;
    // }
    //回溯code
    let traceableCode: any = _this.session.state.traceableCode;
    if(!_this.utils.hasValue(traceableCode) && (<any>window).VILog0001){
      traceableCode = (<any>window).VILog0001();
    }
    let params = {
      businessOrderNo: _this.data.businessOrderNo,
      insurCode: _this.data.companyCode,
      traceableCode: traceableCode
    };
    _this.session.setState({
      loading: true,
      salePremium: _this.data.salePremium
    });
    let res = await _this.insureApi.examine(params);
    _this.session.setState({
      loading: false
    });
    if(res.resultCode == '0000000' || res.resultCode == '0000001'){
      if(_this.utils.hasValue(res.data.veriDigit)){
        let veriDigit = res.data.veriDigit;
        if(veriDigit > 0){
          if(veriDigit == 2 && _this.data.companyCode == 'GPIC'){
            _this.message.create('success', '恭喜您核保成功');
          }else{
            _this.router.navigate(['/layout/verify-success']);
          }
        }else{
          if(_this.data.companyCode == 'PICC'){//人保
            _this.router.navigate(['/layout/verify-success']);
            return false;
          }
          if(_this.utils.hasValue(res.data.payUrl)){
            window.location.href = res.data.payUrl;
          }else{
            if(_this.utils.hasValue(res.data.electronicPolicySigningH5)){
              window.location.href = res.data.electronicPolicySigningH5;
            }
          }
        }
      }else{
        _this.router.navigate(['/layout/verify-success']);
      }
    }else{
      _this.session.setState({
        examineError: res.resultMessage
      });
      _this.router.navigate(['/layout/verify-fail']);
    }
  }

  //取消
  onCancel() {
    const _this = this;
    _this.session.setState({
      businessType: 1
    });
    _this.router.navigate(['/layout/insure-select']);
  }

}
