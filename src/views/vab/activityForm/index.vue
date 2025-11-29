<template>
  <div class="activity-form-container">
    <vab-page-header 
      description="活动创建/编辑表单，支持多种布局切换和完整表单验证" 
      :icon="['fas', 'calendar-plus']" 
      title="活动表单" 
    />

    <!-- 布局切换按钮 -->
    <el-card class="layout-switcher">
      <div slot="header">
        <span>表单布局切换</span>
      </div>
      <el-button-group>
        <el-button 
          :type="labelPosition === 'left' ? 'primary' : 'default'"
          @click="labelPosition = 'left'"
        >
          左对齐
        </el-button>
        <el-button 
          :type="labelPosition === 'right' ? 'primary' : 'default'"
          @click="labelPosition = 'right'"
        >
          右对齐
        </el-button>
        <el-button 
          :type="labelPosition === 'top' ? 'primary' : 'default'"
          @click="labelPosition = 'top'"
        >
          顶部对齐
        </el-button>
      </el-button-group>
    </el-card>

    <!-- 活动表单 -->
    <el-card class="activity-form-card">
      <div slot="header">
        <span>{{ isEdit ? '编辑活动' : '创建活动' }}</span>
      </div>
      
      <el-form 
        ref="activityForm" 
        :model="activityForm" 
        :rules="activityRules"
        :label-position="labelPosition"
        label-width="120px"
        class="demo-activityForm"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动名称" prop="name">
              <el-input 
                v-model="activityForm.name" 
                placeholder="请输入活动名称"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="活动区域" prop="region">
              <el-select 
                v-model="activityForm.region" 
                placeholder="请选择活动区域"
                style="width: 100%"
                @change="handleRegionChange"
              >
                <el-option 
                  v-for="item in regionOptions" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="活动城市" prop="city">
              <el-select 
                v-model="activityForm.city" 
                placeholder="请先选择活动区域"
                style="width: 100%"
                :disabled="!activityForm.region"
              >
                <el-option 
                  v-for="item in cityOptions" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="activityForm.startTime"
                type="datetime"
                placeholder="选择开始时间"
                style="width: 100%"
                :picker-options="startTimeOptions"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="activityForm.endTime"
                type="datetime"
                placeholder="选择结束时间"
                style="width: 100%"
                :picker-options="endTimeOptions"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="即时配送" prop="delivery">
              <el-switch 
                v-model="activityForm.delivery" 
                active-text="开启"
                inactive-text="关闭"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="评星" prop="rating">
              <el-rate
                v-model="activityForm.rating"
                show-score
                text-color="#ff9900"
                score-template="{value} 星"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="活动性质" prop="type">
          <el-checkbox-group v-model="activityForm.type">
            <el-checkbox label="美食/餐厅线上活动" />
            <el-checkbox label="地推活动" />
            <el-checkbox label="线下主题活动" />
            <el-checkbox label="单纯品牌曝光" />
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="特殊资源" prop="resource">
          <el-radio-group v-model="activityForm.resource">
            <el-radio label="线上品牌赞助" />
            <el-radio label="线下场地免费" />
          </el-radio-group>
        </el-form-item>

        <el-form-item label="行政区划" prop="adminDivision">
          <el-cascader
            v-model="activityForm.adminDivision"
            :options="adminDivisionOptions"
            placeholder="请选择行政区划"
            style="width: 100%"
            clearable
          />
        </el-form-item>

        <el-form-item label="活动形式" prop="desc">
          <el-input
            v-model="activityForm.desc"
            type="textarea"
            :rows="4"
            placeholder="请详细描述活动的具体形式和内容"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('activityForm')">
            {{ isEdit ? '保存修改' : '立即创建' }}
          </el-button>
          <el-button @click="resetForm('activityForm')">重置</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import VabPageHeader from '@/components/VabPageHeader'
import { 
  getActivityDetail, 
  createActivity, 
  updateActivity, 
  getRegionOptions, 
  getCityOptions,
  getAdminDivisionOptions 
} from '@/api/activityForm'

