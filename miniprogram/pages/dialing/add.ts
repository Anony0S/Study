// pages/dialing/add.ts
const app = getApp<IAppOption>()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    device_index: -1,
    device_id: '',
    isIpType: false,  // 是否是IP类型
    textareaHolder: '',
    textareaValue: '',
    netcards: [] as NetCardInfo[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query: any) {
    if (query.index) {
      this.setData({
        device_index: query.index
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    if (app.globalData.currentNode) {
      const node = app.globalData.currentNode
      const isIpType = node.dialing_type === "PUBLIC_MULTI_IP" || node.dialing_type === "PUBLIC_SINGLE_IP"
      this.setData({
        device_id: node.device_id,
        isIpType: isIpType,
        textareaHolder: isIpType ? '格式：字段间用空格分开，多条换行\n示例：3011 192.168.1.13/255.255.255.0 192.168.1.1': 
        `格式：字段间用空格分开，多条换行\n示例：3011 053205346027 123456`,
        netcards: app.globalData.currentNetcards || []
      }) 
      this.asyncTextarea()
    }
  },
  identifyTextarea ()  {
    const content = this.data.textareaValue || "";
    const netcards = this.data.netcards
    const index = this.data.device_index
    const list = content.replace(/\t/g, " ").split("\n");
    const arr: DiaLingItemInfo[] = [];
    for (const item of list) {
      // 单纯的换行，空格则不做处理
      if (!item || item.trim() === "") continue;
      // 如果是IP类型则识别不一样
      if (this.data.isIpType) {
        const [vlanId, ipmask, gateway] = item.split(" ");
        // 若 vlanId，account，password有一个不存在则该条信息识别失败
        if (!vlanId || !ipmask || !gateway) {
          continue;
        }
        console.log(vlanId, ipmask, gateway);
        const [ip, mask] = ipmask.split("/");
        arr.push({
          vlanId,
          ip,
          mask,
          gateway,
        } as DiaLingItemInfo);
      } else {
        // 如果非IP类型则这么识别
        const [vlanId, account, password, mac] = item.split(" ");
        // 若 vlanId，account，password有一个不存在则该条信息识别失败
        if (!vlanId || !account || !password) {
          continue;
        }
        arr.push({
          vlanId,
          account,
          password,
          mac,
        } as DiaLingItemInfo);
      }
    }
    if (arr.length < 1) {
      wx.showToast({
        icon: 'error', title: '格式错误，未能识别到任何线路'
      })
      return;
    }

    wx.showModal({
      title: '识别成功',
      content: `共识别${arr.length}条线路，确认填写？`,
      success: (res) => {
        if (res.confirm) {
          console.log('识别成功')
          netcards[index].dialingInfo = arr
          app.setCurrentNetcards(netcards)
          wx.navigateBack()
        }
      }
    })
  },
  clear () {
    this.setData({
      textareaValue: ''
    })
  },
  asyncTextarea () {
    const netcards = this.data.netcards
    const index = this.data.device_index
    if (!netcards[index] || !netcards[index].dialingInfo) {
      return;
    }
    let content = "";
    for (const item of netcards[index].dialingInfo) {
      const { vlanId, account, password, mac = "" } = item;
      content += [vlanId, account, password, mac].join(" ") + "\n";
    }
    this.setData({
      textareaValue: content
    })
  },
  onShareAppMessage () {
    return app.globalData.shareContent
  }
})