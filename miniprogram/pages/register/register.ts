// pages/register/register.ts
const registerApp = getApp<IAppOption>()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
    repassword: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  async toRegister() {
    const { phone, password, repassword } = this.data
    if (password !== repassword) {
      wx.showToast({ icon: 'none', title: '两次密码输入不一致!' })
      return
    }
    await registerApp.api.post<UserInfo>('user/v1/register', { phone, password })
    wx.showToast({ icon: 'none', title: '注册成功！前往登录~' })
    wx.redirectTo({ url: '/pages/login/login' })
  },
  toLogin() {
    wx.redirectTo({ url: '/pages/login/login' })
  },
  onShareAppMessage() {
    return registerApp.globalData.shareContent
  }
})