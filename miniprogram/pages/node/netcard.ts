// pages/node/netcard.ts
const app = getApp<IAppOption>()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {} as DeviceInfo,
    netcards: [] as NetCardInfo[],
    selectNetCard: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      info: app.globalData.currentNode || {} as DeviceInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.query()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  async query () {
    const res = await app.api.post<NetCardInfoResponse>("device/v1/netcard/get", {
      device_id: this.data.info.device_id,
      biz_type: this.data.info.biz_type,
    });
    const netcard = res.netcards.find((item) => item.isManager);
    if (netcard) {
      this.setData({
        netcards: res.netcards,
        selectNetCard: netcard.name
      })
    } else {
      this.setData({
        netcards: res.netcards
      })
    }
  },
  selcetNetcard(e: WechatMiniprogram.TouchEvent) {
    const { key } = e.currentTarget.dataset
    this.setData({
      selectNetCard: key
    })
  },
  async asyncInfo () {
    await app.api.post("device/v1/netcard/sync", {
      device_id: this.data.info.device_id,
      biz_type: this.data.info.biz_type,
    });
    await this.query()
    wx.showToast({
      title: "同步网卡信息成功",
      icon: "none",
    })
  },
  async manageCard () {
    await app.api.post("device/v1/netcard/manager", {
      name: this.data.selectNetCard,
      device_id:  this.data.info.device_id,
      biz_type: this.data.info.biz_type,
    });
    wx.showToast({
      title: "确定管理该网卡成功",
      icon: "none",
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return app.globalData.shareContent
  }
})