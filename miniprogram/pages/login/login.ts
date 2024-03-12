// pages/login/login.ts
const loginApp = getApp<IAppOption>()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
    isChecked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },
  async toLogin () {
    const { phone, password, isChecked } = this.data
    if (!isChecked) {
      wx.showToast({
        title: "请先阅读并同意《用户协议》与《隐私政策》",
        icon: "none"
      })
      return
    }
    const userinfo = await loginApp.api.post<UserInfo>('user/v1/login', { phone, password })
    loginApp.setUserInfo(userinfo)
    wx.setStorageSync('token', userinfo.token)
    wx.switchTab({url: '/pages/node/node'})
    // wx.redirectTo({url: '/pages/index/index'})
  },
  async toRegister () {
    wx.redirectTo({url: '/pages/register/register'})
  },
  onShareAppMessage () {
    return loginApp.globalData.shareContent
  },
  // 跳转隐私协议
  toProtocol(e: WechatMiniprogram.TouchEvent) {
    const { index } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/my/protocol?index=' + index
    })
    this.setData({
      isChecked: true
    })
  },
  onChange(event: any) {
    const { checked } = event.detail;
    this.setData({ isChecked: checked });
  },
})