export default {
  name: 'ActivityForm',
  components: {
    VabPageHeader,
  },
  data() {
    return {
      // 表单布局
      labelPosition: 'right',
      
      // 是否为编辑模式
      isEdit: false,
      
      // 活动表单数据
      activityForm: {
        name: '',
        region: '',
        city: '',
        startTime: '',
        endTime: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        rating: 0,
        adminDivision: []
      },
      
      // 表单验证规则
      activityRules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        city: [
          { required: true, message: '请选择活动城市', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (value && this.activityForm.startTime) {
                if (new Date(value) <= new Date(this.activityForm.startTime)) {
                  callback(new Error('结束时间必须晚于开始时间'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        type: [
          { 
            type: 'array', 
            required: true, 
            message: '请至少选择一个活动性质', 
            trigger: 'change' 
          }
        ],
        resource: [
          { required: true, message: '请选择特殊资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' },
          { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
        ]
      },
      
      // 活动区域选项
      regionOptions: [],
      
      // 活动城市选项
      cityOptions: [],
      
      // 行政区划选项
      adminDivisionOptions: [],
      
      // 日期选择器配置
      startTimeOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      
      endTimeOptions: {
        disabledDate: (time) => {
          if (this.activityForm.startTime) {
            return time.getTime() < new Date(this.activityForm.startTime).getTime()
          }
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  
  async created() {
    // 加载下拉选项数据
    await this.loadOptions()
    
    // 检查是否为编辑模式
    const activityId = this.$route.params.id
    if (activityId) {
      this.isEdit = true
      this.loadActivityData(activityId)
    }
  },
  
  methods: {
    // 加载下拉选项数据
    async loadOptions() {
      try {
        const [regionRes, adminRes] = await Promise.all([
          getRegionOptions(),
          getAdminDivisionOptions()
        ])
        
        this.regionOptions = regionRes
        this.adminDivisionOptions = adminRes
      } catch (error) {
        this.$message.error('加载选项数据失败')
        console.error('加载选项数据失败:', error)
      }
    },
    
    // 提交表单
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            // 构建提交数据
            const submitData = {
              ...this.activityForm,
              startTime: this.activityForm.startTime ? new Date(this.activityForm.startTime).toISOString() : '',
              endTime: this.activityForm.endTime ? new Date(this.activityForm.endTime).toISOString() : ''
            }
            
            // 调用API
            if (this.isEdit) {
              await updateActivity(submitData)
              this.$message.success('活动修改成功！')
              this.$router.push('/vab/activityList')
            } else {
              await createActivity(submitData)
              this.$message.success('活动创建成功！')
              this.$router.push('/vab/activityList')
            }
          } catch (error) {
            this.$message.error(this.isEdit ? '活动修改失败！' : '活动创建失败！')
            console.error('提交表单失败:', error)
          }
        } else {
          this.$message.error('请检查表单填写是否正确！')
          return false
        }
      })
    },
    
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$message.success('表单已重置！')
    },
    
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },
    
    // 处理地区选择变化
    async handleRegionChange(region) {
      // 清空城市选择
      this.activityForm.city = ''
      this.cityOptions = []
      
      if (region) {
        try {
          this.$message.info('正在加载城市数据...')
          const cities = await getCityOptions(region)
          this.cityOptions = cities
          this.$message.success('城市数据加载成功！')
        } catch (error) {
          this.$message.error('加载城市数据失败')
          console.error('加载城市数据失败:', error)
        }
      }
    },
    
    // 加载活动数据（编辑模式）
    async loadActivityData(id) {
      try {
        this.$message.info('正在加载活动数据...')
        
        const res = await getActivityDetail(id)
        if (res.code === 200) {
          this.activityForm = {
            ...res.data,
            startTime: res.data.startTime ? new Date(res.data.startTime) : '',
            endTime: res.data.endTime ? new Date(res.data.endTime) : ''
          }
          
          // 如果已有地区选择，加载对应的城市数据
          if (this.activityForm.region) {
            await this.handleRegionChange(this.activityForm.region)
          }
          
          this.$message.success('活动数据加载成功！')
        } else {
          this.$message.error('加载活动数据失败')
        }
      } catch (error) {
        this.$message.error('加载活动数据失败')
        console.error('加载活动数据失败:', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-form-container {
  padding: 20px;
  min-height: 100vh; // 防止页面高度变化导致的抖动
  box-sizing: border-box;
  
  .layout-switcher {
    margin-bottom: 20px;
    
    .el-button-group {
      display: flex;
      gap: 10px;
      
      // 禁用按钮组的过渡效果
      .el-button {
        transition: none !important;
      }
    }
  }
  
  .activity-form-card {
    min-height: auto; // 确保卡片高度自适应
    
    // 覆盖全局样式中可能导致抖动的效果
    ::v-deep .page-header {
      transform: none !important;
      
      &::before {
        transform: none !important;
        animation: none !important;
      }
    }
    
    // 禁用卡片过渡效果
    ::v-deep .el-card__header {
      transition: none !important;
    }
    
    .el-form{
      .el-row {
        margin-bottom: 10px;
      }
      
      .el-form-item {
        margin-bottom: 20px;
        transition: none !important; // 禁用过渡效果防止抖动
        
        .el-form-item__label {
          transition: none !important; // 禁用标签过渡效果
        }
        
        .el-form-item__content {
          transition: none !important; // 禁用内容区域过渡效果
        }
      }
      
      .el-rate {
        line-height: 40px;
      }
      
      // 禁用所有输入元素的过渡效果
      .el-input, .el-select, .el-date-picker, .el-cascader, .el-textarea {
        transition: none !important;
      }
    }
  }
}

// 响应式布局调整
@media screen and (max-width: 768px) {
  .activity-form-container {
    .activity-form-card {
      .el-form {
        .el-col {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>