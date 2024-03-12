// pages/node/comp/quality.ts
const app = getApp<IAppOption>()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    deviceId: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    info: {} as QualityInfo
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async queryData (isRefresh = false) {
      const res = await app.api.get<QualityInfo>('device/v1/quality', {
        device_id: this.properties.deviceId
      })
      this.setData({
        info:res
      })
    }
  },
  ready() {
    this.queryData()
  }
})
