// pages/node/comp/network.ts
interface NetworkInfo {
  key: string
  label: string
  value: string
}
const networkLabels: {} = {
  ip: 'IP',
  ip_protocol: 'IP协议栈',
  isp: '运营商',
  province_city: '省市',
  tcp_nat_type: 'TCP NAT',
  nat_type: 'NAT',
  udp_nat_type: 'UDP NAT',
  device_net_card_extend: '管理线路',
  dialing_type: '网络类型',
  dialingInfo: '管理线路',
  up_bandwidth: '上报带宽(Mbps)',
}
export const dialingTypeStr: {
  [key in DialingType]: string;
} = {
  PPPOE: "服务器拨号",
  "1VN": "路由器",
  PUBLIC_MULTI_IP: "固定公网多IP",
  PUBLIC_SINGLE_IP: "固定公网单IP",
};
const getDialingResult = (type: DialingType, netcards?: NetCardInfo[]) => {
  if (!netcards) {
    return "查看>";
  }
  let allNum = 0;
  let successedNum = 0;
  let connectedNum = 0;
  for (const item of netcards) {
    const dialinginfo = item.dialingInfo;
    allNum += dialinginfo.length;
    successedNum += dialinginfo.filter((item) => item.successed).length;
    connectedNum += dialinginfo.filter((item) => item.connected).length;
  }
  if (type === "PUBLIC_MULTI_IP" || type === "PUBLIC_SINGLE_IP") {
    return `配置${allNum}条|连通${successedNum}条>`;
  } else {
    return `拨号${allNum}条|拨通${successedNum}条|联网${connectedNum}条>`;
  }
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: {} as DeviceInfo,
      value: () => ({})
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    content: [] as NetworkInfo[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDialing (e: WechatMiniprogram.TouchEvent) {
      const key = e.currentTarget.dataset.key
      if (key === 'dialingInfo') {
        wx.navigateTo({url: "/pages/node/dialing"})
      } else if (key === 'device_net_card_extend') {
        wx.navigateTo({url: "/pages/node/netcard"})
      }
    },
    openDialog () {
      this.triggerEvent('open');
    },
    openobdlog () {
      this.triggerEvent('obdlog');
    },
    toDetail () {
      wx.navigateTo({url: "/pages/node/test"})
    }
  },
  ready() {
    const info: DeviceInfo = this.properties.info
    let networkContent = {}
    if (info.biz_type !== 4 && info.biz_type !== 5 && info.biz_type !== 8) {
      networkContent = {
        ip: info.ip,
        ip_protocol: info.ip_protocol,
        isp: info.isp,
        province_city: `${info.province}/${info.city}`,
        device_net_card_extend: '配置管理线路>',
        dialing_type: dialingTypeStr[info.dialing_type] || '--',
        dialingInfo: getDialingResult(info.dialing_type, info.device_net_card_extend.net_cards),
        up_bandwidth: (info.up_bandwidth / 1024 / 1024).toFixed(0),
      }
    } else if (info.biz_type === 4) {
        networkContent = {
          ip: info.ip,
          isp: info.isp,
          tcp_nat_type: `${info.tcp_nat_type}`,
          udp_nat_type: `${info.udp_nat_type}`,
          province_city: `${info.province}`,
        }
      } else if (info.biz_type === 8) {
        networkContent = {
          ip: info.ip,
          isp: info.isp,
          nat_type: `${info.nat_type}`,
        }
    } else {
      networkContent = {
        ip: info.ip,
        isp: info.isp,
        province_city: `${info.province}`,
      }
    }
    const content: NetworkInfo[] = []
    for (const k in networkContent) {
      const key = k as keyof NetworkContent
      content.push({
        key,
        label: networkLabels[key],
        value: networkContent[key]
      })
    }
    this.setData({content})
  },
})
