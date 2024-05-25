<template>
  <div class="dashboard-editor-container">

    <panel-group :statistics-count="statisticsCount"/>

    <el-row>
      <el-date-picker
        @change="changeSelectDate"
        v-model="selectedDate"
        type="date"
        :picker-options="pickerOptions"
        :clearable="false">
      </el-date-picker>
      <el-select v-loading="loading" @change="changeSelectDnsDomainName" v-model="queryStatisticsParams.id">
        <el-option
          v-for="dnsDomainName in dnsDomainNameList"
          :key="dnsDomainName.id"
          :label="dnsDomainName.domainName"
          :value="dnsDomainName.id">
        </el-option>
        <el-pagination
          class="pagination"
          v-show="dnsDomainNameTotal > 10"
          small
          layout="prev, pager, next"
          :total="dnsDomainNameTotal"
          :current-page.sync="queryDnsDomainNameParams.pageNum"
          :page-size.sync="queryDnsDomainNameParams.pageSize"
          @current-change="getDnsDomainNameList(false)">
        </el-pagination>
        <div class="pagination-space"></div>
      </el-select>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart @scaleTimeLine="lineChartScaleTimeLine" :chart-data="statisticsLineData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart :chart-data="queryTypeStatistics" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart @showDomainTypeCount="changeCurrentQueryNameTypeStatistics" :chart-data="queryNameStatistics" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart :chart-data="currentQueryNameTypeStatistics" />
        </div>
      </el-col>
    </el-row>


    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <word-map :chart-data="visitedMapData"></word-map>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import WordMap from './dashboard/WordMap.vue'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
