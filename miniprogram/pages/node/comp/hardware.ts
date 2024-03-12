// pages/node/comp/hardware.ts
interface LabelInfo {
  label: string
  value: string
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: () => ({})
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    allMemory: 0 as number | string,
    cpuInfo: [] as any[],
    diskInfo: [] as any[],
    device4HardwareInfo: [] as LabelInfo[],
    isDefault: false as boolean,
    isDeviceInfo4: false as boolean,
    isDeviceInfo8: false as boolean,
    isDeviceInfo5: false as boolean,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getAllMemory: (memory: string) => {
      const num = parseInt(memory);
      if (!isNaN(num)) {
        return Math.ceil(num / 1024 / 1024 / 1024);
      } else {
        return "";
      }
    },
  },
  ready() {
    const deviceInfo = this.data.info;
    console.log(deviceInfo)
    this.setData({
      isDeviceInfo4: "disk_size" in deviceInfo,
      isDeviceInfo5: "networks" in deviceInfo,
      isDefault: 'device_hardware_extend' in deviceInfo
    })
    // 默认的
    if ('device_hardware_extend' in deviceInfo) {
      const info = deviceInfo.device_hardware_extend || {}
      const disk_info = (info.device_disk_info || []).map((item: any) => {
        const size = Number(item.size) / 1024 / 1024 / 1024;
        const sizeText = size > 1024 ? (size / 1024).toFixed(2) + 'TB' : size.toFixed(2) + 'GB';
        return {
          name: item.id,
          type: item.media,
          iops: item.iops === 0 ? '' : item.iops,
          size: sizeText,
        };
      });
      this.setData({
        allMemory: this.getAllMemory(info.memory_size),
        cpuInfo: [
          {
            name: info.cpu_type,
            core_number: info.cpu_num,
            ghz: (Number(info.cpu_frequency || 0) / 1000000000).toFixed(1) + 'GHz',
          },
        ],
        diskInfo: disk_info
      });
    }
   
    // biz_type === 4
    if ("disk_size" in deviceInfo) {
      const info = deviceInfo
      const size = Number(info.memory_size) / 1024 / 1024 / 1024;
      const sizeText =
        size > 1024 ? (size / 1024).toFixed(2) + "TB" : size.toFixed(2) + "GB";
      this.setData({
        device4HardwareInfo: [{
          label: 'CPU架构',
          value:  info.cpu_arch
        }, {
          label: 'CPU核数',
          value:  info.cpu_cores
        }, {
          label: '磁盘总空间',
          value: (Number(info.disk_size) / 1024 / 1024 / 1024).toFixed(2) + 'GB'
        }, {
          label: '内存总空间',
          value: sizeText
        }]
      })
    }

    // biz_type === 5
    if ("networks" in deviceInfo) {
      
    }
  },
})
