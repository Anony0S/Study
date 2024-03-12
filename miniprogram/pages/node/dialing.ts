// pages/node/dialing.ts
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
    isEditStatus: false,  // 是否是编辑状态
    isEditing: false, // 是否正在编辑
    isAsyncing: false, // 是否正在同步
    isInited: false, // 是否已经初始化啦
    netcards: [] as NetCardInfo[],
    headerData: [] as HeaderDataItem[],
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
      console.log(node)
      this.setData({
        device_id: node.device_id,
        biz_type: node.biz_type,
        isIpType: node.dialing_type === "PUBLIC_MULTI_IP" || node.dialing_type === "PUBLIC_SINGLE_IP",
        isEditStatus: node.biz_type === 3 || (node.device_status !== "serving" && node.device_status !== "abandoned"),
      }) 
    }
    this.getNetCardInfo()
    this.setData({
      isInited: true
    })
  },
  /**
   * 获取网卡信息
   */
  async getNetCardInfo () {
    const res = await app.api.post<NetCardInfoResponse>("device/v1/dialing/get", {
      device_id: this.data.device_id,
      biz_type: this.data.biz_type,
    });
    const netcards = res.netcards.filter((item) => item.isManager === false && item.isValid)
    this.setData({
      netcards: netcards
    })
    this.initHeaderData()
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
  onShow () {
    if (this.data.isInited) {
      this.getNetCardInfo()
    }
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
  toEdit () {
    app.setCurrentNetcards(this.data.netcards)
    wx.navigateTo({url: "/pages/dialing/edit"})
  },
  onShareAppMessage () {
    return app.globalData.shareContent
  }
})