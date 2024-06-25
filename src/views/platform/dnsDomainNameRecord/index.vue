<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="记录名" prop="recordName">
        <el-input
          v-model="queryParams.recordName"
          placeholder="请输入记录名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="记录类型" prop="recordType">
        <el-select v-model="queryParams.recordType" placeholder="请选择记录类型" clearable>
          <el-option
            v-for="dict in dict.type.record_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="记录地理位置" prop="recordGeo">
        <el-select v-model="queryParams.recordGeo" placeholder="请选择记录地理位置" clearable>
          <el-option
            v-for="dict in dict.type.geo_code"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['platform:dnsDomainName:edit']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['platform:dnsDomainName:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['platform:dnsDomainName:edit']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['platform:dnsDomainName:edit']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="记录名" align="center" prop="recordName" />
      <el-table-column label="记录类型" align="center" prop="recordType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.record_type" :value="scope.row.recordType"/>
        </template>
      </el-table-column>
      <el-table-column label="记录地理位置" align="center" prop="recordGeo">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.geo_code" :value="scope.row.recordGeo"/>
        </template>
      </el-table-column>
      <el-table-column label="记录TTL" align="center" prop="recordTtl" />
      <el-table-column label="记录值" align="center" prop="recordValue" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['platform:dnsDomainName:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['platform:dnsDomainName:edit']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改域名记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="主机记录" prop="recordName" v-if="form.recordType != '6'">
          <el-input placeholder="请输入主机记录" v-model="form.recordName">
            <template slot="append">.{{domainName}}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="记录类型" prop="recordType">
          <el-select @change="changeRecordType" v-model="form.recordType" placeholder="请选择记录类型">
            <el-option
              v-for="dict in dict.type.record_type"
              v-show="((form.id ? ((form.recordType == '6') ? (dict.value == '6') : (dict.value != '6')) : (dict.value != '6')))"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地理位置" prop="recordGeo" v-if="form.recordType != '6'">
          <el-select v-model="form.recordGeo" placeholder="请选择记录地理位置">
            <el-option
              v-for="dict in dict.type.geo_code"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="TTL" prop="recordTtl">
          <el-input-number v-model="form.recordTtl" controls-position="right" :min="0" :max="86400"></el-input-number>
        </el-form-item>
        <el-form-item label="ipv4地址" prop="ipv4" v-if="form.recordType == '1'">
          <el-input v-model="form.ipv4" placeholder="请输入ipv4地址" />
        </el-form-item>
        <el-form-item label="NS服务器" prop="nsName" v-if="form.recordType == '2'">
          <el-input v-model="form.nsName" placeholder="请输入NS服务器" />
        </el-form-item>
        <el-form-item label="别名" prop="cnameName" v-if="form.recordType == '5'">
          <el-input v-model="form.cnameName" placeholder="请输入别名" />
        </el-form-item>
        <el-form-item label="主名称服务器" prop="host" v-if="form.recordType == '6'">
          <el-input v-model="form.host" placeholder="host" />
        </el-form-item>
        <el-form-item label="管理员邮箱" prop="admin" v-if="form.recordType == '6'">
          <el-input v-model="form.admin" placeholder="admin" />
        </el-form-item>
        <el-form-item label="区域序列号" prop="serial" v-if="form.recordType == '6'">
          <el-input-number v-model="form.serial" controls-position="right" :min="0" :max="Number.MAX_VALUE" placeholder="serial" ></el-input-number>
        </el-form-item>
        <el-form-item label="序列号刷新时间" prop="refresh" v-if="form.recordType == '6'">
          <el-input-number v-model="form.refresh" controls-position="right" :min="0" :max="Number.MAX_VALUE" placeholder="refresh" ></el-input-number>
        </el-form-item>
        <el-form-item label="序列号重试时间" prop="retry" v-if="form.recordType == '6'">
          <el-input-number v-model="form.retry" controls-position="right" :min="0" :max="Number.MAX_VALUE" placeholder="retry" ></el-input-number>
        </el-form-item>
        <el-form-item label="序列号过期时间" prop="expire" v-if="form.recordType == '6'">
          <el-input-number v-model="form.expire" controls-position="right" :min="0" :max="Number.MAX_VALUE" placeholder="expire" ></el-input-number>
        </el-form-item>
        <el-form-item label="区域中最小TTL" prop="minimum" v-if="form.recordType == '6'">
          <el-input-number v-model="form.minimum" controls-position="right" :min="0" :max="Number.MAX_VALUE" placeholder="minimum" ></el-input-number>
        </el-form-item>
        <el-form-item label="优先级" prop="priority" v-if="(form.recordType == '15') || (form.recordType == '33') || (form.recordType == '65')">
          <el-input-number v-model="form.priority" controls-position="right" :min="0" :max="65535"></el-input-number>
        </el-form-item>
        <el-form-item label="邮件服务器" prop="mxName" v-if="form.recordType == '15'">
          <el-input v-model="form.mxName" placeholder="请输入邮件服务器" />
        </el-form-item>
        <el-form-item label="TXT记录值" prop="txtContent" v-if="form.recordType == '16'">
          <el-input v-model="form.txtContent" :maxlength="255" placeholder="请输入TXT记录内容" />
        </el-form-item>
        <el-form-item label="ipv6地址" prop="ipv6" v-if="form.recordType == '28'">
          <el-input v-model="form.ipv6" placeholder="请输入ipv6地址" />
        </el-form-item>
        <el-form-item label="权重" prop="weight" v-if="form.recordType == '33'">
          <el-input-number v-model="form.weight" controls-position="right" :min="0" :max="65535"></el-input-number>
        </el-form-item>
        <el-form-item label="端口" prop="port" v-if="form.recordType == '33'">
          <el-input-number v-model="form.port" controls-position="right" :min="0" :max="65535"></el-input-number>
        </el-form-item>
        <el-form-item label="目标地址" prop="srvName" v-if="form.recordType == '33'">
          <el-input v-model="form.srvName" placeholder="请输入目标地址" />
        </el-form-item>
        <el-form-item label="目标域名" prop="httpsName" v-if="form.recordType == '65'">
          <el-input v-model="form.httpsName" placeholder="请输入目标域名" />
        </el-form-item>
        <el-form-item label="alpn" prop="alpn" v-if="form.recordType == '65'">
          <el-input v-model="form.alpn" placeholder="h3,h2" />
        </el-form-item>
        <el-form-item label="ipv4hint" prop="ipv4hint" v-if="form.recordType == '65'">
          <el-input v-model="form.ipv4hint" placeholder="127.0.0.1" />
        </el-form-item>
        <el-form-item label="ipv6hint" prop="ipv6hint" v-if="form.recordType == '65'">
          <el-input v-model="form.ipv6hint" placeholder="::1" />
        </el-form-item>
        <el-form-item label="port" prop="port" v-if="form.recordType == '65'">
          <el-input v-model="form.port" placeholder="80" />
        </el-form-item>
        <el-form-item label="flag" prop="flag" v-if="form.recordType == '257'">
          <el-input-number v-model="form.flag" controls-position="right" :min="0" :max="255"></el-input-number>
        </el-form-item>
        <el-form-item label="tag" prop="tag" v-if="form.recordType == '257'">
          <el-select v-model="form.tag" placeholder="请选择tag">
            <el-option
              key="issue"
              label="issue"
              value="issue">
            </el-option>
            <el-option
              key="issuewild"
              label="issuewild"
              value="issuewild">
            </el-option>
            <el-option
              key="iodef"
              label="iodef"
              value="iodef">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="value" prop="value" v-if="form.recordType == '257'">
          <el-input v-model="form.value" placeholder="value" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {
  listDnsDomainNameRecord,
  addDnsDomainNameRecord,
  getDnsDomainNameRecord,
  updateDnsDomainNameRecord,
  delDnsDomainNameRecord
} from '@/api/platform/dnsDomainName'

export default {
  name: "Record",
  dicts: ['geo_code', 'record_type'],
  data() {
    return {
      operationType: "add",
      domainName: "",
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 域名记录表格数据
      recordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        domainNameId: null,
        recordName: null,
        recordType: null,
        recordGeo: null,
        recordTtl: null,
        recordValue: null,
        recordContent: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        recordType: [
          { required: true, message: "记录类型不能为空", trigger: "change" }
        ],
        recordGeo: [
          { required: true, message: "记录地理位置不能为空", trigger: "change" }
        ],
        recordTtl: [
          { required: true, message: "记录TTL不能为空", trigger: "blur" }
        ],
        ipv4: [
          { required: true, message: "ipv4地址不能为空", trigger: "blur" },
          { required: true, message: "ipv4地址格式不正确", pattern: /^((1?[1-9]?\d|[1-2][0-4]\d|25[0-5])\.){3}(1?[1-9]?\d|[1-2][0-4]\d|25[0-5])$/}
        ],
        nsName: [
          { required: true, message: "ipv4地址不能为空", trigger: "blur" }
        ],
        cnameName: [
          { required: true, message: "别名不能为空", trigger: "blur" }
        ],
        priority: [
          { required: true, message: "优先级不能为空", trigger: "blur" }
        ],
        mxName: [
          { required: true, message: "邮件服务器不能为空", trigger: "blur" }
        ],
        txtContent: [
          { required: true, message: "TXT记录不能为空", trigger: "blur" }
        ],
        ipv6: [
          { required: true, message: "ipv6地址不能为空", trigger: "blur" },
          { required: true, message: "ipv6地址格式不正确", pattern: /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/}
        ],
        weight: [
          { required: true, message: "权重不能为空", trigger: "blur" }
        ],
        port: [
          { required: true, message: "端口不能为空", trigger: "blur" }
        ],
        srvName: [
          { required: true, message: "目标地址不能为空", trigger: "blur" }
        ],
        httpsName: [
          { required: true, message: "目标域名不能为空", trigger: "blur" }
        ],
        flag: [
          { required: true, message: "flag不能为空", trigger: "blur" }
        ],
        tag: [
          { required: true, message: "tag不能为空", trigger: "blur" }
        ],
        value: [
          { required: true, message: "value不能为空", trigger: "blur" }
        ],
        host: [
          { required: true, message: "host不能为空", trigger: "blur" }
        ],
        admin: [
          { required: true, message: "admin不能为空", trigger: "blur" }
        ],
        serial: [
          { required: true, message: "serial不能为空", trigger: "blur" }
        ],
        refresh: [
          { required: true, message: "refresh不能为空", trigger: "blur" }
        ],
        retry: [
          { required: true, message: "retry不能为空", trigger: "blur" }
        ],
        expire: [
          { required: true, message: "expire不能为空", trigger: "blur" }
        ],
        minimum: [
          { required: true, message: "minimum不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.domainName = this.$route.query.domainName;
    this.queryParams.domainNameId = this.$route.query.domainNameId;
    this.getList();
  },
  methods: {
    changeRecordType(type) {
      if (type == "65") {
        this.rules.port[0] = { required: false, message: "端口不能为空", trigger: "blur" }
      } else {
        this.rules.port[0] = { required: true, message: "端口不能为空", trigger: "blur" }
      }
    },
    /** 查询域名记录列表 */
    getList() {
      this.loading = true;
      listDnsDomainNameRecord(this.queryParams).then(response => {
        this.recordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        domainNameId: null,
        recordName: null,
        recordType: "1",
        recordGeo: null,
        recordTtl: null,
        recordValue: null,
        recordContent: null,
        ipv4: null,
        nsName: null,
        cnameName: null,
        priority: null,
        mxName: null,
        txtContent: null,
        ipv6: null,
        weight: null,
        port: null,
        srvName: null,
        httpsName: null,
        alpn: null,
        ipv4hint: null,
        ipv6hint: null,
        flag: null,
        tag: null,
        value: null,
        host: null,
        admin: null,
        serial: null,
        refresh: null,
        retry: null,
        expire: null,
        minimum: null
      };
      this.rules.port[0] = { required: true, message: "端口不能为空", trigger: "blur" }
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.domainNameId = this.$route.query.domainNameId;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加域名记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDnsDomainNameRecord(row).then(response => {
        this.form = response.data.data;
        this.form.recordType = "" + this.form.recordType;
        this.form.recordName = this.form.recordName.substring(0, (this.form.recordName.length - this.domainName.length - 1));
        switch (this.form.recordType) {
          case "1": {
            this.$set(this.form, "ipv4", this.form.recordValue);
            break;
          }
          case "2": {
            this.$set(this.form, "nsName", this.form.recordValue);
            break;
          }
          case "5": {
            this.$set(this.form, "cnameName", this.form.recordValue);
            break;
          }
          case "6": {
            let recordContentSection = this.form.recordValue.split(" ");
            if (recordContentSection.length) {
              recordContentSection[1] = recordContentSection[1].replace("\\@", "@");
              recordContentSection[1] = recordContentSection[1].replace("\\.", "@");
              this.$set(this.form, "host", recordContentSection[0]);
              this.$set(this.form, "admin", recordContentSection[1].substring(0, recordContentSection[1].length - 1));
              this.$set(this.form, "serial", recordContentSection[2]);
              this.$set(this.form, "refresh", recordContentSection[3]);
              this.$set(this.form, "retry", recordContentSection[4]);
              this.$set(this.form, "expire", recordContentSection[5]);
              this.$set(this.form, "minimum", recordContentSection[6]);
            }
            break;
          }
          case "15": {
            let recordContentSection = this.form.recordValue.split(" ");
            if (recordContentSection.length) {
              this.$set(this.form, "priority", recordContentSection[0]);
              this.$set(this.form, "mxName", recordContentSection[1]);
            }
            break;
          }
          case "16": {
            this.$set(this.form, "txtContent", this.form.recordValue.substring(1, this.form.recordValue.length - 1));
            break;
          }
          case "28": {
            this.$set(this.form, "ipv6", this.form.recordValue);
            break;
          }
          case "33": {
            let recordContentSection = this.form.recordValue.split(" ");
            if (recordContentSection.length) {
              this.$set(this.form, "priority", recordContentSection[0]);
              this.$set(this.form, "weight", recordContentSection[1]);
              this.$set(this.form, "port", recordContentSection[2]);
              this.$set(this.form, "srvName", recordContentSection[3]);
            }
            break;
          }
          case "65": {
            this.rules.port[0] = { required: false, message: "端口不能为空", trigger: "blur" }
            let recordContentSection = this.form.recordValue.split(" ");
            if (recordContentSection.length) {
              this.$set(this.form, "priority", recordContentSection[0]);
              this.$set(this.form, "httpsName", recordContentSection[1]);
              for (let index = 2; index < recordContentSection.length; index++) {
                let recordValueItem = recordContentSection[index].split("=");
                if (recordValueItem.length) {
                  this.$set(this.form, recordValueItem[0], recordValueItem[1]);
                }
              }
            }
            break;
          }
          case "257": {
            let recordContentSection = this.form.recordValue.split(" ");
            if (recordContentSection.length) {
              this.$set(this.form, "flag", recordContentSection[0]);
              this.$set(this.form, "tag", recordContentSection[1]);
              this.$set(this.form, "value", recordContentSection[2].substring(1, recordContentSection[2].length - 1));
            }
            break;
          }
        }
        this.open = true;
        this.title = "修改域名记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            let submitForm = {
              id: this.form.id,
              domainNameId: this.$route.query.domainNameId,
              recordGeo: this.form.recordGeo,
              recordName: this.form.recordName,
              recordTtl: this.form.recordTtl,
              recordType: this.form.recordType
            }
            switch (submitForm.recordType) {
              case "1": {
                submitForm.params = {
                  ipv4: this.form.ipv4
                }
                break;
              }
              case "2": {
                submitForm.params = {
                  nsName: this.form.nsName
                }
                break;
              }
              case "5": {
                submitForm.params = {
                  cnameName: this.form.cnameName
                }
                break;
              }
              case "6": {
                submitForm.params = {
                  host: this.form.host,
                  admin: this.form.admin,
                  serial: this.form.serial,
                  refresh: this.form.refresh,
                  retry: this.form.retry,
                  expire: this.form.expire,
                  minimum: this.form.minimum
                }
                break;
              }
              case "15": {
                submitForm.params = {
                  priority: this.form.priority,
                  mxName: this.form.mxName
                }
                break;
              }
              case "16": {
                submitForm.params = {
                  txtContent: this.form.txtContent
                }
                break;
              }
              case "28": {
                submitForm.params = {
                  ipv6: this.form.ipv6
                }
                break;
              }
              case "33": {
                submitForm.params = {
                  priority: this.form.priority,
                  weight: this.form.weight,
                  port: this.form.port,
                  srvName: this.form.srvName
                }
                break;
              }
              case "65": {
                submitForm.params = {
                  httpsName: this.form.httpsName,
                  priority: this.form.priority,
                  alpn: this.form.alpn,
                  ipv4hint: this.form.ipv4hint,
                  ipv6hint: this.form.ipv6hint,
                  port: this.form.port
                }
                break;
              }
              case "257": {
                submitForm.params = {
                  flag: this.form.flag,
                  tag: this.form.tag,
                  value: this.form.value
                }
                break;
              }
            }
            updateDnsDomainNameRecord(submitForm).then(response => {
              if (response.data.code == 0) {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.$modal.msgError(response.data.message);
              }
            });
          } else {
            let submitForm = {
              domainNameId: this.$route.query.domainNameId,
              recordGeo: this.form.recordGeo,
              recordName: this.form.recordName,
              recordTtl: this.form.recordTtl,
              recordType: this.form.recordType
            }
            switch (submitForm.recordType) {
              case "1": {
                submitForm.params = {
                  ipv4: this.form.ipv4
                }
                break;
              }
              case "2": {
                submitForm.params = {
                  nsName: this.form.nsName
                }
                break;
              }
              case "5": {
                submitForm.params = {
                  cnameName: this.form.cnameName
                }
                break;
              }
              case "15": {
                submitForm.params = {
                  priority: this.form.priority,
                  mxName: this.form.mxName
                }
                break;
              }
              case "16": {
                submitForm.params = {
                  txtContent: this.form.txtContent
                }
                break;
              }
              case "28": {
                submitForm.params = {
                  ipv6: this.form.ipv6
                }
                break;
              }
              case "33": {
                submitForm.params = {
                  priority: this.form.priority,
                  weight: this.form.weight,
                  port: this.form.port,
                  srvName: this.form.srvName
                }
                break;
              }
              case "65": {
                submitForm.params = {
                  httpsName: this.form.httpsName,
                  priority: this.form.priority,
                  alpn: this.form.alpn,
                  ipv4hint: this.form.ipv4hint,
                  ipv6hint: this.form.ipv6hint,
                  port: this.form.port
                }
                break;
              }
              case "257": {
                submitForm.params = {
                  flag: this.form.flag,
                  tag: this.form.tag,
                  value: this.form.value
                }
                break;
              }
            }
            addDnsDomainNameRecord(submitForm).then(response => {
              if (response.data.code == 0) {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.$modal.msgError(response.data.message);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      let delIds = [];
      delIds.push(this.$route.query.domainNameId);
      if ((typeof ids) != 'string') {
        ids.forEach(id => {
          delIds.push(id);
        })
      } else {
        delIds.push(ids);
      }
      this.$modal.confirm('是否确认删除选中的域名记录？').then(function() {
        return delDnsDomainNameRecord(delIds);
      }).then((response) => {
        if (response.data.code == 0) {
          this.$modal.msgSuccess("删除成功");
          this.open = false;
          this.getList();
        } else {
          this.$modal.msgError(response.data.message);
        }
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('/platform/dnsDomainName/record/export', {
        ...this.queryParams
      }, `record_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
