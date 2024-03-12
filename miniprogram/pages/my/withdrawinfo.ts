// pages/my/withdrawinfo.ts
import { formatDate, formatMonthStartDate } from '../../utils/util'
import { withdrawTypeTag } from '../../utils/typeStr'
const app = getApp<IAppOption>()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: formatMonthStartDate(new Date()),
    endDate: formatDate(new Date()),
    list: [] as WithDrawInfo[],
    WithDrawTypeLabels: ['申请中', '已拒绝', '打款中', '打款驳回', '打款完成'],
    // 最大页数
    maxPage: 1,
    // 当前页数
    currentPage: 1,
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  async query (isRefresh = false) {
    const res = await app.api.post<ListResponse<WithDrawInfo>>("withdraw/v1/list", {
      start: this.data.startDate,
      end: this.data.endDate,
      page: this.data.currentPage,
    });
    const list = isRefresh ? res.data : [...this.data.list, ...res.data]
    this.setData({
      list,
      maxPage: res.total
    })
  },

  bindStartDateChange (e: WechatMiniprogram.TouchEvent) {
    this.setData({
      startDate: e.detail.value
    })
    this.query(true)
  },
  bindEndDateChange (e: WechatMiniprogram.TouchEvent) {
    this.setData({
      endDate: e.detail.value
    })
    this.query(true)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return app.globalData.shareContent
  }
})