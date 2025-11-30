<template>
  <div class="activityManagement-container">
    <vab-page-header description="活动管理，支持创建和编辑活动信息" :icon="['fas', 'calendar-alt']" title="活动管理" />

    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button icon="el-icon-plus" type="primary" @click="handleEdit">创建活动</el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete">批量删除</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.activityName" clearable placeholder="请输入活动名称" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" @selection-change="setSelectRows">
      <el-table-column show-overflow-tooltip type="selection" />
      <el-table-column label="活动名称" prop="activityName" show-overflow-tooltip />
      <el-table-column label="活动区域" prop="activityRegion" show-overflow-tooltip />
      <el-table-column label="开始时间" prop="startTime" show-overflow-tooltip />
      <el-table-column label="结束时间" prop="endTime" show-overflow-tooltip />
      <el-table-column label="活动性质" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag v-for="(item, index) in row.activityNature" :key="index">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="特殊资源" prop="specialResource" show-overflow-tooltip />
      <el-table-column label="修改时间" prop="updateTime" show-overflow-tooltip />
      <el-table-column label="操作" show-overflow-tooltip width="200">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { doDelete, getList } from '@/api/activityManagement'
  import Edit from './components/ActivityManagementEdit'
  import VabPageHeader from '@/components/VabPageHeader'

  export default {
    name: 'ActivityManagement',
    components: {
      Edit,
      VabPageHeader,
    },
    data() {
      return {
        list: null,
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          activityName: '',
        },
        timeOutID: null,
      }
    },
    created() {
      this.fetchData()
    },

    beforeDestroy() {
      clearTimeout(this.timeOutID)
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val
      },
      handleEdit(row) {
        if (row.id) {
          this.$refs['edit'].showEdit(row)
        } else {
          this.$refs['edit'].showEdit()
        }
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.id })
            this.$baseMessage(msg, 'success')
            this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids })
              this.$baseMessage(msg, 'success')
              this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
        }
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const { data, totalCount } = await getList(this.queryForm)
        this.list = data
        this.total = totalCount
        this.timeOutID = setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
    },
  }
</script>
