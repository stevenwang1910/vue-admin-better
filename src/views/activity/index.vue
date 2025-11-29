<template>
  <div class="activity-form-container">
    <vab-page-header description="活动创建/编辑表单，包含活动信息的录入和提交功能" :icon="['fas', 'calendar-alt']" title="活动表单" />

    <!-- 布局切换按钮 -->
    <div class="layout-switch-buttons">
      <el-button :type="layout === 'left' ? 'primary' : ''" @click="layout = 'left'">左对齐</el-button>
      <el-button :type="layout === 'right' ? 'primary' : ''" @click="layout = 'right'">右对齐</el-button>
      <el-button :type="layout === 'top' ? 'primary' : ''" @click="layout = 'top'">顶部对齐</el-button>
    </div>

    <!-- 活动表单 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :lg="12" :md="16" :sm="24" :xs="24">
        <el-form 
          ref="activityForm" 
          class="activity-form" 
          :label-position="layout" 
          :label-width="layout === 'top' ? 'auto' : '120px'"
          :model="form" 
          :rules="rules"
        >
          <!-- 活动名称 -->
          <el-form-item label="活动名称*" prop="name">
            <el-input v-model="form.name" placeholder="请输入活动名称" />
          </el-form-item>

          <!-- 活动区域 -->
          <el-form-item label="活动区域*" prop="region">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option v-for="item in regionOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <!-- 活动时间 -->
          <el-form-item label="活动时间*" prop="time">
            <el-date-picker
              v-model="form.time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>

          <!-- 即时配送 -->
          <el-form-item label="即时配送">
            <el-switch v-model="form.delivery" />
          </el-form-item>

          <!-- 活动性质 -->
          <el-form-item label="活动性质*" prop="type">
            <el-checkbox-group v-model="form.type">
              <el-checkbox label="美食/餐厅线上活动" name="type" value="food_online" />
              <el-checkbox label="地推活动" name="type" value="ground_promotion" />
              <el-checkbox label="线下主题活动" name="type" value="offline_theme" />
              <el-checkbox label="单纯品牌曝光" name="type" value="brand_exposure" />
            </el-checkbox-group>
          </el-form-item>

          <!-- 特殊资源 -->
          <el-form-item label="特殊资源*" prop="resource">
            <el-radio-group v-model="form.resource">
              <el-radio label="线上品牌赞助" value="online_sponsorship" />
              <el-radio label="线下场地免费" value="offline_venue" />
            </el-radio-group>
          </el-form-item>

          <!-- 活动形式 -->
          <el-form-item label="活动形式*" prop="form">
            <el-input v-model="form.form" type="textarea" placeholder="请详细描述活动形式" />
          </el-form-item>

          <!-- 评星 -->
          <el-form-item label="评星">
            <el-rate v-model="form.rating" show-text />
          </el-form-item>

          <!-- 行政区划 -->
          <el-form-item label="行政区划" prop="district">
            <el-select v-model="form.district" placeholder="请选择行政区划">
              <el-option v-for="item in districtOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <!-- 表单操作 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm('activityForm')">立即创建</el-button>
            <el-button type="warning" @click="resetForm('activityForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VabPageHeader from '@/components/VabPageHeader'

// 模拟从API获取的区域数据
const regionOptions = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'guangzhou', label: '广州' },
  { value: 'shenzhen', label: '深圳' },
  { value: 'hangzhou', label: '杭州' },
]

// 模拟从API获取的区域与行政区划对应数据
const districtData = {
  beijing: [
    { value: 'dongcheng', label: '东城区' },
    { value: 'xicheng', label: '西城区' },
    { value: 'chaoyang', label: '朝阳区' },
    { value: 'haidian', label: '海淀区' },
    { value: 'fengtai', label: '丰台区' },
  ],
  shanghai: [
    { value: 'huangpu', label: '黄浦区' },
    { value: 'xuhui', label: '徐汇区' },
    { value: 'changning', label: '长宁区' },
    { value: 'jingan', label: '静安区' },
    { value: 'putuo', label: '普陀区' },
  ],
  guangzhou: [
    { value: 'tianhe', label: '天河区' },
    { value: 'haizhu', label: '海珠区' },
    { value: 'liwan', label: '荔湾区' },
    { value: 'yuexiu', label: '越秀区' },
    { value: 'baiyun', label: '白云区' },
  ],
  shenzhen: [
    { value: 'futian', label: '福田区' },
    { value: 'nanshan', label: '南山区' },
    { value: 'baoan', label: '宝安区' },
    { value: 'luohu', label: '罗湖区' },
    { value: 'yantian', label: '盐田区' },
  ],
  hangzhou: [
    { value: 'xihu', label: '西湖区' },
    { value: 'gongshu', label: '拱墅区' },
    { value: 'jianggan', label: '江干区' },
    { value: 'xiacheng', label: '下城区' },
    { value: 'binjiang', label: '滨江区' },
  ],
}

export default {
  name: 'ActivityForm',
  components: {
    VabPageHeader,
  },
  data() {
    return {
      // 布局类型：left, right, top
      layout: 'left',
      // 表单数据模型
      form: {
        name: '',
        region: '',
        time: '',
        delivery: false,
        type: [],
        resource: '',
        form: '',
        rating: 0,
        district: '',
      },
      // 下拉选项数据
      regionOptions,
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 2, max: 50, message: '活动名称长度在2到50个字符之间', trigger: 'blur' },
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' },
        ],
        time: [
          { required: true, message: '请选择活动时间', trigger: 'change' },
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' },
        ],
        resource: [
          { required: true, message: '请选择特殊资源', trigger: 'change' },
        ],
        form: [
          { required: true, message: '请填写活动形式', trigger: 'blur' },
          { min: 10, max: 500, message: '活动形式长度在10到500个字符之间', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    // 根据当前选择的区域动态返回行政区划选项
    districtOptions() {
      return districtData[this.form.region] || []
    },
  },
  watch: {
    // 监听区域变化，清空之前选择的行政区划
    'form.region'(newVal) {
      if (!newVal) {
        this.form.district = ''
      }
    },
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 模拟API请求
          this.$axios.post('/api/activity', this.form)
            .then(response => {
              this.$message.success('活动创建成功！')
              // 跳转到活动列表页或详情页
              this.$router.push('/activity/list')
            })
            .catch(error => {
              this.$message.error('活动创建失败：' + error.message)
            })
        } else {
          this.$message.warning('表单验证失败，请检查必填项')
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style scoped>
.activity-form-container {
  padding: 20px;
}

.layout-switch-buttons {
  margin-bottom: 20px;
}

.layout-switch-buttons .el-button {
  margin-right: 10px;
}

.activity-form {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>