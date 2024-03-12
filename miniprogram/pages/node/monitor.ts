// pages/node/monitor.ts
// @ts-ignore
import * as echarts from '../../components/ec-canvas/echarts';
import { formatDate } from '../../utils/util'
const app = getApp<IAppOption>()
let mychart: any | null = null
let monitors: MonitorInfo[] = []
const units = {
  upBandwidth: 'Mbps',
  downBandwidth: 'Mbps',
  cpuUsage: '%',
  diskUsage: '%',
  memUsage: '%',
  natType: '',
  onlineCount: '%',
  tcpNatType: '',
  udpNatType: '',
  packetLoss: '%',
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: formatDate(new Date()),
    endDate: formatDate(new Date()),
    device_id: '',
    biz_type: undefined as number | undefined,
    tabs: [
      "上行带宽",
      "下行带宽",
      "CPU",
      "磁盘",
      "内存",
    ],
    tabkeys: [
      'upBandwidth',
      'downBandwidth',
      'cpuUsage',
      'diskUsage',
      'memUsage',
    ],
    chart: null,
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    currentTab: 0
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
    const info = app.globalData.currentNode
    if (info) {
      const biz_type = info.biz_type
      this.setData({
        device_id: info.device_id,
        biz_type: biz_type,
      }) 
      this.setTabsInfo(biz_type)
    }
    this.initChart()
    this.query()
  },
  setTabsInfo (biz_type: number) {
    const tabs = this.getBizTypeInfo(biz_type)
    this.setData({
      tabs: Object.values(tabs) as string[],
      tabkeys: Object.keys(tabs)
    })
  },
  getBizTypeInfo (biz_type: number) {
    if (biz_type === 4) {
      return {
        upBandwidth: "上行带宽",
        downBandwidth: "下行带宽",
        cpuUsage: "CPU",
        diskUsage: "磁盘",
        memUsage: "内存",
        tcpNatType: 'TCP-NAT类型',
        udpNatType: 'UDP-NAT类型',
        packetLoss: '丢包率',
      };
    } else if (biz_type === 5) {
      return {
        upBandwidth: "上行带宽",
        // downBandwidth: "下行带宽",
        // natType: 'NAT类型',
        // onlineCount: '在线率',
      };
    } else if (biz_type === 8) {
      return {
        upBandwidth: "上行带宽",
        downBandwidth: "下行带宽",
      };
    } else {
      return {
        upBandwidth: "上行带宽",
        downBandwidth: "下行带宽",
        cpuUsage: "CPU",
        diskUsage: "磁盘",
        memUsage: "内存",
      };
    }
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
    })
  },
  async query () {
    if (!app.globalData.currentNode) return
    const {device_id, biz_type} = app.globalData.currentNode
    try {
      const res = await app.api.post<MonitorInfoResponse>("device/v1/monitor", {
        start: this.data.startDate,
        end: this.data.endDate,
        device_id,
        biz_type
      });
      monitors = res.monitors || [];
      console.log('查询完成---------', monitors)
      this.setChartData(monitors)
    } catch (e) {
      console.log('出现异常', e)
    }
  },
  setChartData (monitors: MonitorInfo[]) {
    if (!mychart) return
    const option = this.getOption(this.data.currentTab, monitors)
    mychart.setOption(option);
  },
  getOption (num: number, monitors: MonitorInfo[]) {
    const key = this.data.tabkeys[num] as keyof typeof units
    const name = `${this.data.tabs[num]} (${units[key]})`
    return {
      tooltip: {
        trigger: "axis",
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
        name,
        max: units[key] === '%' ? 100 : undefined,
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
      series: this.getSeries(num, monitors),
    };
  },
  getSeries (num: number, monitors: MonitorInfo[]) {
    const key = this.data.tabkeys[num] as keyof MonitorInfo
    const data: [number, number][] = [];
    for (const item of monitors) {
      data.push([item.timestamp * 1000, item[key]]);
    }
    const color = '#0052d9';
    return [
      {
        name: this.data.tabs[num],
        type: "line",
        symbol: "none",
        stack: "Total",
        smooth: true,
        data: data,
        color,
        areaStyle: {
          color
        },
      },
    ];
  },
  bindStartDateChange (e: WechatMiniprogram.TouchEvent) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
    this.query()
  },
  bindEndDateChange (e: WechatMiniprogram.TouchEvent) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endDate: e.detail.value
    })
    this.query()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  onTabsChange (e: any) {
    const currentTab = e.detail.value as number
    this.setData({ currentTab: currentTab })
    const option = this.getOption(currentTab, monitors)
    mychart.setOption(option);
  },
  onShareAppMessage () {
    return app.globalData.shareContent
  }
})