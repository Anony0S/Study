// pages/my/userinfo.ts
const userInfoApp = getApp<IAppOption>()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 身份证正面
    card_front_pic: [] as Record<string, any>[],
    // 身份证反面
    card_back_pic: [] as Record<string, any>[],
    // 营业执照
    license_pic: [] as Record<string, any>[],
    userInfo: {} as UserInfoResponse,
    certificationVisible: false,
    payeeType: 1,
    payeeTypeLabel: '',
    withdrawInfo: {} as PayeeExtends,
    payeeTypesVisible: false,
    payeeTypes: [
      { label:"个人银行卡", value: 1 },
      { label:"企业银行卡", value: 2 },
      { label:"支付宝", value: 3 }
    ],
    checkRules: [
      ['name', 'phone', 'card_no', 'card_front_pic', 'card_back_pic', 'bank', 'bank_addr', 'bank_no'],
      ['name', 'phone', 'card_no', 'card_front_pic', 'card_back_pic', 'bank', 'bank_addr', 'bank_no', 'license_pic', 'address', 'tax_no'],
      ['name', 'phone', 'card_no', 'card_front_pic', 'card_back_pic', 'alipay_account'],
    ],
    isChecked: true,
    ruleLables: {
      name: '姓名',
      phone: '手机号',
      card_no: '身份证',
      card_front_pic: '身份证正面',
      card_back_pic: '身份证反面',
      bank: '银行名',
      bank_addr: '开户行',
      bank_no: '银行卡号',
      license_pic: '营业执照',
      address: '地址',
      tax_no: '税号',
      alipay_account: '支付宝账号'
    },
    // 是否已经初始化过了
    isInited: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  onShow () {
    this.initUserData()
  },
  /**
   * 上传图片
   * @param e 
   */
  async handleAdd (e: WechatMiniprogram.CustomEvent) {
    const {files} = e.detail
    const { key } = e.currentTarget.dataset
    const file = files[0]
    const res: string = await userInfoApp.api.uploadFile(file)
    this.setData({
      [key]: [{
        url: res,
        name: file.name,
        type: "image",
        status: "done"
      }],
    });
  },
  /**
   * 删除图片
   * @param e 
   */
  handleRemove (e: any) {
    const { key } = e.currentTarget.dataset
    this.setData({
      [key]: []
    })
  },
  async initUserData () {
    const res = await userInfoApp.api.get<UserInfoResponse>('/user/v1/info');
    if (this.data.isInited) {
      this.setData({
        certificationVisible: res.need_certification > 0 && res.certification_link !== ''
      })
      return
    }
    
    const withdrawInfo = res.payee_extends || {}
    const card_front_pic: Record<string, any>[] = []
    if (withdrawInfo.card_front_pic) {
      card_front_pic.push({
        url: withdrawInfo.card_front_pic,
        name: 'card_front_pic.png'
      })
    }
    const card_back_pic: Record<string, any>[] = []
    if (withdrawInfo.card_back_pic) {
      card_back_pic.push({
        url: withdrawInfo.card_back_pic,
        name: 'card_back_pic.png'
      })
    }
    const license_pic: Record<string, any>[] = []
    if (withdrawInfo.license_pic) {
      license_pic.push({
        url: withdrawInfo.license_pic,
        name: 'license_pic.png'
      })
    }
    const item = this.data.payeeTypes.find(item => item.value === res.payee_type)
    const payeeTypeLabel = item ? item.label || '' : '' 
    // res.need_certification = 1
    // res.certification_link = 'https://csu.leyoubuji.com/b327b49d'
    this.setData({
      isInited: true,
      userInfo: res,
      payeeType: res.payee_type,
      payeeTypeLabel: payeeTypeLabel,
      withdrawInfo: withdrawInfo,
      license_pic,
      card_back_pic,
      card_front_pic,
      certificationVisible: res.need_certification > 0 && res.certification_link !== ''
    })
  },
  onPickerChange(e: any) {
    const data: {
      value: number[]
      label: string[]
    } = e.detail
    this.setData({
      payeeType: data.value[0],
      payeeTypeLabel: data.label[0]
    })
  },
  showPicker () {
    this.setData({
      payeeTypesVisible: true
    })
  },
  handleInput (e: WechatMiniprogram.TouchEvent) {
    const {value} = e.detail
    const {withdrawInfo} = this.data
    const {key} = e.currentTarget.dataset
    if (!key) return
    const index: keyof typeof withdrawInfo = key
    withdrawInfo[index] = value
    this.setData({
      withdrawInfo
    })
  },
  toProtocol (e: WechatMiniprogram.TouchEvent) {
    const { index } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/my/protocol?index='+index
    })
  },
  async toUpdate () {
    console.log(this.data.isChecked)
    if (!this.data.isChecked) {
      wx.showToast({
        title: '请先阅读并同意《用户协议》与《隐私政策》',
        icon: 'none'
      })
      return
    }
    const {payeeType, withdrawInfo, card_front_pic, card_back_pic, license_pic, ruleLables } = this.data
    withdrawInfo.card_front_pic = card_front_pic[0] ? card_front_pic[0].url || '' : ''
    withdrawInfo.card_back_pic = card_back_pic[0]? card_back_pic[0].url || '' : ''
    withdrawInfo.license_pic = license_pic[0]? license_pic[0].url || '' : ''

    const rules = this.data.checkRules[payeeType - 1] || []
    for (const item of rules) {
      if (!withdrawInfo[item as keyof typeof withdrawInfo]) {
        wx.showToast({icon: 'none', title: `${ruleLables[item as keyof typeof ruleLables]}不能为空`})
        return
      }
    }
    await userInfoApp.api.post("user/v1/update/payee", {
      payee_type: payeeType,
      payee_extends: withdrawInfo,
    });
    wx.showToast({icon: 'none', title: '修改信息成功'})
    setTimeout(() => {
      wx.navigateBack()
    }, 500)
  },
  toCertification () {
    const info = this.data.userInfo
    wx.navigateTo({
      url: '/pages/my/certification?url='+info.certification_link
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return userInfoApp.globalData.shareContent
  }
})