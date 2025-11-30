<template>
  <div class="new-table-container">
    <vab-page-header description="新的数据表格页面，支持排序、分页、搜索等功能" :icon="['fas', 'table']" title="新表格管理" />

    <!-- 顶部操作区 -->
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd">添加</el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete" :disabled="selectedRows.length === 0">删除</el-button>
        <el-button icon="el-icon-view" type="primary" @click="handleDetail" :disabled="selectedRows.length !== 1">详情</el-button>
        <el-button icon="el-icon-share" type="primary" @click="handleOpenDetail" :disabled="selectedRows.length !== 1">
          后台打开详情
        </el-button>
        <el-button icon="el-icon-s-tools" type="primary" @click="toggleAdvancedSearch">
          {{ advancedSearchVisible ? '收起' : '展开' }}
        </el-button>
      </vab-query-form-left-panel>

      <vab-query-form-right-panel>
        <el-form ref="searchForm" :inline="true" :model="searchForm" @submit.native.prevent>
          <el-form-item label="标题">
            <el-input v-model="searchForm.title" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" native-type="submit" type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-refresh-left" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <!-- 高级搜索区域 -->
    <div v-if="advancedSearchVisible" class="advanced-search">
      <el-form :inline="true" :model="advancedSearchForm">
        <el-form-item label="作者">
          <el-input v-model="advancedSearchForm.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="advancedSearchForm.status" placeholder="请选择状态">
            <el-option label="已发布" value="published" />
            <el-option label="草稿" value="draft" />
            <el-option label="已删除" value="deleted" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleAdvancedSearch">高级查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格设置 -->
    <div class="table-settings">
      <el-checkbox v-model="tableOptions.striped">斑马纹</el-checkbox>
      <el-checkbox v-model="tableOptions.border">边框</el-checkbox>
      <el-button icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
      <el-button icon="el-icon-setting" @click="handleColumnSettings">列设置</el-button>
    </div>

    <!-- 数据展示区 -->
    <el-table
      ref="dataTable"
      v-loading="loading"
      :data="tableData"
      :element-loading-text="'正在加载...'"
      :height="tableHeight"
      :striped="tableOptions.striped"
      :border="tableOptions.border"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" width="80" v-if="visibleColumns.includes('index')">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="120" sortable v-if="visibleColumns.includes('id')" />
      <el-table-column prop="title" label="标题" show-overflow-tooltip sortable v-if="visibleColumns.includes('title')" />
      <el-table-column prop="img" label="图片" width="120" v-if="visibleColumns.includes('img')">
        <template #default="{ row }">
          <el-image :src="row.img" :preview-src-list="[row.img]" fit="cover" style="width: 80px; height: 80px; border-radius: 4px" />
        </template>
      </el-table-column>
      <el-table-column prop="author" label="作者" show-overflow-tooltip v-if="visibleColumns.includes('author')" />
      <el-table-column prop="rating" label="评级" width="120" v-if="visibleColumns.includes('rating')">
        <template #default="{ row }">
          <el-rate v-model="row.rating" disabled />
          <span style="margin-left: 8px">({{ row.ratingCount }}人评分)</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100" v-if="visibleColumns.includes('status')">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" v-if="visibleColumns.includes('createTime')" />
      <el-table-column label="操作" width="200" fixed="right" v-if="visibleColumns.includes('action')">
        <template #default="{ row }">
          <el-button type="text" @click="handleDetail(row)">详情</el-button>
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页与统计区 -->
    <div class="pagination-container">
      <span class="total-count">共 {{ total }} 条</span>
      <el-pagination
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 编辑/添加对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="dialogForm.title" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="dialogForm.author" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="dialogForm.status">
            <el-option label="已发布" value="published" />
            <el-option label="草稿" value="draft" />
            <el-option label="已删除" value="deleted" />
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="img">
          <el-input v-model="dialogForm.img" placeholder="请输入图片URL" />
        </el-form-item>
        <el-form-item label="评级" prop="rating">
          <el-rate v-model="dialogForm.rating" max="5" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>

    <!-- 列设置对话框 -->
    <el-dialog title="列设置" :visible.sync="columnSettingsVisible" width="400px">
      <el-checkbox-group v-model="visibleColumns">
        <el-checkbox label="序号" value="index" />
        <el-checkbox label="ID" value="id" />
        <el-checkbox label="标题" value="title" />
        <el-checkbox label="图片" value="img" />
        <el-checkbox label="作者" value="author" />
        <el-checkbox label="评级" value="rating" />
        <el-checkbox label="状态" value="status" />
        <el-checkbox label="创建时间" value="createTime" />
        <el-checkbox label="操作" value="action" />
      </el-checkbox-group>
      <template #footer>
        <el-button @click="columnSettingsVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveColumnSettings">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import { getList, doAdd, doEdit, doDelete } from '@/api/newTable'
  import VabPageHeader from '@/components/VabPageHeader'

  export default {
    name: 'NewTable',
    components: {
      VabPageHeader,
    },
    data() {
      return {
        // 搜索表单
        searchForm: {
          title: '',
        },
        // 高级搜索表单
        advancedSearchForm: {
          author: '',
          status: '',
        },
        // 高级搜索可见性
        advancedSearchVisible: false,
        // 表格选项
        tableOptions: {
          striped: true,
          border: false,
        },
        // 表格数据
        tableData: [],
        // 选中的行
        selectedRows: [],
        // 加载状态
        loading: false,
        // 表格高度
        tableHeight: 'auto',
        // 分页信息
        pagination: {
          page: 1,
          pageSize: 20,
        },
        // 总记录数
        total: 0,
        // 排序信息
        sortInfo: {
          prop: '',
          order: '',
        },
        // 对话框可见性
        dialogVisible: false,
        // 对话框标题
        dialogTitle: '',
        // 对话框表单
        dialogForm: {
          id: null,
          title: '',
          author: '',
          status: 'published',
          img: '',
          rating: 3,
        },
        // 对话框表单验证规则
        dialogRules: {
          title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
          author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
          status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        },
        // 列设置可见性
        columnSettingsVisible: false,
        // 可见列
        visibleColumns: ['index', 'id', 'title', 'img', 'author', 'rating', 'status', 'createTime', 'action'],
      }
    },
    created() {
      this.fetchData()
    },
    mounted() {
      // 计算表格高度
      this.calculateTableHeight()
      window.addEventListener('resize', this.calculateTableHeight)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.calculateTableHeight)
    },
    methods: {
      // 计算表格高度
      calculateTableHeight() {
        const containerHeight = document.documentElement.clientHeight || window.innerHeight
        const headerHeight = 150 // 顶部操作区高度
        const paginationHeight = 60 // 分页区高度
        this.tableHeight = containerHeight - headerHeight - paginationHeight - 40 // 40为边距
      },
      // 获取状态类型
      getStatusType(status) {
        const statusMap = {
          published: 'success',
          draft: 'warning',
          deleted: 'danger',
        }
        return statusMap[status] || 'info'
      },
      // 切换高级搜索
      toggleAdvancedSearch() {
        this.advancedSearchVisible = !this.advancedSearchVisible
      },
      // 搜索
      handleSearch() {
        this.pagination.page = 1
        this.fetchData()
      },
      // 重置搜索
      handleReset() {
        this.searchForm = { title: '' }
        this.advancedSearchForm = { author: '', status: '' }
        this.pagination.page = 1
        this.fetchData()
      },
      // 高级搜索
      handleAdvancedSearch() {
        this.pagination.page = 1
        this.fetchData()
      },
      // 刷新数据
      handleRefresh() {
        this.fetchData()
      },
      // 列设置
      handleColumnSettings() {
        this.columnSettingsVisible = true
      },
      // 保存列设置
      handleSaveColumnSettings() {
        this.columnSettingsVisible = false
      },
      // 选择行变化
      handleSelectionChange(val) {
        this.selectedRows = val
      },
      // 排序变化
      handleSortChange(val) {
        this.sortInfo = val
        this.fetchData()
      },
      // 每页条数变化
      handleSizeChange(val) {
        this.pagination.pageSize = val
        this.fetchData()
      },
      // 当前页变化
      handleCurrentChange(val) {
        this.pagination.page = val
        this.fetchData()
      },
      // 添加
      handleAdd() {
        this.dialogTitle = '添加'
        this.dialogForm = {
          id: null,
          title: '',
          author: '',
          status: 'published',
          img: '',
          rating: 3,
        }
        this.dialogVisible = true
      },
      // 编辑
      handleEdit(row) {
        this.dialogTitle = '编辑'
        this.dialogForm = { ...row }
        this.dialogVisible = true
      },
      // 详情
      handleDetail(row) {
        const data = row || this.selectedRows[0]
        if (data) {
          this.$message.info(`查看ID为${data.id}的详情`)
        }
      },
      // 后台打开详情
      handleOpenDetail(row) {
        const data = row || this.selectedRows[0]
        if (data) {
          window.open(`/detail/${data.id}`, '_blank')
        }
      },
      // 删除
      handleDelete(row) {
        const data = row || this.selectedRows
        if (!data || data.length === 0) {
          this.$message.warning('请选择要删除的记录')
          return
        }
        const ids = Array.isArray(data) ? data.map((item) => item.id).join(',') : data.id
        this.$confirm('确定要删除选中的记录吗？', '提示', {
          type: 'warning',
        })
          .then(async () => {
            const res = await doDelete({ ids })
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.fetchData()
            } else {
              this.$message.error('删除失败')
            }
          })
          .catch(() => {
            this.$message.info('已取消删除')
          })
      },
      // 保存
      handleSave() {
        this.$refs.dialogForm.validate(async (valid) => {
          if (valid) {
            const res = this.dialogForm.id ? await doEdit(this.dialogForm) : await doAdd(this.dialogForm)
            if (res.code === 200) {
              this.$message.success('保存成功')
              this.dialogVisible = false
              this.fetchData()
            } else {
              this.$message.error('保存失败')
            }
          }
        })
      },
      // 获取数据
      async fetchData() {
        this.loading = true
        try {
          const params = {
            ...this.searchForm,
            ...this.advancedSearchForm,
            page: this.pagination.page,
            pageSize: this.pagination.pageSize,
            sort: this.sortInfo.prop,
            order: this.sortInfo.order,
          }
          const res = await getList(params)
          this.tableData = res.data
          this.total = res.total
        } catch (error) {
          this.$message.error('获取数据失败')
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .new-table-container {
    padding: 20px;
    background: #f5f7fa;
    min-height: 100vh;
  }

  .advanced-search {
    background: #fff;
    padding: 15px;
    border-radius: 4px;
    margin-bottom: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .table-settings {
    background: #fff;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .pagination-container {
    background: #fff;
    padding: 15px;
    border-radius: 4px;
    margin-top: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .total-count {
    font-size: 14px;
    color: #606266;
  }
</style>
