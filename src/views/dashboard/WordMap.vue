<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
import wordMap from '@/assets/map/world.json'
import resize from './mixins/resize'

require('echarts/theme/macarons') // echarts theme
export default {
  dicts: ['country_name_code'],
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      countryCodeMap: new Map()
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler() {
        this.setOptions()
      }
    }
  },
  mounted() {
    let intervalHandle = setInterval(() => {
      let countryNameCodeDict = this.dict.type.country_name_code;
      if (countryNameCodeDict.length) {
        countryNameCodeDict.forEach(dict => {
          this.countryCodeMap.set(dict.value, dict.label);
        });
      }
      clearInterval(intervalHandle);
      this.setOptions();
    }, 1000)
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return ;
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      echarts.registerMap("world", {
        geoJSON: wordMap
      });
      this.chart = echarts.init(this.$el, 'macarons');
      this.setOptions();
    },
    setOptions() {
      let nullGeoCount = 0;
      let mapSeriesData = [];
      let max = 0;
      Object.keys(this.chartData).forEach(countryCode => {
        if (this.countryCodeMap.get(countryCode)) {
          mapSeriesData.push({
            name: this.countryCodeMap.get(countryCode),
            value: this.chartData[countryCode]
          });
        } else {
          nullGeoCount = this.chartData[countryCode];
        }
        max = max < this.chartData[countryCode] ? this.chartData[countryCode] : max;
      });
      max = (max == 0) ? 9999 : max;
      this.chart.setOption({
        visualMap: { // 分区域着色
          min: 0,
          max: max,
          inRange: {
            color: ['#EDEDED', '#A3CBFF', '#41ABFF', '#1681F0', '#3267D7']
          },
          textStyle: { //文本样式
            color: '#777F86'
          },
          bottom: 15 // 组件离容器下侧的距离
        },
        // 移到国家上的效果
        tooltip: {
          trigger: 'item',
          padding: 0,
          enterable: true,
          transitionDuration: 1,
          textStyle: {
            color: '#818A91',
            decoration: 'none',
          },
          backgroundColor: 'rgba(255,255,255,0.96)',
          // borderColor:'#000000',
          //borderWidth: 1,
          formatter: function(params) {
            if (params.data) {
              let tipContent = '来自' + params.data.name + '的请求' + params.data.value + "个";
              return '<div style="box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.3);border-radius:4px;padding:10px 10px;">' +
                '<div style="font-size: 16px;">' + tipContent + '</div>' +
                '<div style="font-size: 16px;">' + '未知来源请求' + nullGeoCount + '个</div>';
            } else {
              return '<div style="box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.3);border-radius:4px;padding:10px 10px;">' +
                '<div style="font-size: 16px;">' + '未知来源请求' + nullGeoCount + '个</div>';
            }
          }
        },
        series: [
          {
            type: 'map',
            name: '世界地图',
            map: 'world',
            geoIndex: 0,
            zlevel:2,
            zoom: 1.2,
            roam: true, // 是否开启鼠标缩放和平移漫游
            itemStyle: { // 每个区域的样式
              normal: {
                areaColor: '#EDEDED',
                borderColor: '#D3D7E1', // 图形的描边颜色
                borderWidth: 1 //描边线宽
              },
              emphasis: { // 高亮状态
                areaColor: '#7d7d7d'
              }
            },
            data: mapSeriesData
          }
        ]
      })
    }
  }
}
</script>
