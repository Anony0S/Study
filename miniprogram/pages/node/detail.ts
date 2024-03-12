// pages/node/detail.ts
import { deviceStatusStr } from '../../utils/typeStr'
const app = getApp<IAppOption>()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {} as DeviceInfo,
    deviceStatusStr,
    currentTab: 0,
    limit: '',
    showTestDialog: false,
    upBandwidth: '',
    showEditUpBandwidthDialog: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      info: app.globalData.currentNode || {} as DeviceInfo
    })
  },
  copy() {
    console.log(this.data.info.device_id);
    (wx as any).getPrivacySetting({
      success(res: {}) {
        console.log("调用权限：", res);
      }
    })
    wx.setClipboardData({
      data: this.data.info.device_id || '',
      fail(res) {
        console.log("复制失败：", res);
        wx.showToast({
          title: "复制失败！",
          icon: "error"
        })
      }
    })
  },
  onTabsChange(e: any) {
    this.setData({ currentTab: e.detail.value })
  },
  toMonitor() {
    wx.navigateTo({ url: "/pages/node/monitor" })
  },
  onShareAppMessage() {
    return app.globalData.shareContent
  },
  openUpBandwidthDialog() {
    this.setData({
      showEditUpBandwidthDialog: true
    })
  },
  closeUpBandwidthDialog() {
    this.setData({
      upBandwidth: '',
      showEditUpBandwidthDialog: false
    })
  },
  async updateUpBandwidth() {
    if (!this.data.upBandwidth) {
      wx.showToast({
        title: '不能为空',
        icon: 'none'
      })
      return
    }
    await app.api.post("device/v1/update/upbandwidth", {
      device_id: this.data.info.device_id,
      biz_type: this.data.info.biz_type,
      up_bandwidth: Number(this.data.upBandwidth)
    });
    wx.showToast({
      title: '提交成功',
      icon: 'none'
    })
    this.closeUpBandwidthDialog()
  },
  openDialog() {
    this.setData({
      showTestDialog: true
    })
  },
  closeDialog() {
    this.setData({
      limit: '',
      showTestDialog: false
    })
  },
  removeDialog() {
    wx.showModal({
      title: '确认操作',
      content: '确定要删除该设备吗？',
      success: (res) => {
        if (res.confirm) {
          this.toRemove();
          wx.navigateBack({
            delta: 1 // 返回的页面数，1表示返回上一页，2表示返回上两页，以此类推
          });
        }
      }
    });
  },
  async toRemove() {
    await app.api.post("device/v1/remove", {
      device_id: this.data.info.device_id,
      biz_type: this.data.info.biz_type
    });
    wx.showToast({
      title: '已删除',
      icon: 'none'
    })
    this.closeDialog()
  },
  async startTest() {
    if (!this.data.limit) {
      wx.showToast({
        title: '不能为空',
        icon: 'none'
      })
      return
    }
    await app.api.post("device/v1/test/start", {
      device_id: this.data.info.device_id,
      biz_type: this.data.info.biz_type,
      limit: Number(this.data.limit)
    });
    wx.showToast({
      title: '成功开始压测',
      icon: 'none'
    })
    this.closeDialog()
  }
})