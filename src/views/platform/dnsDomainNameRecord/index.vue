<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="域名id" prop="domainNameId">
        <el-input
          v-model="queryParams.domainNameId"
          placeholder="请输入域名id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="记录名" prop="recordName">
        <el-input
          v-model="queryParams.recordName"
          placeholder="请输入记录名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="记录TTL" prop="recordTtl">
        <el-input
          v-model="queryParams.recordTtl"
          placeholder="请输入记录TTL"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['platform:dnsDomainNameRecord:add']"
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
          v-hasPermi="['platform:dnsDomainNameRecord:edit']"
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
          v-hasPermi="['platform:dnsDomainNameRecord:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['platform:dnsDomainNameRecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dnsDomainNameRecordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="域名id" align="center" prop="domainNameId" />
      <el-table-column label="记录名" align="center" prop="recordName" />
      <el-table-column label="记录类型" align="center" prop="recordType" />
      <el-table-column label="记录TTL" align="center" prop="recordTtl" />
      <el-table-column label="记录内容" align="center" prop="recordContent" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['platform:dnsDomainNameRecord:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['platform:dnsDomainNameRecord:remove']"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="域名id" prop="domainNameId">
          <el-input v-model="form.domainNameId" placeholder="请输入域名id" />
        </el-form-item>
        <el-form-item label="记录名" prop="recordName">
          <el-input v-model="form.recordName" placeholder="请输入记录名" />
        </el-form-item>
        <el-form-item label="记录TTL" prop="recordTtl">
          <el-input v-model="form.recordTtl" placeholder="请输入记录TTL" />
        </el-form-item>
        <el-form-item label="记录内容">
          <editor v-model="form.recordContent" :min-height="192"/>
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
import { listDnsDomainNameRecord, getDnsDomainNameRecord, delDnsDomainNameRecord, addDnsDomainNameRecord, updateDnsDomainNameRecord } from "@/api/platform/dnsDomainNameRecord";

export default {
  name: "DnsDomainNameRecord",
  data() {
    return {
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
      dnsDomainNameRecordList: [],
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
        recordTtl: null,
        recordContent: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        domainNameId: [
          { required: true, message: "域名id不能为空", trigger: "blur" }
        ],
        recordName: [
          { required: true, message: "记录名不能为空", trigger: "blur" }
        ],
        recordType: [
          { required: true, message: "记录类型不能为空", trigger: "change" }
        ],
        recordTtl: [
          { required: true, message: "记录TTL不能为空", trigger: "blur" }
        ],
        recordContent: [
          { required: true, message: "记录内容不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询域名记录列表 */
    getList() {
      this.loading = true;
      listDnsDomainNameRecord(this.queryParams).then(response => {
        this.dnsDomainNameRecordList = response.rows;
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
        recordType: null,
        recordTtl: null,
        recordContent: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
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
      getDnsDomainNameRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改域名记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDnsDomainNameRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDnsDomainNameRecord(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除域名记录编号为"' + ids + '"的数据项？').then(function() {
        return delDnsDomainNameRecord(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('platform/dnsDomainNameRecord/export', {
        ...this.queryParams
      }, `dnsDomainNameRecord_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