import {
  listDnsDomainNameNormal,
  dnsDomainNameStatistics,
  listDnsDomainNameStatisticsCount,
  dnsDomainNameStatisticsQueryName,
  dnsDomainNameStatisticsQueryType,
  dnsDomainNameStatisticsQueryNameType,
  dnsDomainNameStatisticsQueryGeo
} from '@/api/platform/dnsDomainName'

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    WordMap,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      currentQueryNameTypeStatistics: {
        queryName: "",
        queryTypeCount: {}
      },
      queryNameTypeStatistics: [],
      queryNameStatistics: [],
      queryTypeStatistics: [],
      visitedMapData: {},
      statisticsCount: {
        domainNameCount: 0,
        enableDnssecCount: 0,
        domainNameStatusNormalCount: 0,
        domainNameStatusNormalException: 0
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      selectedDate: new Date(),
      loading: true,
      currentDate: new Date(),
      statisticsLineData: {
        timeLine: [],
        timeData: {
          queryCount: [],
          udpQueryCount: [],
          tcpQueryCount: [],
          dnssecRequestCount: [],
          noDnssecRequestCount: [],
          dnssecResponseCount: [],
          noDnssecResponseCount: []
        }
      },
      dnsDomainNameList: [],
      dnsDomainNameTotal: 0,
      // 查询参数
      queryDnsDomainNameParams: {
        pageNum: 1,
        pageSize: 10
      },
      queryStatisticsParams: {
        id: null,
        params: {
          intervalType: "DAY",
          date: new Date().getTime(),
        }
      }

    }
  },
  created() {
    this.getDnsDomainNameList(true);
    this.getDnsDomainNameStatisticsCount();
  },
  methods: {
    changeCurrentQueryNameTypeStatistics(domainName) {
      this.queryNameTypeStatistics.forEach(queryNameType => {
        if (queryNameType.queryName == domainName) {
          this.currentQueryNameTypeStatistics = queryNameType;
        }
      })
    },
    getDnsDomainNameStatisticsQueryGeo() {
      dnsDomainNameStatisticsQueryGeo(this.queryStatisticsParams).then(response => {
        this.visitedMapData = response.data.data;
      })
    },
    getDnsDomainNameStatisticsQueryNameType() {
      dnsDomainNameStatisticsQueryNameType(this.queryStatisticsParams).then(response => {
        this.queryNameTypeStatistics = response.data.data;
        if (this.queryNameTypeStatistics.length) {
          let maxTypeCount = 0;
          let currentQueryNameTypeStatisticsMax = null;
          this.queryNameTypeStatistics.forEach(queryNameType => {
            let queryNameTypeCount = Object.keys(queryNameType.queryTypeCount).length;
            currentQueryNameTypeStatisticsMax = (maxTypeCount < queryNameTypeCount) ? queryNameType : currentQueryNameTypeStatisticsMax;
            maxTypeCount = (maxTypeCount < queryNameTypeCount) ? queryNameTypeCount : maxTypeCount;
          })
          this.currentQueryNameTypeStatistics = currentQueryNameTypeStatisticsMax;
        }
      })
    },
    getDnsDomainNameStatisticsQueryType() {
      dnsDomainNameStatisticsQueryType(this.queryStatisticsParams).then(response => {
        this.queryTypeStatistics = response.data.data;
      })
    },
    getDnsDomainNameStatisticsQueryName() {
      dnsDomainNameStatisticsQueryName(this.queryStatisticsParams).then(response => {
        this.queryNameStatistics = response.data.data;
      })
    },
    getDnsDomainNameStatisticsCount() {
      listDnsDomainNameStatisticsCount().then(response => {
        this.statisticsCount.domainNameCount = response.data.domainNameCount;
        this.statisticsCount.enableDnssecCount = response.data.enableDnssecCount;
        this.statisticsCount.domainNameStatusNormalCount = response.data.domainNameStatusNormalCount;
        this.statisticsCount.domainNameStatusNormalException = this.statisticsCount.domainNameCount - this.statisticsCount.domainNameStatusNormalCount;
      });
    },
    changeSelectDnsDomainName() {
      this.reloadLineChart();
      this.getDnsDomainNameStatisticsQueryName();
      this.getDnsDomainNameStatisticsQueryType();
      this.getDnsDomainNameStatisticsQueryNameType();
      this.getDnsDomainNameStatisticsQueryGeo();
    },
    changeSelectDate(date) {
      this.currentDate = new Date(date);
      this.queryStatisticsParams.params.intervalType = "DAY";
      this.queryStatisticsParams.params.date = this.currentDate.getTime();
      this.reloadLineChart();
      this.getDnsDomainNameStatisticsQueryName();
      this.getDnsDomainNameStatisticsQueryType();
      this.getDnsDomainNameStatisticsQueryNameType();
      this.getDnsDomainNameStatisticsQueryGeo();
    },
    reloadLineChart() {
      dnsDomainNameStatistics(this.queryStatisticsParams).then(response => {
        this.statisticsLineData = response.data.data;
      })
    },
    getDnsDomainNameList(init) {
      this.loading = true;
      listDnsDomainNameNormal(this.queryDnsDomainNameParams).then(response => {
        this.dnsDomainNameList = response.rows;
        this.dnsDomainNameTotal = response.total;
        this.loading = false;
        if (init && this.dnsDomainNameTotal) {
          this.queryStatisticsParams.id = this.dnsDomainNameList[0].id;
          this.queryStatisticsParams.params.date = new Date().getTime();
          this.reloadLineChart();
          this.getDnsDomainNameStatisticsQueryName();
          this.getDnsDomainNameStatisticsQueryType();
          this.getDnsDomainNameStatisticsQueryNameType();
          this.getDnsDomainNameStatisticsQueryGeo();
        }
      });
    },
    lineChartScaleTimeLine(time) {
      let requestDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), time.split(":")[0], time.split(":")[1], time.split(":")[2]);
      if (this.queryStatisticsParams.params.intervalType == "DAY") {
        this.queryStatisticsParams.params.intervalType = "HOUR";
      } else if (this.queryStatisticsParams.params.intervalType == "HOUR") {
        this.queryStatisticsParams.params.intervalType = "MINUTE";
      } else {
        this.queryStatisticsParams.params.intervalType = "DAY";
      }
      this.queryStatisticsParams.params.date = requestDate.getTime();
      this.reloadLineChart();
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

.pagination{
  position: absolute;
  bottom: 0;
}
.pagination-space{
  width: 100%;
  height: 24px;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
