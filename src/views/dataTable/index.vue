<template>
  <div class="table-container">
    <vab-page-header description="功能强大的数据表格页面，支持排序、分页、搜索等功能" :icon="['fas', 'table']" title="数据表格管理" />

    <!-- Top Action Bar -->
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd">添加</el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete" :disabled="selectRows.length === 0">删除</el-button>
        <el-button type="primary" @click="handleDetail" :disabled="selectRows.length !== 1">详情</el-button>
        <el-button type="primary" @click="handleDetailInNewTab" :disabled="selectRows.length !== 1">后台打开详情</el-button>
      </vab-query-form-left-panel>

      <vab-query-form-right-panel>
        <el-form ref="queryForm" :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="queryForm.title" placeholder="请输入内容标题" clearable />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" native-type="submit" type="primary" @click="handleQuery">查询</el-button>
            <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <!-- Table Settings -->
    <div class="table-settings" style="margin-bottom: 16px; display: flex; justify-content: flex-end; gap: 12px">
      <el-checkbox v-model="tableSettings.stripe" @change="handleTableSettingChange">斑马纹</el-checkbox>
      <el-checkbox v-model="tableSettings.border" @change="handleTableSettingChange">边框</el-checkbox>
      <el-button icon="el-icon-refresh" @click="fetchData">刷新</el-button>
      <el-button icon="el-icon-setting" @click="showColumnSetting">列设置</el-button>
    </div>

    <!-- Data Table -->
    <el-table
      ref="dataTable"
      v-loading="listLoading"
      :data="list"
      :element-loading-text="'正在加载...'"
      :height="tableHeight"
      :stripe="tableSettings.stripe"
      :border="tableSettings.border"
      @selection-change="setSelectRows"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" width="95">
        <template #default="scope">
          {{ (queryForm.pageNo - 1) * queryForm.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="id" prop="id" show-overflow-tooltip sortable :width="tableColumns.id.width" v-if="tableColumns.id.visible" />
      <el-table-column
        label="标题"
        prop="title"
        show-overflow-tooltip
        sortable
        :width="tableColumns.title.width"
        v-if="tableColumns.title.visible"
      />
      <el-table-column label="图片" show-overflow-tooltip :width="tableColumns.image.width" v-if="tableColumns.image.visible">
        <template #default="{ row }">
          <el-image :preview-src-list="[row.img]" :src="row.img" style="width: 40px; height: 40px; border-radius: 4px" />
        </template>
      </el-table-column>
      <el-table-column
        label="作者"
        prop="author"
        show-overflow-tooltip
        :width="tableColumns.author.width"
        v-if="tableColumns.author.visible"
      />
      <el-table-column label="评级" show-overflow-tooltip :width="tableColumns.rating.width" v-if="tableColumns.rating.visible">
        <template #default="{ row }">
          <div style="display: flex; align-items: center">
            <el-rate :value="row.rating.value" disabled />
            <span style="margin-left: 8px; font-size: 12px">{{ row.rating.count }}人评分</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="180" v-if="tableColumns.operation.visible">
        <template #default="{ row }">
          <el-button type="text" @click="handleDetail(row)">详情</el-button>
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :layout="'total, sizes, prev, pager, next, jumper'"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      style="margin-top: 16px; text-align: right"
    />

    <!-- Column Setting Dialog -->
    <el-dialog title="列设置" :visible.sync="columnSettingVisible" width="400px">
      <el-checkbox-group v-model="visibleColumns">
        <el-form label-width="80px" style="max-height: 300px; overflow-y: auto">
          <el-form-item label="id">
            <el-checkbox value="id" v-model="visibleColumns" />
          </el-form-item>
          <el-form-item label="标题">
            <el-checkbox value="title" v-model="visibleColumns" />
          </el-form-item>
          <el-form-item label="图片">
            <el-checkbox value="image" v-model="visibleColumns" />
          </el-form-item>
          <el-form-item label="作者">
            <el-checkbox value="author" v-model="visibleColumns" />
          </el-form-item>
          <el-form-item label="评级">
            <el-checkbox value="rating" v-model="visibleColumns" />
          </el-form-item>
          <el-form-item label="操作">
            <el-checkbox value="operation" v-model="visibleColumns" />
          </el-form-item>
        </el-form>
      </el-checkbox-group>
      <template #footer>
        <el-button @click="cancelColumnSetting">取消</el-button>
        <el-button type="primary" @click="saveColumnSettings">保存</el-button>
      </template>
    </el-dialog>
    <!-- Detail Dialog -->
    <el-dialog title="详情" :visible.sync="detailVisible" width="600px">
      <el-form label-width="80px" v-if="selectedRow">
        <el-form-item label="ID">
          {{ selectedRow.id }}
        </el-form-item>
        <el-form-item label="标题">
          {{ selectedRow.title }}
        </el-form-item>
        <el-form-item label="作者">
          {{ selectedRow.author }}
        </el-form-item>
        <el-form-item label="评级">
          <div style="display: flex; align-items: center">
            <el-rate :value="selectedRow.rating.value" disabled />
            <span style="margin-left: 8px; font-size: 12px">{{ selectedRow.rating.count }}人评分</span>
          </div>
        </el-form-item>
        <el-form-item label="图片">
          <el-image :preview-src-list="[selectedRow.img]" :src="selectedRow.img" style="width: 100px; height: 100px; border-radius: 4px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-tag :type="selectedRow.status | statusFilter">
            {{ selectedRow.status }}
          </el-tag>
        </el-form-item>
        <el-form-item label="点击量">
          {{ selectedRow.pageViews }}
        </el-form-item>
        <el-form-item label="创建时间">
          {{ selectedRow.datetime }}
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import { getList, doDelete } from '@/api/table'
  import VabPageHeader from '@/components/VabPageHeader'

  export default {
    name: 'DataTable',
    components: {
      VabPageHeader,
    },
    data() {
      return {
        list: [],
        listLoading: true,
        total: 0,
        selectRows: [],
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          title: '',
        },
        tableSettings: {
          stripe: true,
          border: false,
        },
        tableColumns: {
          id: { width: '120px', visible: true },
          title: { width: '200px', visible: true },
          image: { width: '100px', visible: true },
          author: { width: '120px', visible: true },
          rating: { width: '150px', visible: true },
          operation: { width: '180px', visible: true },
        },
        visibleColumns: ['id', 'title', 'image', 'author', 'rating', 'operation'],
        originalVisibleColumns: [],
        columnSettingVisible: false,
        detailVisible: false,
        selectedRow: null,
      }
    },
    computed: {
      tableHeight() {
        // Calculate table height based on window height
        return window.innerHeight - 350
      },
    },
    created() {
      this.fetchData()
    },
    methods: {
      // Fetch data from API
      async fetchData() {
        this.listLoading = true
        try {
          const { data, totalCount } = await getList(this.queryForm)
          // Add rating field to each item for demonstration
          const processedData = data.map((item) => ({
            ...item,
            rating: {
              value: Math.floor(Math.random() * 5) + 1, // Random rating 1-5
              count: Math.floor(Math.random() * 1000) + 100, // Random rating count 100-1099
            },
          }))
          this.list = processedData
          this.total = totalCount
        } catch (error) {
          this.$baseMessage('数据加载失败', 'error')
        } finally {
          this.listLoading = false
        }
      },

      // Handle selection change
      setSelectRows(val) {
        this.selectRows = val
      },

      // Handle add button click
      handleAdd() {
        this.$baseMessage('添加功能待实现', 'info')
      },

      // Handle edit button click
      handleEdit(row) {
        this.$baseMessage(`编辑ID: ${row.id}`, 'info')
      },

      // Handle detail button click
      handleDetail(row = null) {
        const targetRow = row || this.selectRows[0]
        if (targetRow) {
          this.selectedRow = targetRow
          this.detailVisible = true
        }
      },

      // Handle detail in new tab button click
      handleDetailInNewTab() {
        const targetRow = this.selectRows[0]
        if (targetRow) {
          // In a real application, this would open a new tab with the detail page
          window.open(`/detail/${targetRow.id}`, '_blank')
        }
      },

      // Handle delete button click
      handleDelete(row = null) {
        const targetIds = row ? [row.id] : this.selectRows.map((item) => item.id)
        if (targetIds.length === 0) {
          this.$baseMessage('请至少选择一项', 'error')
          return
        }

        this.$baseConfirm('你确定要删除选中项吗？', '提示', async () => {
          try {
            await doDelete({ ids: targetIds.join(',') })
            this.$baseMessage('删除成功', 'success')
            this.fetchData()
          } catch (error) {
            this.$baseMessage('删除失败', 'error')
          }
        })
      },

      // Handle query button click
      handleQuery() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },

      // Handle reset button click
      handleReset() {
        this.queryForm = {
          pageNo: 1,
          pageSize: 20,
          title: '',
        }
        this.fetchData()
      },

      // Handle page size change
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.queryForm.pageNo = 1
        this.fetchData()
      },

      // Handle current page change
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },

      // Handle table setting change
      handleTableSettingChange() {
        // In a real application, you might want to save these settings to localStorage
      },

      // Show column setting dialog
      showColumnSetting() {
        // Save original visible columns before opening dialog
        this.originalVisibleColumns = [...this.visibleColumns]
        // Initialize visibleColumns based on current tableColumns visibility
        this.visibleColumns = Object.keys(this.tableColumns).filter((key) => this.tableColumns[key].visible)
        this.columnSettingVisible = true
      },

      // Save column settings
      saveColumnSettings() {
        // Update table column visibility
        Object.keys(this.tableColumns).forEach((key) => {
          this.tableColumns[key].visible = this.visibleColumns.includes(key)
        })
        this.columnSettingVisible = false
        this.$baseMessage('列设置已保存', 'success')
      },

      // Cancel column setting
      cancelColumnSetting() {
        // Restore original visible columns
        this.visibleColumns = [...this.originalVisibleColumns]
        this.columnSettingVisible = false
      },
    },
  }
</script>

<style lang="scss" scoped>
  .table-container {
    padding: 24px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
</style>
