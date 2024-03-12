// pages/node/node.ts
import { scanDeviceId } from '../../utils/util'
const app = getApp<IAppOption>()
interface PickerContent {
  label: string;
  value: string;
}
const urls: Record<number, string> = {
  4: 'box/v1/list',
  5: 'jacob/v1/list',
  8: 'cbox/v1/list',
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible: false,
    seachText: '',
    refreshing: false,
    // 所有的业务版本
    bizTypes: [] as PickerContent[],
    selectBizTypeLabel: '',
    selectBizTypeValue: '',
    list: [] as DeviceInfo[],
    // 最大页数
    maxPage: 1,
    // 当前页数
    currentPage: 1,
    selectOptions: [{
      label: '全部节点(0)',
      value: ''
    }, {
      label: '在线节点',
      value: 'online'
    }, {
      label: '离线节点',
      value: 'offline'
    }],
    selectLabel: '全部节点(0)',
    selectValue: ''
  },

  search() {
    this.queryData(true)
  },
  async queryData(isRefresh = false) {
    const param: {
      page: number,
      biz_type?: string | number
      device_id?: string
      online_status?: string
    } = {
      page: this.data.currentPage,
      biz_type: this.data.selectBizTypeValue
    }
    if (this.data.seachText) {
      param.device_id = this.data.seachText
    }
    if (this.data.selectValue) {
      param.online_status = this.data.selectValue
    }
    let url = 'device/v1/list'
    if (this.data.selectBizTypeValue in urls) {
      url = urls[Number(this.data.selectBizTypeValue)] || 'device/v1/list'
    }
    const deviceRes = await app.api.get<ListResponse<DeviceInfo>>(url, param);
    const list = isRefresh ? deviceRes.data : [...this.data.list, ...deviceRes.data]

    this.setData({
      list,
      maxPage: deviceRes.total
    })
  },
  async setSelectOptions() {
    const res = await app.api.get<AccountTotalData>("account/v1/total", {
      biz_type: this.data.selectBizTypeValue
    });
    const { curr_biz_type_total_device: total_device, curr_biz_type_online_device: online_device } = res
    const options = [{
      label: `全部节点(${total_device})`,
      value: ''
    }, {
      label: `在线节点(${online_device})`,
      value: 'online'
    }, {
      label: `离线节点(${total_device - online_device})`,
      value: 'offline'
    }]
    const item = options.find((item) => item.value === this.data.selectValue) || { label: '' }
    this.setData({
      selectOptions: options,
      selectLabel: item.label
    })
  },
  showFilterPopup() {
    this.setData({
      visible: true
    })
  },
  onVisibleChange() {
    this.setData({
      visible: false
    })
  },
  /**
   * 刷新页面
   */
  async refresh() {
    this.setData({
      refreshing: true,
      currentPage: 1
    })
    try {
      await this.queryData(true)
    } catch (error) {
      this.setData({
        refreshing: false
      })
    }
    this.setData({
      refreshing: false
    })

  },
  /**
   * 加载更多
   */
  loadMore() {
    const currentPage = this.data.currentPage + 1
    if (currentPage > this.data.maxPage) return
    this.setData({
      currentPage
    })
    this.queryData()
  },
  /**
   * 跳到节点详情页
   */
  toDetail(e: WechatMiniprogram.BaseEvent) {
    const { info } = e.currentTarget.dataset
    app.setCurrentNode(info)
    wx.navigateTo({ url: "/pages/node/detail" })
  },
  // 跳转绑定页面
  toAddPage() {
    wx.navigateTo({
      url: "/pages/index/index"
    })
  },
  /**
   * 去扫描
   */
  toScan() {
    wx.scanCode({
      success(res) {
        const device_id = scanDeviceId(res.result)
        app.setDeviceId(device_id)
        wx.switchTab({ url: "/pages/index/index" })
      }
    })
  },
  handleSingleSelect(e: WechatMiniprogram.TouchEvent) {
    const selectValue = e.detail.value
    this.selectTab(selectValue)
  },
  handleBizTypeSelect(e: WechatMiniprogram.TouchEvent) {
    const selectValue = e.detail.value
    const item = this.data.bizTypes.find(item => item.value === selectValue)
    if (!item) return
    this.setData({
      selectBizTypeValue: selectValue,
      selectBizTypeLabel: item.label
    })
    this.refresh()
    this.setSelectOptions()
  },
  async onShow() {
    await this.getBizType()
    await this.setSelectOptions()
    this.selectTab(app.globalData.online_status || '')
    app.setOnlineStatus('')
  },
  selectTab(value: string) {
    const item = this.data.selectOptions.find(item => item.value === value)
    if (!item) return
    this.setData({
      selectValue: value,
      selectLabel: item.label
    })
    this.queryData(true)
  },
  onShareAppMessage() {
    return app.globalData.shareContent
  },
  async getBizType() {
    if (this.data.bizTypes.length > 0) return
    const info = await app.api.get<ListResponse2<OsInfo>>("device/v1/os");
    const list: PickerContent[] = info.list.map(item => {
      return {
        label: item.name,
        value: item.id + ''
      } as PickerContent
    });
    const item = list[0] || {} as PickerContent
    this.setData({
      bizTypes: list,
      selectBizTypeValue: item.value,
      selectBizTypeLabel: item.label
    })
  },
})