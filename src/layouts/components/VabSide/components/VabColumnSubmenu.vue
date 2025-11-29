<template>
  <el-submenu ref="subMenu" :index="handlePath(item.path)" :popper-append-to-body="false" :class="{ 'fade-in': isAnimating }">
    <template slot="title">
      <vab-icon v-if="item.meta && item.meta.icon" :icon="['fas', item.meta.icon]" class="vab-fas-icon" />
      <vab-remix-icon v-if="item.meta && item.meta.remixIcon" :icon-class="item.meta.remixIcon" class="vab-remix-icon" />
      <span>{{ item.meta.title }}</span>
    </template>
    <div class="column-menu-container" :class="getColumnClass()">
      <slot />
    </div>
  </el-submenu>
</template>

<script>
  import { isExternal } from '@/utils/validate'
  import path from 'path'

  export default {
    name: 'VabColumnSubmenu',
    props: {
      routeChildren: {
        type: Object,
        default() {
          return null
        },
      },
      item: {
        type: Object,
        default() {
          return null
        },
      },
      fullPath: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        isAnimating: false,
      }
    },
    mounted() {
      this.startAnimation()
    },
    methods: {
      startAnimation() {
        this.isAnimating = true
        setTimeout(() => {
          this.isAnimating = false
        }, 300)
      },
    },
    computed: {
      theme() {
        const theme = localStorage.getItem('vue-admin-better-theme')
        return theme ? JSON.parse(theme) : {}
      },
      columnMode() {
        return this.theme.name === 'blue-white' && this.theme.columnMode === 'true'
      },
      columnCount() {
        return parseInt(this.theme.columnCount) || 2
      }
    },
    methods: {
      handlePath(routePath) {
        if (isExternal(routePath)) {
          return routePath
        }
        if (isExternal(this.fullPath)) {
          return this.fullPath
        }
        return path.resolve(this.fullPath, routePath)
      },
      getColumnClass() {
        if (!this.columnMode) return ''
        
        const classMap = {
          1: 'column-single',
          2: 'column-double',
          3: 'column-triple',
          4: 'column-quad'
        }
        
        return `column-menu ${classMap[this.columnCount] || 'column-double'}`
      }
    },
  }
</script>

<style lang="scss" scoped>
  .column-menu-container {
    &.column-menu {
      display: grid;
      gap: 8px;
      padding: 12px;
      background-color: #FFFFFF;
      border: 1px solid #E5E6EB;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(22, 93, 255, 0.15);
      
      &.column-single {
        grid-template-columns: 1fr;
      }
      
      &.column-double {
        grid-template-columns: repeat(2, 1fr);
      }
      
      &.column-triple {
        grid-template-columns: repeat(3, 1fr);
      }
      
      &.column-quad {
        grid-template-columns: repeat(4, 1fr);
      }
      
      ::v-deep .el-menu-item {
        margin: 0;
        padding: 8px 12px !important;
        border-radius: 6px;
        background-color: #E8F3FF;
        color: #1D2129;
        transition: all 0.2s ease;
        min-height: 36px;
        line-height: 20px;
        
        &:hover {
          background-color: #F2F3F5;
          color: #165DFF;
          transform: translateY(-1px);
        }
        
        &.is-active {
          background-color: #165DFF;
          color: #FFFFFF;
          box-shadow: 0 2px 8px rgba(22, 93, 255, 0.3);
        }
      }
    }
  }

  // 响应式适配
  @media (max-width: 768px) {
    .column-menu-container {
      &.column-menu {
        grid-template-columns: 1fr !important;
        gap: 6px;
        padding: 8px;
      }
    }
  }

  @media (max-width: 480px) {
    .column-menu-container {
      &.column-menu {
        ::v-deep .el-menu-item {
          padding: 6px 10px !important;
          font-size: 13px;
        }
      }
    }
  }
</style>