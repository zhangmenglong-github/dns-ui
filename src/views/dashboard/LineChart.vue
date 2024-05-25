<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
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
      default: '350px'
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
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
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
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.getZr().on('click', (event) => {
        if (this.chart.getModel()) {
          const pointInPixel = [event.offsetX, event.offsetY]
          // 使用 convertFromPixel方法 转换像素坐标值到逻辑坐标系上的点。获取点击位置对应的x轴数据的索引         值，借助于索引值的获取到其它的信息
          // 转换X轴坐标
          let pointInGridX = this.chart.convertFromPixel({ seriesIndex: 0 }, pointInPixel);
          // 转换Y轴坐标
          let pointInGridY = this.chart.convertFromPixel({ seriesIndex: 1 }, pointInPixel);
          // x轴数据的索引值
          // 所点击点的X轴坐标点所在X轴data的下标
          let xIndex = pointInGridX[0];
          // 所点击点的Y轴坐标点数值
          let yIndexValue = pointInGridY[1];
          // 使用getOption() 获取图表的option

          let option = this.chart.getOption();
          //获取到x轴的索引值和option之后，我们就可以获取我们需要的任意数据。
          // 点击点的X轴对应坐标的名称
          let time = option.xAxis[0].data[xIndex];

          let yAxisScale = this.chart.getModel().getComponent("yAxis", 0).axis.scale;
          if (yIndexValue <= yAxisScale.getExtent()[1]) {
            if (this.chartData) {
              this.$emit("scaleTimeLine", time)
            }
          }
        }
      });
    },
    setOptions({ timeLine, timeData } = {}) {
      let timeDataSeries = [];
      timeDataSeries.push({
        name: '总查询量',
        smooth: true,
        type: 'line',
        data: timeData.queryCount,
        animationDuration: 2800,
        animationEasing: 'cubicInOut'
      });
      timeDataSeries.push({
        name: 'UDP查询量',
        smooth: true,
        type: 'line',
        data: timeData.udpQueryCount,
        animationDuration: 2800,
        animationEasing: 'cubicInOut'
      });
      timeDataSeries.push({
        name: 'TCP查询量',
        smooth: true,
        type: 'line',
        data: timeData.tcpQueryCount,
        animationDuration: 2800,
        animationEasing: 'cubicInOut'
      });
      timeDataSeries.push({
        name: 'DNSSEC查询量',
        smooth: true,
        type: 'line',
        data: timeData.dnssecRequestCount,
        animationDuration: 2800,
        animationEasing: 'cubicInOut'
      });
      timeDataSeries.push({
        name: '非DNSSEC查询量',
        smooth: true,
        type: 'line',
        data: timeData.noDnssecRequestCount,
        animationDuration: 2800,
        animationEasing: 'cubicInOut'
      });
      timeDataSeries.push({
        name: 'DNSSEC响应量',
        smooth: true,
        type: 'line',
        data: timeData.dnssecResponseCount,
        animationDuration: 2800,
        animationEasing: 'cubicInOut'
      });
      timeDataSeries.push({
        name: '非DNSSEC响应量',
        smooth: true,
        type: 'line',
        data: timeData.noDnssecResponseCount,
        animationDuration: 2800,
        animationEasing: 'cubicInOut'
      });
      this.chart.setOption({
        xAxis: {
          data: timeLine,
            boundaryGap: false,
            axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
            right: 10,
            bottom: 20,
            top: 50,
            containLabel: true
        },
        tooltip: {
          trigger: 'axis',
            axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['总查询量', 'UDP查询量', 'TCP查询量', 'DNSSEC查询量', '非DNSSEC查询量', 'DNSSEC响应量', '非DNSSEC响应量']
        },
        toolbox: {
          show: true,
            feature: {
            saveAsImage: {}
          }
        },
        series: timeDataSeries
      })
    }
  }
}
</script>
