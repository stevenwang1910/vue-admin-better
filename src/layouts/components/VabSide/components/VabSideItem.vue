<template>
  <component :is="menuComponent" v-if="!item.hidden" :full-path="fullPath" :item="item" :route-children="routeChildren">
    <template v-if="item.children && item.children.length">
      <vab-side-item v-for="route in item.children" :key="route.path" :full-path="handlePath(route.path)" :item="route" />
    </template>
  </component>
</template>

<script>
  import { isExternal } from '@/utils/validate'
  import path from 'path'
  import VabColumnSubmenu from './VabColumnSubmenu'

  export default {
    name: 'VabSideItem',
    components: { VabColumnSubmenu },
    props: {
      item: {
        type: Object,
        required: true,
      },
      fullPath: {
        type: String,
        default: '',
      },
    },
    data() {
      this.onlyOneChild = null
      return {}
    },
    computed: {
      menuComponent() {
        if (
          this.handleChildren(this.item.children, this.item) &&
          (!this.routeChildren.children || this.routeChildren.notShowChildren) &&
          !this.item.alwaysShow
        ) {
          return 'VabMenuItem'
        } else {
          // 检查是否启用分栏模式 - 响应式计算属性
          const theme = localStorage.getItem('vue-admin-better-theme')
          if (theme) {
            try {
              const themeConfig = JSON.parse(theme)
              if (themeConfig.name === 'blue-white' && themeConfig.columnMode === 'true') {
                return 'VabColumnSubmenu'
              }
            } catch (error) {
              console.warn('主题配置解析失败:', error)
            }
          }
          return 'VabSubmenu'
        }
      },
      // 添加主题配置计算属性
      themeConfig() {
        const theme = localStorage.getItem('vue-admin-better-theme')
        if (theme) {
          try {
            return JSON.parse(theme)
          } catch (error) {
            console.warn('主题配置解析失败:', error)
            return {}
          }
        }
        return {}
      }
    },
    watch: {
      // 监听主题变化事件
      '$baseEventBus': {
        handler() {
          // 监听主题更新事件
          this.$baseEventBus.$on('theme-updated', this.handleThemeUpdate)
        },
        immediate: true
      },
      // 监听主题配置变化
      themeConfig: {
        handler(newVal, oldVal) {
          if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            this.$forceUpdate()
            console.log('主题配置变化，强制重新渲染菜单组件')
          }
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      handleThemeUpdate(themeData) {
        // 主题更新时强制重新计算menuComponent
        this.$forceUpdate()
        console.log('主题已更新，重新渲染菜单组件:', themeData)
      },
      handleChildren(children = [], parent) {
        if (children === null) children = []
        const showChildren = children.filter((item) => {
          if (item.hidden) {
            return false
          } else {
            this.routeChildren = item
            return true
          }
        })
        if (showChildren.length === 1) {
          return true
        }

        if (showChildren.length === 0) {
          this.routeChildren = {
            ...parent,
            path: '',
            notShowChildren: true,
          }
          return true
        }
        return false
      },
      handlePath(routePath) {
        if (isExternal(routePath)) {
          return routePath
        }
        if (isExternal(this.fullPath)) {
          return this.fullPath
        }
        return path.resolve(this.fullPath, routePath)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .vab-nav-icon {
    margin-right: 4px;
  }

  ::v-deep {
    .el-tag {
      float: right;
      height: 16px;
      padding-right: 4px;
      padding-left: 4px;
      margin-top: calc((#{$base-menu-item-height} - 16px) / 2);
      line-height: 16px;
      border: 0;
    }
  }
</style>