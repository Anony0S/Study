// pages/dialing/edit.ts
const app = getApp<IAppOption>()
interface HeaderDataItem {
  number: number;
  label: string;
  color: string;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    device_id: '',
    biz_type: undefined as number | undefined,
    isIpType: false,  // 是否是IP类型
    isInited: false, // 是否已经初始化啦
    isAsyncing: false, // 是否正在同步
    netcards: [] as NetCardInfo[],
    headerData: [] as HeaderDataItem[],
    allIPv6: [] as number[], // 是否是全IPv6
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
    if (app.globalData.currentNode) {
      const node = app.globalData.currentNode
      this.setData({
        device_id: node.device_id,
        biz_type: node.biz_type,
        isIpType: node.dialing_type === "PUBLIC_MULTI_IP" || node.dialing_type === "PUBLIC_SINGLE_IP",
      }) 
    }
    this.getNetCardInfo()
    this.setData({
      isInited: true
    })
  },
  onShow() {
    if (this.data.isInited) {
      this.getNetCardInfo()
    }
  },
  /**
   * 获取网卡信息
   */
  getNetCardInfo () {
    const netcards = app.globalData.currentNetcards
    this.setData({
      netcards: netcards
    })
    this.initHeaderData()
    this.initAllIpv6()
  },
    /**
   * 初始化头部信息
   */
  initHeaderData () {
    let allNum = 0;
    let successedNum = 0;
    let failNum = 0;
    let connectedNum = 0;
    for (const item of this.data.netcards) {
      const dialinginfo = item.dialingInfo;
      allNum += dialinginfo.length;
      successedNum += dialinginfo.filter((item) => item.successed).length;
      failNum += dialinginfo.filter((item) => !item.successed && !item.connected).length;
      connectedNum += dialinginfo.filter((item) => item.connected).length;
    }
    let list: HeaderDataItem[] = [];
    if (!this.data.isIpType) {
      list = [
        {
          number: allNum,
          label: "拨号",
          color: "#333333",
        },
        {
          number: successedNum,
          label: "已拨通",
          color: "#2ecc71",
        },
        {
          number: failNum,
          label: "未拨通",
          color: "#fa5555",
        },
        {
          number: connectedNum,
          label: "已联网",
          color: "#2ecc71",
        },
      ];
    } else {
      list = [
        {
          number: allNum,
          label: "配置",
          color: "#333333",
        },
        {
          number: successedNum,
          label: "已连通",
          color: "#2ecc71",
        },
        {
          number: failNum,
          label: "未连通",
          color: "#fa5555",
        },
      ];
    }
    this.setData({
      headerData: list,
    })
  },
  async asyncInfo () {
    this.setData({
      isAsyncing: true
    })
    try {
      await app.api.post("device/v1/netcard/sync", {
        device_id: this.data.device_id,
        biz_type: this.data.biz_type,
      });
      wx.showToast({ icon: 'none', title: '同步网卡信息成功' });
      this.setData({
        isAsyncing: false
      })
    } catch {
      this.setData({
        isAsyncing: false
      })
    }
  },
  async updateDialingInfo () {
    const dialing_infos: DiaLingItemInfo[] = [];
    for (const card of this.data.netcards) {
      for (const dialingInfo of card.dialingInfo) {
        dialing_infos.push({
          ...dialingInfo,
          name: card.name,
        });
      }
    }
    await app.api.post("device/v1/dialing/edit", {
      device_id: this.data.device_id,
      biz_type: this.data.biz_type,
      dialing_infos: dialing_infos,
    });
    wx.showToast({ icon: 'success', title: '同步拨号信息成功' });
  },
  /**
   * 删除某个拨号信息
   * @param e 
   */
  removeDialingInfo (e: WechatMiniprogram.TouchEvent) {
    const {index, i} = e.currentTarget.dataset
    const netcards = this.data.netcards
    wx.showModal({
      title: '线路删除',
      content: '确认删除该拨号线路吗？',
      success: (res) => {
        if (res.confirm) {
          netcards[index].dialingInfo.splice(i, 1);
          this.setData({
            netcards: netcards
          })
        }
      }
    })
  },
  /**
   * 清空拨号信息
   * @param e
   */
  removeAllDialingInfo (e: WechatMiniprogram.TouchEvent) {
    const {index} = e.currentTarget.dataset
    console.log(e.currentTarget.dataset)
    const netcards = this.data.netcards
    wx.showModal({
      title: '清空网卡拨号信息',
      content: '您确定要清空网卡的拨号信息吗？清空后无法撤销！',
      success: (res) => {
        if (res.confirm) {
          netcards[index].dialingInfo = [];
          this.setData({
            netcards: netcards
          })
        }
      }
    })
  },
  /**
   * 改变某个ipv6
   * @param value 
   */
  changeItemIpv6 (e: WechatMiniprogram.TouchEvent) {
    const {index, i} = e.currentTarget.dataset
    const value = e.detail.value
    const netcards = this.data.netcards
    netcards[index].dialingInfo[i].enableV6 = value
    this.setData({
      netcards
    })
  },
  initAllIpv6 () {
    const list = [];
    for (const item of this.data.netcards) {
      const hasNoIpv6 = item.dialingInfo.findIndex((it) => it.enableV6 !== 1);
      list.push(hasNoIpv6 === -1 ? 1 : 0);
    }
    this.setData({
      allIPv6: list
    })
  },
  /**
   * 改变某个ipv6
   * @param value 
   */
  changeIpv6 (e: WechatMiniprogram.TouchEvent) {
    const {index} = e.currentTarget.dataset
    const value = e.detail.value
    const netcards = this.data.netcards
    const allIPv6 = this.data.allIPv6
    const dialingInfo = netcards[index].dialingInfo
    for (const item of dialingInfo) {
      item.enableV6 = value
    }
    allIPv6[index] = value
    this.setData({
      netcards,
      allIPv6
    })
  },
  /**
   * 去拨号
   */
  async toDialing () {
    await this.updateDialingInfo();
    await app.api.post("device/v1/dialing/start", {
      device_id: this.data.device_id,
      biz_type: this.data.biz_type,
    });
    wx.showToast({icon: 'none', title: '开始拨号成功'})
  },
  /**
   * 去批量填写
   */
  toAdd (e: WechatMiniprogram.TouchEvent) {
    const {index} = e.currentTarget.dataset
    wx.navigateTo({url: '/pages/dialing/add?index='+index})
  },
  onShareAppMessage () {
    return app.globalData.shareContent
  }
})