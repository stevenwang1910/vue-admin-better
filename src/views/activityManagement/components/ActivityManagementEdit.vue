<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="800px" @close="close">
    <div class="form-layout-buttons">
      <el-button :type="formLayout === 'left' ? 'primary' : ''" @click="setFormLayout('left')">左对齐</el-button>
      <el-button :type="formLayout === 'right' ? 'primary' : ''" @click="setFormLayout('right')">右对齐</el-button>
      <el-button :type="formLayout === 'top' ? 'primary' : ''" @click="setFormLayout('top')">顶部对齐</el-button>
    </div>

    <el-form ref="form" :label-width="formLayout === 'top' ? '0px' : '120px'" :model="form" :rules="rules" :label-position="formLayout">
      <el-form-item label="活动名称*" prop="activityName">
        <el-input v-model.trim="form.activityName" autocomplete="off" placeholder="请输入活动名称" />
      </el-form-item>
      <el-form-item label="活动区域*" prop="activityRegion">
        <el-select v-model="form.activityRegion" placeholder="请选择活动区域">
          <el-option v-for="item in activityRegionOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间*" prop="startTime">
        <el-date-picker
          v-model="activityTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="handleActivityTimeChange"
        />
      </el-form-item>
      <el-form-item label="即时配送" prop="instantDelivery">
        <el-switch v-model="form.instantDelivery" active-text="开启" inactive-text="关闭" />
      </el-form-item>
      <el-form-item label="活动性质*" prop="activityNature">
        <el-checkbox-group v-model="form.activityNature">
          <el-checkbox label="美食/餐厅线上活动" />
          <el-checkbox label="地推活动" />
          <el-checkbox label="线下主题活动" />
          <el-checkbox label="单纯品牌曝光" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="特殊资源*" prop="specialResource">
        <el-radio-group v-model="form.specialResource">
          <el-radio label="线上品牌赞助" />
          <el-radio label="线下场地免费" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动形式*" prop="activityForm">
        <el-input v-model.trim="form.activityForm" type="textarea" :rows="4" placeholder="请详细描述活动形式和内容" />
      </el-form-item>
      <el-form-item label="评星" prop="rating">
        <el-rate v-model="form.rating" max="5" allow-half />
      </el-form-item>
      <el-form-item label="行政区划" prop="administrativeRegion">
        <el-select v-model="form.administrativeRegion" placeholder="请选择行政区划">
          <el-option v-for="item in administrativeRegionOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetForm">重置</el-button>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="save">立即创建/保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/activityManagement'

  export default {
    name: 'ActivityManagementEdit',
    data() {
      return {
        form: {
          id: '',
          activityName: '',
          activityRegion: '',
          startTime: '',
          endTime: '',
          instantDelivery: false,
          activityNature: [],
          specialResource: '',
          activityForm: '',
          rating: 0,
          administrativeRegion: '',
        },
        rules: {
          activityName: [{ required: true, trigger: 'blur', message: '请输入活动名称' }],
          activityRegion: [{ required: true, trigger: 'change', message: '请选择活动区域' }],
          startTime: [{ required: true, trigger: 'change', message: '请选择活动开始时间' }],
          activityNature: [{ required: true, trigger: 'change', message: '请选择活动性质' }],
          specialResource: [{ required: true, trigger: 'change', message: '请选择特殊资源' }],
          activityForm: [{ required: true, trigger: 'blur', message: '请输入活动形式' }],
        },
        title: '',
        dialogFormVisible: false,
        formLayout: 'right',
        activityTime: null,
        // 模拟从后端获取的活动区域选项
        activityRegionOptions: [
          { value: 'beijing', label: '北京市' },
          { value: 'shanghai', label: '上海市' },
          { value: 'guangzhou', label: '广州市' },
          { value: 'shenzhen', label: '深圳市' },
          { value: 'hangzhou', label: '杭州市' },
        ],
        // 模拟从后端获取的行政区划选项
        administrativeRegionOptions: [
          { value: 'beijing', label: '北京市' },
          { value: 'shanghai', label: '上海市' },
          { value: 'guangzhou', label: '广州市' },
          { value: 'shenzhen', label: '深圳市' },
          { value: 'hangzhou', label: '杭州市' },
        ],
      }
    },
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '创建活动'
        } else {
          this.title = '编辑活动'
          this.form = Object.assign({}, row)
          // 将地区名称转换为对应的value值
          const regionMap = {
            '北京市': 'beijing',
            '上海市': 'shanghai',
            '广州市': 'guangzhou',
            '深圳市': 'shenzhen',
            '杭州市': 'hangzhou'
          }
          this.form.activityRegion = regionMap[row.activityRegion] || row.activityRegion
          this.form.administrativeRegion = regionMap[row.administrativeRegion] || row.administrativeRegion
          if (row.startTime && row.endTime) {
            this.activityTime = [new Date(row.startTime), new Date(row.endTime)]
          }
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.activityTime = null
        this.dialogFormVisible = false
      },
      resetForm() {
        this.$refs['form'].resetFields()
        this.activityTime = null
      },
      setFormLayout(layout) {
        this.formLayout = layout
      },
      handleActivityTimeChange(val) {
        if (val && val.length === 2) {
          this.form.startTime = val[0]
          this.form.endTime = val[1]
        } else {
          this.form.startTime = ''
          this.form.endTime = ''
        }
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const { msg } = await doEdit(this.form)
            this.$baseMessage(msg, 'success')
            this.$emit('fetch-data')
            this.close()
          } else {
            return false
          }
        })
      },
    },
  }
</script>

<style scoped>
  .form-layout-buttons {
    margin-bottom: 20px;
    text-align: center;
  }
  .form-layout-buttons .el-button {
    margin: 0 10px;
  }
</style>
