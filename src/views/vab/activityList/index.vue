<template>
  <div class="activity-list-container">
    <vab-page-header 
      description="活动管理列表，支持查看、编辑和删除活动" 
      :icon="['fas', 'list']" 
      title="活动列表" 
    />

    <el-card>
      <div slot="header" class="clearfix">
        <span>活动管理</span>
        <el-button 
          style="float: right;" 
          type="primary" 
          icon="el-icon-plus"
          @click="$router.push('/vab/activityForm')"
        >
          创建活动
        </el-button>
      </div>

      <el-table 
        :data="activityList" 
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column 
          prop="id" 
          label="ID" 
          width="80"
        />
        <el-table-column 
          prop="name" 
          label="活动名称" 
          min-width="200"
        />
        <el-table-column 
          prop="region" 
          label="活动区域" 
          width="120"
        >
          <template slot-scope="scope">
            {{ getRegionLabel(scope.row.region) }}
          </template>
        </el-table-column>
        <el-table-column 
          prop="startTime" 
          label="开始时间" 
          width="160"
        >
          <template slot-scope="scope">
            {{ formatDate(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column 
          prop="endTime" 
          label="结束时间" 
          width="160"
        >
          <template slot-scope="scope">
            {{ formatDate(scope.row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column 
          prop="rating" 
          label="评分" 
          width="120"
        >
          <template slot-scope="scope">
            <el-rate
              v-model="scope.row.rating"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            />
          </template>
        </el-table-column>
        <el-table-column 
          prop="delivery" 
          label="即时配送" 
          width="100"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.delivery ? 'success' : 'info'">
              {{ scope.row.delivery ? '开启' : '关闭' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column 
          label="操作" 
          width="200"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button 
              type="text" 
              size="small"
              @click="editActivity(scope.row)"
            >
              编辑
            </el-button>
            <el-button 
              type="text" 
              size="small"
              style="color: #f56c6c;"
              @click="deleteActivity(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import VabPageHeader from '@/components/VabPageHeader'
import { getActivityList, deleteActivity } from '@/api/activityForm'

export default {
  name: 'ActivityList',
  components: {
    VabPageHeader,
  },
  data() {
    return {
      activityList: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      regionMap: {
        'east': '华东地区',
        'south': '华南地区',
        'central': '华中地区',
        'north': '华北地区',
        'southwest': '西南地区',
        'northwest': '西北地区',
        'northeast': '东北地区'
      }
    }
  },
  created() {
    this.loadActivityList()
  },
  methods: {
    async loadActivityList() {
      this.loading = true
      try {
        const res = await getActivityList({
          page: this.currentPage,
          limit: this.pageSize
        })
        
        if (res.code === 200) {
          this.activityList = res.data
          this.total = res.data.length
        } else {
          this.$message.error('加载活动列表失败')
        }
      } catch (error) {
        this.$message.error('加载活动列表失败')
        console.error('加载活动列表失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    editActivity(row) {
      this.$router.push(`/vab/activityForm/${row.id}`)
    },
    
    async deleteActivity(row) {
      try {
        await this.$confirm(`确定要删除活动 "${row.name}" 吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        this.loading = true
        const res = await deleteActivity(row.id)
        
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.loadActivityList()
        } else {
          this.$message.error('删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败')
          console.error('删除活动失败:', error)
        }
      } finally {
        this.loading = false
      }
    },
    
    handleSizeChange(val) {
      this.pageSize = val
      this.loadActivityList()
    },
    
    handleCurrentChange(val) {
      this.currentPage = val
      this.loadActivityList()
    },
    
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    getRegionLabel(value) {
      return this.regionMap[value] || value
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-list-container {
  padding: 20px;
  
  .clearfix {
    &::before,
    &::after {
      content: '';
      display: table;
    }
    &::after {
      clear: both;
    }
  }
  
  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>