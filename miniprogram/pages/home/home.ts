// pages/home/home.ts
const appHome = getApp<IAppOption>()
Page({
  data: {
    moneyData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
  },

  async onShow() {
    wx.showLoading({
      title: "加载中~"
    })
    try {
      await this.initData();
    } catch (error) {
      wx.showToast({
        title: "加载失败，请重试！",
        icon: "error"
      })
    } finally {
      wx.hideLoading()
    }
  },

  // 收益信息页面
  toWithdrawinfo() {
    wx.navigateTo({
      url: '/pages/my/withdrawinfo'
    })
  },

  // 获取收益信息
  async initData() {
    const totalRes = await appHome.api.get<AccountTotalData>("account/v1/total");
    this.setData({
      moneyData: totalRes
    })
  }
})