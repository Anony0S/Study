// pages/main/main.ts
import * as echarts from '../../components/ec-canvas/echarts';
import { formatDate } from '../../utils/util'
import {scanDeviceId} from '../../utils/util'
const app = getApp<IAppOption>()
let mychart: any | null = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: formatDate(new Date(Date.now() - 24 * 3600 * 1000)),
    moneyData: [] as string[],
    moneyDataLabels: [
      "累计收益",
      "昨日收益",
      "上月收益",
      "本月收益",
    ],
    moneyData2: [] as string[],
    moneyData2Labels: [
      "可提现",
      "不可提现",
      "提现中",
      "累计提现",
    ],
    nodeDataLabels: ["节点总数", "在线节点", "离线节点"],
    // 网络信息
    isps: [
      { label:"全部", value: null },
      { label:"移动", value:"移动" },
      { label:"电信", value:"电信" },
      { label:"联通", value:"联通" }
    ],
    nodeData: [] as number[],
    ispTitleVisible: false,
    ispTitleData: [] as string[],
    ispTitleCurrentValue: undefined as undefined | string | null,
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    noChart: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.initData(); 
  },
  bindTimeChange (e: WechatMiniprogram.TouchEvent) {
    this.setData({
      time: e.detail.value
    })
    this.queryMonitor()
  },
  async initData () {
    const res = await app.api.get<AccountTotalData>("account/v1/total");
    const moneyData  = [
      `${((res.total_increase_amount || 0) / 100).toFixed(2)}`,
      `${((res.last_day_amount || 0) / 100).toFixed(2)}`,
      `${((res.last_mouth_amount || 0) / 100).toFixed(2)}`,
      `${((res.current_mouth_amount || 0) / 100).toFixed(2)}`,
    ];

    const res2 = await app.api.get<UserMoneyResponse>("/account/v1/info");
    const moneyData2  = [
      `${((res2.amount || 0) / 100).toFixed(2)}`,
      `${((res2.transfer_amount || 0) / 100).toFixed(2)}`,
      `${((res2.freeze_amount || 0) / 100).toFixed(2)}`,
      `${((res2.total_decrease_amount || 0) / 100).toFixed(2)}`,
    ];
    const nodeData = [
      res.total_device,
      res.online_device,
      res.total_device - res.online_device,
    ];
    this.setData({
      nodeData,
      moneyData,
      moneyData2
    })
  },
  getOption (monitors: MonitorInfo[]) {
    return {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ['上行带宽', '下行带宽'],
      },
      grid: {
        left: "5%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      toolbox: {
      },
      xAxis: {
        type: "time",
        boundaryGap: false,
        splitLine: {
          show: true,
          lineStyle: {
            width: 1,
            type: 'solid',
            color: 'rgba(226,226,226,0.5)',
          },
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        name: '带宽数据(Mbps)',
        axisTick: {
          show: false,
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(255,255,255,0.2)', 'rgba(226,226,226,0.2)'],
          },
        },
      },
      series: this.getSeries(monitors),
    };
  },
  getSeries (monitors: MonitorInfo[]) {
    const upData: [number, number][] = [];
    const downData: [number, number][] = [];
    for (const item of monitors) {
      upData.push([item.timestamp * 1000, item.upBandwidth]);
      downData.push([item.timestamp * 1000, item.downBandwidth]);
    }
    const color = '#e6a23c';
    return [
      {
        name: '上行带宽',
        type: 'line',
        symbol: 'none',
        smooth: true,
        data: upData,
        color,
        areaStyle: {
          color,
        },
      },
      {
        name: '下行带宽',
        type: 'line',
        symbol: 'none',
        smooth: true,
        data: downData,
        color: '#409eff',
        areaStyle: {
          color: '#409eff',
        },
      },
    ];
  },
  initChart () {
    const comp = this.selectComponent(`#mychart`)
    comp.init((canvas: any, width: number, height: number, dpr: number) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      canvas.setChart(chart);
      mychart = chart
      console.log('初始化完成---------', chart)
      this.queryMonitor();
    })
  },
  async queryMonitor () {
    const isp = this.data.ispTitleCurrentValue
    const res = await app.api.post<MonitorInfoResponse>('account/v1/monitor', {
      time: this.data.time,
      isp: isp || undefined,
    })
    const monitors = res.monitors || [];
    this.setData({
      noChart: monitors.length === 0
    })
    if (!mychart) return
    const option = this.getOption(monitors)
    mychart.setOption(option);
    console.log(res)
    // /account/v1/monitor
  },
  onPickerChange(e: any) {
    const data: {
      value: string[]
      label: string[]
    } = e.detail
    console.log('data', data)
    this.setData({
      ispTitleVisible: false,
      ispTitleData: data.value,
      ispTitleCurrentValue: data.value[0],
    });
    this.queryMonitor()
  },
  onClickPicker () {
    console.log('onClickPicker')
    this.setData({
      ispTitleVisible: true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.initChart()
  },
  toNodeList (e: WechatMiniprogram.TouchEvent) {
    const {index} = e.currentTarget.dataset
    const status = ['','online','offline']
    app.setOnlineStatus(status[index])
    wx.switchTab({url: '/pages/node/node'})
  },
  scanCode () {
    wx.scanCode({
      success (res) {
        const device_id = scanDeviceId(res.result)
        app.setDeviceId(device_id)
        wx.switchTab({url: "/pages/index/index"})
      }
    })
  },
  onShareAppMessage () {
    return app.globalData.shareContent
  }
})