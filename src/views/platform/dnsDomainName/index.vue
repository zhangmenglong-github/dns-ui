<template>
  <div class="app-container">
    <el-form @submit.native.prevent :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="域名" prop="domainName">
        <el-input
          v-model="queryParams.domainName"
          placeholder="请输入域名"
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
          v-hasPermi="['platform:dnsDomainName:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['platform:dnsDomainName:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['platform:dnsDomainName:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dnsDomainNameList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="域名" align="center" prop="domainName">
        <template slot-scope="scope">
          <span>{{punycodeToUnicode(scope.row.domainName)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="DNSSEC" align="center" prop="domainNameDnssec">

        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.domainNameDnssec"
            ref="dnssecInfo"
            placement="top-start"
            title="DS记录信息"
            trigger="hover">
            <el-form>
              <el-form-item label="关键标签:">
                <span style="word-break: break-all; white-space: normal">{{scope.row.domainNameDnssecDsKeyTag}}</span>
              </el-form-item>
              <el-form-item label="加密算法:">
                <span style="word-break: break-all; white-space: normal">ECDSA Curve P-256 with SHA-256(13)</span>
              </el-form-item>
              <el-form-item label="摘要类型:">
                <span style="word-break: break-all; white-space: normal">SHA256(2)</span>
              </el-form-item>
              <el-form-item label="摘要:">
                <span style="word-break: break-all; white-space: normal">{{scope.row.domainNameDnssecDsDigestValue}}</span>
              </el-form-item>
            </el-form>
            <el-switch
              slot="reference"
              @change="handleUpdateDnsDomainNameDnssec($event, scope.row)"
              v-model="scope.row.domainNameDnssec"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-popover>
          <el-switch
            v-if="!scope.row.domainNameDnssec"
            @change="handleUpdateDnsDomainNameDnssec($event, scope.row)"
            v-model="scope.row.domainNameDnssec"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>

        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="domainNameStatus">
        <template slot-scope="scope">
          <div @click="repeatValidateDomainName(scope.row)">
            <dict-tag style="cursor: pointer;" :options="dict.type.domain_status" :value="scope.row.domainNameStatus"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="更新时间" align="center" prop="updateTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-upload"
            @click="handleResolution(scope.row)"
            v-hasPermi="['platform:dnsDomainName:edit']"
          >解析</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['platform:dnsDomainName:remove']"
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

    <!-- 添加或修改域名对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body @open="openAddDomainNameDialog" @close="closeAddDomainNameDialog">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="域名" prop="domainName" v-show="!isValidate">
          <el-input v-model="form.domainName" placeholder="请输入域名" />
        </el-form-item>
        <el-alert v-show="isValidate"
                  title="请到域名当前DNS服务商处给该域名添加TXT记录"
                  type="warning"
                  show-icon
                  :closable="false">
        </el-alert>
        <el-form-item label="验证域名:" v-show="isValidate">
          <span>{{punycodeToUnicode('auth.' + form.domainName)}}</span>
        </el-form-item>
        <el-form-item label="记录值:" v-show="isValidate">
          <span>{{validateContent}}</span>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-show="!isValidate">确 定</el-button>
        <el-button type="primary" @click="submitFormValidateDomainName" v-show="isValidate">验 证</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listDnsDomainName, delDnsDomainName, addDnsDomainName, validateDnsDomainName, validateRefreshDnsDomainName, updateDnsDomainNameDnssec } from "@/api/platform/dnsDomainName";
import punycode from 'punycode'

export default {
  name: "DnsDomainName",
  dicts: ['domain_status'],
  data() {
    return {
      validateContent: "",
      isValidate: false,
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
      // 域名表格数据
      dnsDomainNameList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        domainName: null,
        domainNameDnssec: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        domainName: [
          { required: true, message: "域名不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    repeatValidateDomainName(dnsDomainName) {
      if (dnsDomainName.domainNameStatus == "-1") {
        this.loading = true;
        validateRefreshDnsDomainName(dnsDomainName).then(response => {
          if (response.data.code == 0) {
            this.open = true;
            this.$nextTick(() => {
              this.title = "验证域名所有权";
              this.form = JSON.parse(JSON.stringify(dnsDomainName));
              this.isValidate = true;
              this.validateContent = response.data.content;
            })
          } else {
            this.$message.error(response.data.message);
          }
          this.loading = false;
        });
      }
    },
    submitFormValidateDomainName() {
      validateDnsDomainName(this.form).then(response => {
        if (response.data.code == 0) {
          this.$modal.msgSuccess("验证成功");
          this.open = false;
          this.getList();
        } else {
          this.$modal.msgError(response.data.message);
        }
        if (response.data.code == -2) {
          this.validateContent = response.data.content;
        }
      });
    },
    closeAddDomainNameDialog() {
      this.isValidate = false;
    },
    openAddDomainNameDialog() {
      this.isValidate = false;
    },
    punycodeToUnicode(domainName) {
      return punycode.toUnicode(domainName);
    },
    /** 查询域名列表 */
    getList() {
      this.loading = true;
      listDnsDomainName(this.queryParams).then(response => {
        this.dnsDomainNameList = response.rows;
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
        domainName: null,
        domainNameDnssec: null,
        createTime: null,
        updateTime: null
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
      this.title = "添加域名";
    },
    /** 修改按钮操作 */
    handleUpdateDnsDomainNameDnssec(dnssec, row) {
      if (dnssec) {
        this.$confirm('是否开启DNSSEC?', 'DNSSEC', {
          confirmButtonText: '开启',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          updateDnsDomainNameDnssec(row).then(response => {
            if (response.data.code == 0) {
              this.getList();
              this.$message.success("开启成功!");
            } else {
              this.$message.success(response.data.message);
            }

          })
        }).catch(() => {
          row.domainNameDnssec = !dnssec;
          this.$message.info("已取消")
        });
      } else {
        this.$confirm('是否关闭DNSSEC?', 'DNSSEC', {
          confirmButtonText: '关闭',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          updateDnsDomainNameDnssec(row).then(response => {
            if (response.data.code == 0) {
              this.getList();
              this.$message.success("关闭成功!");
            } else {
              this.$message.success(response.data.message);
            }

          })
        }).catch(() => {
          row.domainNameDnssec = !dnssec;
          this.$message.info("已取消")
        });
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          addDnsDomainName(this.form).then(response => {
            if (response.data.code == 0) {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            } else {
              this.$modal.msgError(response.data.message);
            }
            if ((response.data.code == -5) || (response.data.code == -6)) {
              this.title = "验证域名所有权";
              this.validateContent = response.data.content;
              this.isValidate = true;
            }
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      let deleteDomainNameList;
      if (!ids.length) {
        this.dnsDomainNameList.forEach(dnsDomainName => {
          if (ids == dnsDomainName.id) {
            deleteDomainNameList = dnsDomainName.domainName
          }
        })
      } else {
        deleteDomainNameList = [];
        this.dnsDomainNameList.forEach(dnsDomainName => {
          this.ids.forEach(id => {
            if (id == dnsDomainName.id) {
              deleteDomainNameList.push(dnsDomainName.domainName);
            }
          })
        })
      }
      this.$modal.confirm('是否确认删除域名"' + deleteDomainNameList + '"？').then(function() {
        delDnsDomainName(ids).then(response => {
          if (response.data.code == 0) {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          } else {
            this.$modal.msgError(response.data.message);
          }
        });
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('platform/dnsDomainName/export', {
        ...this.queryParams
      }, `dnsDomainName_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
