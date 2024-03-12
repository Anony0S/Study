// pages/node/test.ts
import { formatTime } from '../../utils/util'
const app = getApp<IAppOption>()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {} as DeviceInfo,
    data: [] as (TestResultItem)[]
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
    this.getTestInfo()
  },
  async getTestInfo () {
    const res = await app.api.get<TestResultResponse>("device/v1/test/result", {
      biz_type: this.data.info.biz_type,
      device_id: this.data.info.device_id,
    });
    const list = res.result || []
    list.forEach(item => {
      if (item.upBandwidthTestTime) {
        item.time = formatTime(new Date(Number(item.upBandwidthTestTime) * 1000))
      } else {
        item.time = '--'
      }
     
    })
    this.setData({
      data: list
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return app.globalData.shareContent
  }
})