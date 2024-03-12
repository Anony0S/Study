// components/block/block.ts
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
        type: String,
        default: '',
    },
    desc: {
        type: String,
        default: '',
    },
    operList: Array,
    padding: {
        type: Boolean,
        default: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickHandle(e: any) {
        const { type } = e.currentTarget.dataset;
        this.triggerEvent('clickoper', type);
    },
  }
})
