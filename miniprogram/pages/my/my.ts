// pages/my/my.ts
const appInstance = getApp<IAppOption>()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    moneyDataLabels: [
      "可提现金额",
      "在途冻结金额",
      "累计收益",
      "昨日收益",
    ],
    moneyIcon: [
      "../../image/money1.png",
      "../../image/money2.png",
      "../../image/money3.png",
      "../../image/money4.png",
    ],
    amount: '',
    moneyData: [] as string[],
    info: {},
    // 是否显示提现弹窗
    showWithdrawDialog: false,
    withdrawMoney: '',
    withdrawLabels: undefined as undefined | Record<string, string>,
    withdrawInfo: {} as PayeeExtends,
    // 是否显示修改密码弹窗
    showPasswordDialog: false,
    oldPassword: '',
    newPassword: '',
    againPassword: '',
    menuButtonInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onShow() {
    this.setData({
      menuButtonInfo: appInstance.globalData.menuButtonInfo
    })

    const token = wx.getStorageSync('token') || ''
    if (!token) {
      this.setData({ toLoginText: '登录' })
      this.setData({
        info: {},
      })
      wx.redirectTo({ url: '/pages/login/login' })
    } else {
      const userinfo = wx.getStorageSync('userinfo')
      if(userinfo) appInstance.setUserInfo(userinfo)
      this.setData({ toLoginText: '退出' })
    }
    await this.initData()
    // this.initUserData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.setData({
      info: appInstance.globalData.userInfo
    })
  },
  async initData() {
    const res = await appInstance.api.get<UserMoneyResponse>("account/v1/info");
    const totalRes = await appInstance.api.get<AccountTotalData>("account/v1/total");
    const moneyData = [
      `${((res.amount || 0) / 100).toFixed(2)}`,
      `${((res.transfer_amount || 0) / 100).toFixed(2)}`,
      `${((totalRes.total_increase_amount || 0) / 100).toFixed(2)}`,
      `${((totalRes.last_day_amount || 0) / 100).toFixed(2)}`,
    ];
    this.setData({
      moneyData: moneyData,
      amount: `${((res.amount || 0) / 100).toFixed(2)}`,
    })
  },
  async initUserData() {
    const res = await appInstance.api.get<UserInfoResponse>('user/v1/info');
    const withdrawLabels: Record<string, string> = res.payee_type !== 3 ? {
      name: '开户名',
      bank_addr: '开户行',
      bank_no: '银行卡号',
      phone: '联系电话',
      card_no: '身份证',
    } : {
        name: '姓名',
        alipay_account: '支付宝账号',
        phone: '联系电话',
      }
    this.setData({
      withdrawLabels,
      withdrawInfo: res.payee_extends || {}
    })
  },
  toLogout() {
    const token = wx.getStorageSync('token') || ''
    if (!token) {
      wx.redirectTo({ url: '/pages/login/login' })
    } else {
      wx.showModal({
        title: '提示',
        content: '确定要退出吗？',
        success(res) {
          if (res.confirm) {
            wx.removeStorageSync('token')
            wx.redirectTo({ url: '/pages/login/login' })
          }
        }
      })
    }
  },
  toBill() {
    wx.navigateTo({
      url: '/pages/my/bill'
    })
  },
  toWithdrawInfo() {
    wx.navigateTo({
      url: '/pages/my/withdrawinfo'
    })
  },
  toUserInfo() {
    wx.navigateTo({
      url: '/pages/my/userinfo'
    })
  },
  onShareAppMessage() {
    return appInstance.globalData.shareContent
  },
  showWithdrawDialog() {
    this.setData({
      withdrawMoney: '',
      showWithdrawDialog: true
    })
  },
  async toWithdraw() {
    const amount = Math.floor(Number(this.data.withdrawMoney) * 100)
    await appInstance.api.post("withdraw/v1/new", {
      amount: amount,
    });
    wx.showToast({ icon: 'none', title: `成功申请提现${this.data.withdrawMoney}元` })
    this.closeDialog()
  },
  toUpdatePassword() {
    this.setData({
      newPassword: '',
      oldPassword: '',
      againPassword: '',
      showPasswordDialog: true
    })
  },
  async updatePassword() {
    const { oldPassword, newPassword, againPassword } = this.data;
    if (newPassword !== againPassword) {
      wx.showToast({ icon: 'none', title: '两次密码输入不一致' })
      return;
    }
    await appInstance.api.post("user/v1/update/password", {
      old_password: oldPassword,
      new_password: newPassword,
    });
    wx.showToast({ icon: 'none', title: '修改密码成功' })
    this.closePasswordDialog();
  },
  closePasswordDialog() {
    this.setData({
      showPasswordDialog: false
    })
  },
  closeDialog() {
    this.setData({
      showWithdrawDialog: false
    })
  },

})