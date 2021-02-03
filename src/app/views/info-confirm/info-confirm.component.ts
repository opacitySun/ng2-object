import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '@app/services/utils.service';
import { SessionService } from '@app/services/session.service';
import { faChevronRight, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '@app/api/user.service';
import { InsureService } from '@app/api/insure.service';

@Component({
  selector: 'app-info-confirm',
  templateUrl: './info-confirm.component.html',
  styleUrls: ['./info-confirm.component.scss']
})
export class InfoConfirmComponent implements OnInit {

  constructor(
    public router: Router,
    public message: NzMessageService,
    public utils:UtilsService,
    public session:SessionService,
    public userApi: UserService,
    public insureApi: InsureService
  ) { }

  public data:any = {
    //设备类型 0:PC 1:Pad 2:Mobile
    device: this.session.state.device,
    teslaRn: this.session.state.teslaRn,
    iconRight: faChevronRight,
    iconPlus: faPlusCircle,
    iconMinus: faMinusCircle,
    nzOffset: 2,
    contentGutter: 24,
    //地区编码
    areaCode: '',
    carInfo: {
      isNew: true
    },
    nations: null,
    //车主
    ownerVisible: true,
    owner: {
      name: '',
      phone: '',
      email: '',
      idNo: '',
      nation: '汉族',
      idStartDate: '',
      idEndDate: '',
      institution: '',
      address: ''
    },
    //投保人
    policyVisible: false,
    policy: {
      sameOwner: true,
      name: '',
      phone: '',
      email: '',
      idNo: '',
      nation: '汉族',
      idStartDate: '',
      idEndDate: '',
      institution: '',
      address: ''
    },
    //被保人
    insuredVisible: false,
    insured: {
      sameOwner: true,
      name: '',
      phone: '',
      email: '',
      idNo: '',
      nation: '汉族',
      idStartDate: '',
      idEndDate: '',
      institution: '',
      address: ''
    },
    tipsModalVisible: true,
    pageBottomBtn2Disabled: false
  };

  private home:any;

  ngOnInit(): void {
    const _this = this;
    _this.utils.backPageTop();
    _this.getNations();
    const isFirstIn = _this.session.state.isFirstIn;
    if(isFirstIn){
      _this.session.setState({
        isFirstIn: false,
        tipsVisible: true
      });
    }
    _this.session.setState({
      title: '信息确认',
      headerTitle: '保险'
    });
    //判断如果是试算的Rn号，则转换为投保的Rn号
    if(_this.data.teslaRn.indexOf("-T") > -1){
      let teslaRn = _this.data.teslaRn.replace("-T","-I");
      _this.data.teslaRn = teslaRn;
      _this.session.setState({
        teslaRn: teslaRn
      });
    }
    //判断如果是直接进入的投保流程，则此页的上一步按钮不可点击
    if(_this.session.state.initBusinessType == 1){
      _this.data.pageBottomBtn2Disabled = true;
    }
    //从缓存中拿取车主、投保人、被保人数据
    _this.getPersonInfoByStorage();
    //保单状态
    let policyStatus = _this.session.state.policyStatus;
    if(_this.utils.hasValue(policyStatus)) {
      _this.getOrderDetail();
    }else{
      _this.getBasicInfo();
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
    //投保人同车主
    if(_this.data.policy.sameOwner){
      _this.data.policy = {
        ..._this.data.policy,
        ..._this.data.owner
      };
    }
    //被保人同车主
    if(_this.data.insured.sameOwner){
      _this.data.insured = {
        ..._this.data.insured,
        ..._this.data.owner
      };
    }
    //是否新车
    if(_this.data.carInfo.isNew){
      _this.data.carInfo.carNo = '新车';
    }else{
      if(_this.data.carInfo.carNo == '新车'){
        _this.data.carInfo.carNo = '';
      }
    }
  }

  //获取民族列表
  async getNations() {
    const _this = this;
    let res = await _this.insureApi.getNations();
    _this.data.nations = _this.utils.deepClone(res);
  }

  //从缓存中拿取车主、投保人、被保人数据
  getPersonInfoByStorage(){
    const _this = this;
    const owner = _this.session.state.owner;
    const policy = _this.session.state.policy;
    const insured = _this.session.state.insured;
    if(_this.utils.hasValue(owner)){
      _this.data.owner = {
        ..._this.data.owner,
        name: owner.name || '',
        phone: owner.phone || '',
        email: owner.email || '',
        idNo: owner.idNo || '',
        nation: owner.nation || '',
        idStartDate: !!owner.idStartDate?_this.utils.dateToStringFormat(new Date(owner.idStartDate),'yyyy-mm-dd'):'',
        idEndDate: !!owner.idEndDate?_this.utils.dateToStringFormat(new Date(owner.idEndDate),'yyyy-mm-dd'):'',
        institution: owner.institution || '',
        address: owner.address || ''
      };
    }
    if(_this.utils.hasValue(policy)){
      _this.data.policy = {
        ..._this.data.policy,
        name: policy.name || '',
        phone: policy.phone || '',
        email: policy.email || '',
        idNo: policy.idNo || '',
        nation: policy.nation || '',
        idStartDate: !!policy.idStartDate?_this.utils.dateToStringFormat(new Date(policy.idStartDate),'yyyy-mm-dd'):'',
        idEndDate: !!policy.idEndDate?_this.utils.dateToStringFormat(new Date(policy.idEndDate),'yyyy-mm-dd'):'',
        institution: policy.institution || '',
        address: policy.address || ''
      };
    }
    if(_this.utils.hasValue(insured)){
      _this.data.insured = {
        ..._this.data.insured,
        name: insured.name || '',
        phone: insured.phone || '',
        email: insured.email || '',
        idNo: insured.idNo || '',
        nation: insured.nation || '',
        idStartDate: !!insured.idStartDate?_this.utils.dateToStringFormat(new Date(insured.idStartDate),'yyyy-mm-dd'):'',
        idEndDate: !!insured.idEndDate?_this.utils.dateToStringFormat(new Date(insured.idEndDate),'yyyy-mm-dd'):'',
        institution: insured.institution || '',
        address: insured.address || ''
      };
    }
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
      if(!_this.utils.hasValue(data)){
        return false;
      }
      _this.data.areaCode = data.areaCode;
      if(_this.utils.hasValue(data.carInfo)){
        _this.data.carInfo = {
          ..._this.data.carInfo,
          ...data.carInfo,
          model: data.carInfo.modelDes,
          price: data.vehiclePrice,
          city: data.areaName,
          carNo: !!data.carInfo.licenseNo? data.carInfo.licenseNo : '',
          vinNo: data.carInfo.vinNo,
          engineNo: data.carInfo.engineNo,
          // isNew: data.carInfo.licenseNo? false : true
        };
      }
      if(_this.utils.hasValue(data.personList) && data.personList.length > 0){
        data.personList.some(item => {          
          switch(item.utype){
            case 'owner':
              _this.data.owner = {
                ..._this.data.owner,
                name: item.uname.replace(" ",""),
                phone: item.uphone,
                email: item.uemail,
                idNo: item.ucertNo
              };
              break;
            case 'insured':
              _this.data.insured = {
                ..._this.data.insured,
                name: item.uname.replace(" ",""),
                phone: item.uphone,
                email: item.uemail,
                idNo: item.ucertNo
              };
              break;
            case 'holder':
              _this.data.policy = {
                ..._this.data.policy,
                name: item.uname.replace(" ",""),
                phone: item.uphone,
                email: item.uemail,
                idNo: item.ucertNo
              };
              break;
          }
        });
      }
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
      if(!_this.utils.hasValue(data)){
        return false;
      }
      //车辆信息
      if(_this.utils.hasValue(data.carInfo)){
        _this.data.areaCode = data.carInfo.areaCode;
        _this.data.carInfo = {
          ..._this.data.carInfo,
          ...data.carInfo,
          model: data.carInfo.modelDes,
          price: data.carInfo.invoicePrice,
          city: data.carInfo.areaName,
          carNo: !!data.carInfo.licenseNo? data.carInfo.licenseNo : '',
          vinNo: data.carInfo.vinNo,
          engineNo: data.carInfo.engineNo,
          // isNew: data.carInfo.licenseNo? false : true
        };
      }
      //车主信息
      if(_this.utils.hasValue(data.personList) && data.personList.length > 0){
        data.personList.some(item => {          
          switch(item.utype){
            case 'owner':
              _this.data.owner = {
                ..._this.data.owner,
                name: item.uname.replace(" ",""),
                phone: item.uphone,
                email: item.uemail,
                idNo: item.ucertNo
              };
              break;
            case 'insured':
              _this.data.insured = {
                ..._this.data.insured,
                name: item.uname.replace(" ",""),
                phone: item.uphone,
                email: item.uemail,
                idNo: item.ucertNo
              };
              break;
            case 'holder':
              _this.data.policy = {
                ..._this.data.policy,
                name: item.uname.replace(" ",""),
                phone: item.uphone,
                email: item.uemail,
                idNo: item.ucertNo
              };
              break;
          }
        });
      }
    }
  }

  //页面信息验证
  onVerify(callback) {
    const _this = this;
    let result: any = {
      flag: true,
      msg: ''
    };

    //验证车辆信息
    let carInfo = _this.data.carInfo;
    if(!carInfo.isNew){
      if(!_this.utils.hasValue(carInfo.carNo)){
        result.flag = false;
        result.msg = '车牌号不能为空';
        callback(result);
        return false;
      }else{
        if(carInfo.carNo.trim() == '新车'){
          result.flag = false;
          result.msg = '您当前不是新车，车牌号不正确';
          callback(result);
          return false;
        }else{
          if(!_this.utils.validate('CarNo',carInfo.carNo)){
            result.flag = false;
            result.msg = '您的车牌号不合法';
            callback(result);
            return false;
          }
        }
      }
    }

    //验证人员信息
    const personVerify = (obj,utype) => {
      let call = '';
      switch(utype) {
        case 'owner':
          call = '车主';
          break;
        case 'holder':
          call = '投保人';
          break;
        case 'insured':
          call = '被保人';
          break;
      }

      if(!_this.utils.hasValue(obj.name)){
        result.flag = false;
        result.msg = `请填写${call}的姓名`;
        return false;
      }
      if(!_this.utils.hasValue(obj.phone)){
        result.flag = false;
        result.msg = `请填写${call}手机号`;
        return false;
      }else{
        if(!_this.utils.validate('Phone',obj.phone)){
          result.flag = false;
          result.msg = `${call}手机号格式不正确`;
          return false;
        }
      }
      if(_this.utils.hasValue(obj.email) && !_this.utils.validate('Email',obj.email)){
        result.flag = false;
        result.msg = `${call}的邮箱格式不正确`;
        return false;
      }
      if(!_this.utils.hasValue(obj.idNo)){
        result.flag = false;
        result.msg = `请填写${call}身份证号`;
        return false;
      }else{
        if(!_this.utils.validateIdCard(obj.idNo)){
          result.flag = false;
          result.msg = `${call}的身份证号不合法`;
          return false;
        }
      }
      //北京地区
      if(_this.data.areaCode == '110100'){
        if(!_this.utils.hasValue(obj.nation)){
          result.flag = false;
          result.msg = `请填写${call}民族`;
          return false;
        }
        if(!_this.utils.hasValue(obj.idStartDate)){
          result.flag = false;
          result.msg = `请填写${call}证件有效起期`;
          return false;
        }
        if(_this.utils.hasValue(obj.idEndDate)){
          if(obj.idEndDate <= obj.idStartDate){
            result.flag = false;
            result.msg = `${call}证件有效止期应大于有效起期`;
            return false;
          }
          let nowDate = new Date().getTime();
          if(obj.idEndDate <= nowDate){
            result.flag = false;
            result.msg = `${call}证件已过期`;
            return false;
          }
        }else{
          result.flag = false;
          result.msg = `请填写${call}证件有效止期`;
          return false;
        }
        if(!_this.utils.hasValue(obj.institution)){
          result.flag = false;
          result.msg = `请填写${call}签发机构`;
          return false;
        }
        if(!_this.utils.hasValue(obj.address)){
          result.flag = false;
          result.msg = `请填写${call}的地址信息`;
          return false;
        }else{
          if(obj.address.length < 12){
            result.flag = false;
            result.msg = `${call}的地址信息，不可少于12个字`;
            return false;
          }
        }
      }

      return true;
    };

    //验证车主信息
    let owner = _this.data.owner;
    let ownerResult = personVerify(owner,'owner');
    if(!ownerResult){
      callback(result);
      return false;
    }

    //验证投保人信息
    let policy = _this.data.policy;
    let policyResult = personVerify(policy,'holder');
    if(!policyResult){
      callback(result);
      return false;
    }

    //验证被保人信息
    let insured = _this.data.insured;
    let insuredResult = personVerify(insured,'insured');
    if(!insuredResult){
      callback(result);
      return false;
    }

    callback(result);
  }

  onBtn1() {
    const _this = this;
    const home = _this.home;
    home.onNext();
  }

  onBtn2() {
    const _this = this;
    const home = _this.home;
    if(home.session.state.initBusinessType == 0){
      home.onPre();
    }
  }

  //下一步
  async onNext() {
    const _this = this;
    _this.onVerify((verifyResult) => {
      if(!verifyResult.flag){
        _this.message.create('warning', verifyResult.msg);
        return false;
      }
      _this.session.setState({
        loading: true,
        businessType: 1,
        carInfo: _this.data.carInfo,
        owner: _this.data.owner,
        policy: _this.data.policy,
        insured: _this.data.insured
      });
      setTimeout(() => {
        _this.router.navigate(['/layout/insure-select']);
        _this.session.setState({
          loading: false
        });
      }, 1000);
    });
  }

  //上一步
  onPre() {
    const _this = this;
    _this.session.setState({
      businessType: 0
    });
    _this.router.navigate(['/layout/insure-confirm']);
  }
}
