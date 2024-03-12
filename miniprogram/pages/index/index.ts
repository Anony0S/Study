// index.ts
// 获取应用实例
import { addresses } from './city'
import { scanDeviceId } from '../../utils/util'
const app = getApp<IAppOption>()
const PICKER_KEY = {
  ADDRESS_TITLE: 'addressTitle',
  BIZ_TYPE_TITLE: 'biztypeTitle',
  ISP_TITLE: 'ispTitle',
  DIALING_TITLE: 'dialingTitle',
  PLAN_TASK_TITLE: 'planTaskTitle',
  REFER_TITLE: 'referTitle',
};
interface PickerContent {
  label: string;
  value: string;
}
Page({
  data: {
    PICKER_KEY,
    [`${PICKER_KEY.ADDRESS_TITLE}Visible`]: false,
    [`${PICKER_KEY.ISP_TITLE}Visible`]: false,
    [`${PICKER_KEY.DIALING_TITLE}Visible`]: false,
    [`${PICKER_KEY.BIZ_TYPE_TITLE}Visible`]: false,
    [`${PICKER_KEY.PLAN_TASK_TITLE}Visible`]: false,
    [`${PICKER_KEY.REFER_TITLE}Visible`]: false,
    [`${PICKER_KEY.ADDRESS_TITLE}Data`]: [] as string[],
    [`${PICKER_KEY.ISP_TITLE}Data`]: [] as string[],
    [`${PICKER_KEY.DIALING_TITLE}Data`]: [] as string[],
    [`${PICKER_KEY.PLAN_TASK_TITLE}Data`]: [] as string[],
    [`${PICKER_KEY.BIZ_TYPE_TITLE}Data`]: [] as string[],
    [`${PICKER_KEY.REFER_TITLE}Data`]: [] as string[],
    [`${PICKER_KEY.ADDRESS_TITLE}CurrentValue`]: '',
    [`${PICKER_KEY.ISP_TITLE}CurrentValue`]: '',
    [`${PICKER_KEY.DIALING_TITLE}CurrentValue`]: '',
    [`${PICKER_KEY.BIZ_TYPE_TITLE}CurrentValue`]: '',
    [`${PICKER_KEY.PLAN_TASK_TITLE}CurrentValue`]: '',
    [`${PICKER_KEY.REFER_TITLE}CurrentValue`]: '',
    isShowCamera: false,
    // 省份信息
    provinces: addresses,
    // 城市信息
    citys: addresses[0].children,
    // 所有的业务版本
    bizTypes: [] as PickerContent[],
    planTasks: [] as PickerContent[],
    // 网络信息
    isps: [
      { label: "移动", value: "移动" },
      { label: "电信", value: "电信" },
      { label: "联通", value: "联通" }
    ],
    // 上网方式
    dialings: [
      { label: "服务器拨号", value: "PPPOE" },
      { label: "路由器", value: "1VN" },
      { label: "固定公网多IP", value: "PUBLIC_MULTI_IP" },
      { label: "固定公网单IP", value: "PUBLIC_SINGLE_IP" }
    ],
    refers: [
      { label: "ruiyun_node", value: "ruiyun_node" },
      { label: "ruiyun_server_node", value: "ruiyun_server_node" },
      { label: "ruiyun_smalld_server_node", value: "ruiyun_smalld_server_node" },
    ],
    // 总上行带宽
    total_up_bandwidth: '0.00',
    // 表单内容
    form: {
      biz_type: 1,
      device_id: "",
      refer: undefined,
      remark: undefined,
      up_bandwidth: undefined,
      line_number: undefined,
      province: undefined,
      city: undefined,
      isp: undefined,
      plan_task: undefined,
      dialing_type: undefined,
      nat_type: "public",
      ip_protocol: "双栈",
    } as Partial<DeviceInfo>,
    formKeys: [
      'biz_type',
      'device_id',
      'remark',
      'up_bandwidth',
      'line_number',
      'province',
      'city',
      'isp',
      'plan_task',
      'dialing_type',
      'nat_type',
      'ip_protocol'
    ] as string[],
    formTitles: {
      refer: "来源",
      plan_task: "业务目标",
      device_id: "设备ID",
      remark: "备注",
      line_number: "线路数量",
      up_bandwidth: "单条上行",
      isp: "运营商",
      province: "地域",
      city: "地域",
      dialing_type: "上网方式",
    }
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  onLoad(query: any) {
    console.log('bind', query)
    if (query.device_id) {
      this.setDeviceId(query.device_id)
    }
  },
  setDeviceId(device_id: string) {
    const form = this.data.form
    form.device_id = device_id
    this.setData({
      form
    })
  },
  onReady() {
    // 展示本地存储能力
    const token = wx.getStorageSync('token') || ''
    console.log('token', token)
    if (!token) {
      wx.showToast({
        title: "请先登录！",
        icon: "none",
      })
      wx.redirectTo({ url: '/pages/login/login' })
    }
    this.getBizType()
  },
  onShow() {
    console.log('globalData-ready', app.globalData.device_id)
    if (app.globalData.device_id) {
      this.setDeviceId(app.globalData.device_id)
      app.setDeviceId('')
    }
  },
  async getBizType() {
    const info = await app.api.get<ListResponse2<OsInfo>>("device/v1/os");
    const list: PickerContent[] = info.list.map(item => {
      return {
        label: item.name,
        value: item.id + ''
      } as PickerContent
    });
    this.setData({
      bizTypes: list
    })
  },
  /**
   * 打开摄像头
   */
  async openCamera() {
    wx.scanCode({
      success: (res) => {
        const deviceId = scanDeviceId(res.result)
        this.setDeviceId(deviceId)
      }
    })
    return
  },
  /**
   * 显示选择器
   * @param e 
   */
  onClickPicker(e: any) {
    var _a;
    const { key } = (_a = e === null || e === void 0 ? void 0 : e.currentTarget) === null || _a === void 0 ? void 0 : _a.dataset;
    this.setData({
      [`${key}Visible`]: true,
    });
  },
  showAddressPicker() {
    this.setData({
      isShowAddresPicker: true
    })
  },
  onPickerChange(e: any) {
    var _a;
    const { key } = (_a = e === null || e === void 0 ? void 0 : e.currentTarget) === null || _a === void 0 ? void 0 : _a.dataset;
    const data: {
      value: string[]
      label: string[]
    } = e.detail
    this.setData({
      [`${key}Visible`]: false,
      [`${key}Data`]: data.value,
      [`${key}CurrentValue`]: data.label.join('-'),
    });
    // 修改表单内容
    const form = this.data.form
    switch (key) {
      case PICKER_KEY.ADDRESS_TITLE:
        form.province = data.value[0]
        form.city = data.value[1]
        break;
      case PICKER_KEY.ISP_TITLE:
        form.isp = data.value[0]
        break;
      case PICKER_KEY.BIZ_TYPE_TITLE:
        const biz_type = parseInt(data.value[0])
        form.biz_type = biz_type
        this.queryTask(biz_type)
        this.changeForm(biz_type)
        break;
      case PICKER_KEY.DIALING_TITLE:
        form.dialing_type = data.value[0] as DialingType
        break;
      case PICKER_KEY.PLAN_TASK_TITLE:
        form.plan_task = data.value[0]
        break;
      case PICKER_KEY.REFER_TITLE:
        form.refer = data.value[0]
        break;
    }
    this.setData({
      form
    })
  },
  changeForm(biz_type: number) {
    switch (biz_type) {
      case 1:
        this.setData({
          formKeys: [
            "device_id",
            "remark",
            "up_bandwidth",
            "line_number",
            "province",
            "city",
            "isp",
            "plan_task",
            "dialing_type",
            "nat_type",
            "ip_protocol"
          ]
        })
        break;
      case 2:
      case 3:
      case 6:
        this.setData({
          formKeys: [
            "device_id",
            "remark",
            "up_bandwidth",
            "line_number",
            "province",
            "city",
            "isp",
            "dialing_type",
            "nat_type",
            "ip_protocol"
          ]
        })
        break;
      case 4:
        this.setData({
          formKeys: [
            "device_id",
            "remark",
            "up_bandwidth",
            "line_number",
            "province",
            "city",
            "isp",
          ]
        })
        break;
      case 8:
        this.setData({
          formKeys: [
            "device_id",
            "remark",
            "up_bandwidth",
            "line_number",
            "province",
            "city",
            "isp",
          ]
        })
        break;
      case 5:
        this.setData({
          formKeys: [
            "device_id",
            "refer",
            "remark",
            "up_bandwidth",
            "line_number",
            "province",
            "city",
            "isp",
          ]
        })
        break;
    }
  },
  async queryTask(biz_type: number) {
    if (biz_type !== 1) return
    this.setData({
      planTaskTitleCurrentValue: ''
    })
    const res = await app.api.get<ListResponse<string>>("device/v1/tasks", {
      biz_type: biz_type,
    });
    const list = res.data || [];
    this.setData({
      planTasks: list.map(item => {
        return {
          label: item,
          value: item
        }
      }),
    })
  },
  onColumnChange(e: any) {
    const data: {
      column: number,
      index: number
    } = e.detail
    if (data.column === 0) {
      this.setData({
        citys: addresses[data.index].children
      })
    }
  },
  // 输入更新
  inputChange(e: any) {
    const { currentTarget, detail } = e
    const { dataset } = currentTarget
    const form = this.data.form
    const key: keyof typeof form = dataset.key
    if (!key) return
    if (key === 'line_number' || key === 'up_bandwidth') {
      const value = parseInt(detail.value)
      form[key] = isNaN(value) ? undefined : value
      // 更新总上传带宽
      const total_up_bandwidth = ((form.line_number || 0) * (form.up_bandwidth || 0) / 1024).toFixed(2)
      this.setData({
        total_up_bandwidth
      })
    } else {
      form[key] = detail.value
    }

    this.setData({
      form: form
    })
  },
  /**
   * 单选框选中修改
   * @param e 
   */
  radioChange(e: any) {
    const { currentTarget, detail } = e
    const { dataset } = currentTarget
    const form = this.data.form
    const key: keyof typeof form = dataset.key
    form[key] = detail.value
    this.setData({ form })
  },
  async toBind() {
    const form = this.data.form
    const formTitles = this.data.formTitles
    for (const key of this.data.formKeys) {
      // dns 为非必填项
      if (key === 'dns') continue
      if (key === 'plan_task') continue
      const value = form[key as keyof typeof form]
      if (!value) {
        wx.showToast({
          title: `${formTitles[key as keyof typeof formTitles]}不能为空`,
          icon: 'none'
        })
        return
      }
    }
    await app.api.post("device/v1/create", form)
    wx.showToast({
      title: `绑定设备成功`,
      icon: 'none'
    })
  },
  onShareAppMessage() {
    return app.globalData.shareContent
  }
})
