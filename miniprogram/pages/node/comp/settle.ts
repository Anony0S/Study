// pages/node/comp/settle.ts
import {formatDate} from '../../../utils/util'
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
    info: [] as SettleInfo[],
    currentPage: 1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async queryData (isRefresh = false) {
      const now = new Date()
      const end = formatDate(now)
      now.setTime(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const start = formatDate(now)
      const res = await app.api.post<ListResponse<SettleInfo>>('settle/v1/list', {
        end,
        page: this.data.currentPage,
        device_id: this.properties.deviceId,
        start
      })
      this.setData({
        info: isRefresh ? res.data : [...this.data.info, ...res.data]
      })
    }
  },
  ready() {
    this.queryData()
  }
})
