// pages/my/bill.ts
import { formatDate, formatMonthStartDate } from '../../utils/util'
const app = getApp<IAppOption>()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: formatMonthStartDate(new Date()),
    endDate: formatDate(new Date()),
    list: [] as SettleInfo[],
    // 最大页数
    maxPage: 1,
    // 当前页数
    currentPage: 1,
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
    this.query()
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
    const currentPage = this.data.currentPage + 1
    if (currentPage > this.data.maxPage) return
    this.setData({
      currentPage: currentPage
    })
    this.query()
  },
  /**
   * 查询信息
   * @param isRefresh 是否刷新
   */
  async query (isRefresh = false) {
    const settleRes = await app.api.post<ListResponse<SettleInfo>>("settle/v1/list", {
      start: this.data.startDate,
      end: this.data.endDate,
      page: this.data.currentPage,
    });
    const list = isRefresh ? settleRes.data : [...this.data.list, ...settleRes.data]
    this.setData({
      list,
      maxPage: settleRes.total
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