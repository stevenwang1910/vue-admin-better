<template>
  <div class="data-table-container">
    <vab-page-header
      description="功能强大的数据表格页面，支持搜索、筛选、排序、分页等完整功能"
      :icon="['fas', 'table']"
      title="数据表格管理"
    />

    <!-- 顶部操作区 -->
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd">添加</el-button>
        <el-button icon="el-icon-delete" type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">删除</el-button>
        <el-button icon="el-icon-view" type="info" :disabled="selectedRows.length !== 1" @click="handleViewDetail">详情</el-button>
        <el-button icon="el-icon-link" type="warning" :disabled="selectedRows.length !== 1" @click="handleOpenDetailInNewTab">
          后台打开详情
        </el-button>
        <el-button icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
      </vab-query-form-left-panel>

      <vab-query-form-right-panel>
        <el-form ref="searchForm" :inline="true" :model="searchForm" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="searchForm.title" placeholder="请输入标题" clearable @clear="handleSearch" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-refresh-left" @click="handleReset">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              :icon="showAdvancedSearch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
              @click="showAdvancedSearch = !showAdvancedSearch"
            >
              展开
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <!-- 高级搜索区域 -->
    <el-collapse-transition>
      <div v-show="showAdvancedSearch" class="advanced-search">
        <el-card class="box-card">
          <el-form ref="advancedSearchForm" :inline="true" :model="searchForm">
            <el-form-item label="作者">
              <el-input v-model="searchForm.author" placeholder="请输入作者" clearable />
            </el-form-item>
            <el-form-item label="评级">
              <el-select v-model="searchForm.rating" placeholder="请选择评级" clearable>
                <el-option label="5星" value="5" />
                <el-option label="4星" value="4" />
                <el-option label="3星" value="3" />
                <el-option label="2星" value="2" />
                <el-option label="1星" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
                <el-option label="已发布" value="published" />
                <el-option label="草稿" value="draft" />
                <el-option label="已删除" value="deleted" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-collapse-transition>

    <!-- 表格设置 -->
    <div class="table-settings">
      <el-checkbox v-model="stripe">斑马纹</el-checkbox>
      <el-checkbox v-model="border">边框</el-checkbox>
      <el-button icon="el-icon-setting" size="mini" @click="showColumnSettings = true">列设置</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table
      ref="dataTable"
      v-loading="loading"
      :data="tableData"
      :stripe="stripe"
      :border="border"
      :element-loading-text="loadingText"
      :height="tableHeight"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" v-if="visibleColumns.includes('selection')" />
      <el-table-column label="序号" width="80" align="center" v-if="visibleColumns.includes('index')">
        <template #default="scope">
          {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="id" prop="id" width="80" sortable="custom" align="center" v-if="visibleColumns.includes('id')" />
      <el-table-column
        label="标题"
        prop="title"
        min-width="200"
        sortable="custom"
        show-overflow-tooltip
        v-if="visibleColumns.includes('title')"
      />
      <el-table-column label="图片" width="120" align="center" v-if="visibleColumns.includes('image')">
        <template #default="scope">
          <el-image
            v-if="scope.row.image"
            :src="scope.row.image"
            :preview-src-list="[scope.row.image]"
            fit="cover"
            style="width: 60px; height: 60px; border-radius: 4px"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div v-else class="no-image">
            <i class="el-icon-picture-outline"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="作者" prop="author" width="120" show-overflow-tooltip v-if="visibleColumns.includes('author')" />
      <el-table-column label="评级" width="120" align="center" v-if="visibleColumns.includes('rating')">
        <template #default="scope">
          <div class="rating-container">
            <el-rate v-model="scope.row.rating" disabled show-score text-color="#ff9900" score-template="{value}" />
            <span class="rating-count">({{ scope.row.ratingCount }})</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center" v-if="visibleColumns.includes('status')">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="180" sortable="custom" v-if="visibleColumns.includes('createTime')" />
      <el-table-column
        label="操作"
        width="200"
        align="center"
        fixed="right"
        class-name="fixed-action-column"
        v-if="visibleColumns.includes('action')"
      >
        <template #default="scope">
          <el-button type="text" size="small" @click="handleView(scope.row)">详情</el-button>
          <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" style="color: #f56c6c" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :background="true"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :layout="paginationLayout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 列设置弹窗 -->
    <el-dialog
      title="列设置"
      :visible.sync="showColumnSettings"
      width="400px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="handleColumnSettingsClosed"
    >
      <div class="column-settings">
        <el-checkbox-group v-model="visibleColumns">
          <el-checkbox v-for="column in allColumns" :key="column.prop" :label="column.prop" :disabled="column.required">
            {{ column.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showColumnSettings = false">取消</el-button>
        <el-button type="primary" @click="saveColumnSettings">确定</el-button>
      </div>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog title="数据详情" :visible.sync="showDetailDialog" width="600px" @close="showDetailDialog = false">
      <div class="detail-content" v-if="detailData">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="ID">{{ detailData.id }}</el-descriptions-item>
          <el-descriptions-item label="标题">{{ detailData.title }}</el-descriptions-item>
          <el-descriptions-item label="作者">{{ detailData.author }}</el-descriptions-item>
          <el-descriptions-item label="评级">
            <el-rate v-model="detailData.rating" disabled show-score text-color="#ff9900" />
            <span style="margin-left: 10px; color: #909399">({{ detailData.ratingCount }} 评价)</span>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(detailData.status)">
              {{ getStatusText(detailData.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
          <el-descriptions-item label="浏览量">{{ detailData.pageViews }}</el-descriptions-item>
          <el-descriptions-item label="图片" :span="2">
            <el-image
              v-if="detailData.image"
              :src="detailData.image"
              :preview-src-list="[detailData.image]"
              fit="cover"
              style="width: 100px; height: 100px; border-radius: 4px"
            />
            <div v-else class="no-image" style="width: 100px; height: 100px">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDetailDialog = false">关闭</el-button>
        <el-button type="primary" @click="handleEdit(detailData)">编辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getList, doDelete, getDetail } from '@/api/dataTable'
  import VabPageHeader from '@/components/VabPageHeader'

  export default {
    name: 'DataTable',
    components: {
      VabPageHeader,
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger',
        }
        return statusMap[status] || 'info'
      },
    },
    data() {
      return {
        loading: false,
        loadingText: '正在加载数据...',
        tableData: [],
        total: 0,
        currentPage: 1,
        pageSize: 20,
        selectedRows: [],
        searchForm: {
          title: '',
          author: '',
          rating: '',
          status: '',
        },
        sortInfo: {
          prop: '',
          order: '',
        },
        showAdvancedSearch: false,
        stripe: true,
        border: true,
        showColumnSettings: false,
        visibleColumns: ['selection', 'index', 'id', 'title', 'image', 'author', 'rating', 'status', 'createTime', 'action'],
        allColumns: [
          { prop: 'selection', label: '选择框', required: false },
          { prop: 'index', label: '序号', required: false },
          { prop: 'id', label: 'id', required: true },
          { prop: 'title', label: '标题', required: true },
          { prop: 'image', label: '图片', required: false },
          { prop: 'author', label: '作者', required: false },
          { prop: 'rating', label: '评级', required: false },
          { prop: 'status', label: '状态', required: false },
          { prop: 'createTime', label: '创建时间', required: false },
          { prop: 'action', label: '操作', required: true },
        ],
        paginationLayout: 'total, sizes, prev, pager, next, jumper',
        detailData: {},
        showDetailDialog: false,
        columnSettingsTimeout: null,
      }
    },
    computed: {
      tableHeight() {
        return this.$baseTableHeight()
      },
    },
    created() {
      this.fetchData()
    },
    methods: {
      async fetchData() {
        this.loading = true
        try {
          const params = {
            pageNo: this.currentPage,
            pageSize: this.pageSize,
            ...this.searchForm,
            sortProp: this.sortInfo.prop,
            sortOrder: this.sortInfo.order,
          }
          const { data, totalCount } = await getList(params)
          this.tableData = data
          this.total = totalCount
        } catch (error) {
          this.$baseMessage('获取数据失败', 'error')
          console.error('获取数据失败:', error)
        } finally {
          this.loading = false
        }
      },
      handleSearch() {
        this.currentPage = 1
        this.fetchData()
      },
      handleReset() {
        this.searchForm = {
          title: '',
          author: '',
          rating: '',
          status: '',
        }
        this.currentPage = 1
        this.fetchData()
      },
      handleSelectionChange(val) {
        this.selectedRows = val
      },
      handleSortChange({ prop, order }) {
        this.sortInfo = { prop, order }
        this.fetchData()
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.fetchData()
      },
      handleAdd() {
        this.$baseMessage('添加功能待实现', 'info')
      },
      async handleView(row) {
        try {
          this.loading = true
          const { data } = await getDetail(row.id)
          this.detailData = data
          this.showDetailDialog = true
        } catch (error) {
          this.$baseMessage('获取详情失败', 'error')
          console.error('获取详情失败:', error)
        } finally {
          this.loading = false
        }
      },
      handleViewDetail() {
        if (this.selectedRows.length === 1) {
          this.handleView(this.selectedRows[0])
        }
      },
      handleOpenDetailInNewTab() {
        if (this.selectedRows.length === 1) {
          const row = this.selectedRows[0]
          const routeData = this.$router.resolve({
            name: 'DataTableDetail',
            params: { id: row.id },
          })
          window.open(routeData.href, '_blank')
        }
      },
      handleEdit(row) {
        this.$baseMessage(`编辑: ${row.title}`, 'info')
      },
      handleDelete(row) {
        this.$baseConfirm(`确定要删除 "${row.title}" 吗？`, '提示', async () => {
          try {
            const { msg } = await doDelete({ ids: row.id })
            this.$baseMessage(msg, 'success')
            this.fetchData()
          } catch (error) {
            this.$baseMessage('删除失败', 'error')
            console.error('删除失败:', error)
          }
        })
      },
      handleBatchDelete() {
        if (this.selectedRows.length === 0) {
          this.$baseMessage('请选择要删除的数据', 'warning')
          return
        }
        const ids = this.selectedRows.map((item) => item.id).join(',')
        this.$baseConfirm(`确定要删除选中的 ${this.selectedRows.length} 条数据吗？`, '提示', async () => {
          try {
            const { msg } = await doDelete({ ids })
            this.$baseMessage(msg, 'success')
            this.fetchData()
          } catch (error) {
            this.$baseMessage('批量删除失败', 'error')
            console.error('批量删除失败:', error)
          }
        })
      },
      handleRefresh() {
        this.fetchData()
        this.$baseMessage('数据已刷新', 'success')
      },
      getStatusType(status) {
        const statusMap = {
          published: 'success',
          draft: 'warning',
          deleted: 'danger',
        }
        return statusMap[status] || 'info'
      },
      getStatusText(status) {
        const statusMap = {
          published: '已发布',
          draft: '草稿',
          deleted: '已删除',
        }
        return statusMap[status] || status
      },
      saveColumnSettings() {
        // 使用防抖处理，避免频繁操作导致的页面抖动
        clearTimeout(this.columnSettingsTimeout)
        this.columnSettingsTimeout = setTimeout(() => {
          this.showColumnSettings = false
          this.$baseMessage('列设置已保存', 'success')

          // 强制重新计算表格布局
          this.$nextTick(() => {
            if (this.$refs.dataTable) {
              this.$refs.dataTable.doLayout()
            }
          })
        }, 100)
      },
      handleColumnSettingsClosed() {
        // 清理定时器
        if (this.columnSettingsTimeout) {
          clearTimeout(this.columnSettingsTimeout)
          this.columnSettingsTimeout = null
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .data-table-container {
    padding: 20px;

    /* 表格列过渡效果 */
    ::v-deep .el-table {
      transition: all 0.3s ease-in-out;
    }

    ::v-deep .el-table-column--selection {
      transition: width 0.3s ease-in-out;
    }

    .advanced-search {
      margin-bottom: 20px;

      .box-card {
        margin-top: 10px;
      }
    }

    .table-settings {
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 15px;

      .el-checkbox {
        margin-right: 10px;
      }
    }

    .rating-container {
      display: flex;
      align-items: center;
      justify-content: center;

      .rating-count {
        margin-left: 8px;
        font-size: 12px;
        color: #909399;
      }
    }

    .no-image {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f7fa;
      border-radius: 4px;
      color: #c0c4cc;
      font-size: 24px;
    }

    .column-settings {
      .el-checkbox-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .el-checkbox {
        margin-right: 0;
      }
    }

    .el-pagination {
      margin-top: 20px;
      text-align: right;
    }
  }

  // 固定操作列样式
  ::v-deep .fixed-action-column {
    background-color: #fff;

    .el-button {
      padding: 0;
      margin-right: 10px;

      &:last-child {
        margin-right: 0;
      }
    }
  }
</style>
