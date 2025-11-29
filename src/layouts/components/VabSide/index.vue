<template>
  <el-scrollbar :class="{ 'is-collapse': collapse }" class="side-container">
    <vab-logo />
    <el-menu
      :key="menuKey"
      active-text-color=" hsla(0, 0%, 100%, 0.95)"
      background-color="#191a23"
      :collapse="collapse"
      :collapse-transition="false"
      :default-active="activeMenu"
      :default-openeds="defaultOpens"
      text-color=" hsla(0, 0%, 100%, 0.95)"
      :unique-opened="uniqueOpened"
      mode="vertical"
    >
      <template v-for="route in routes">
        <vab-side-item :full-path="route.path" :item="route" />
      </template>
    </el-menu>
  </el-scrollbar>
</template>
<script>
  import variables from '@/styles/variables.scss'
  import { mapGetters } from 'vuex'
  import { defaultOopeneds, uniqueOpened } from '@/config'
  import VabSideItem from './components/VabSideItem'

  export default {
    name: 'VabSide',
    components: { VabSideItem },
    data() {
      return {
        uniqueOpened,
        menuKey: Date.now(), // 添加key用于强制重新渲染
      }
    },
    computed: {
      ...mapGetters({
        collapse: 'settings/collapse',
        routes: 'routes/routes',
      }),
      defaultOpens() {
        if (this.collapse) {
        }
        return defaultOopeneds
      },
      activeMenu() {
        const route = this.$route
        const { meta, path } = route
        if (meta.activeMenu) {
          return meta.activeMenu
        }
        return path
      },
      variables() {
        return variables
      },
    },
    created() {
      // 监听主题变化事件
      if (this.$baseEventBus) {
        this.$baseEventBus.$on('theme-updated', this.handleThemeUpdate)
        this.$baseEventBus.$on('force-vue-rerender', this.handleForceRerender)
      }
      
      // 监听localStorage变化
      window.addEventListener('storage', this.handleStorageChange)
    },
    beforeDestroy() {
      // 移除事件监听
      if (this.$baseEventBus) {
        this.$baseEventBus.$off('theme-updated', this.handleThemeUpdate)
        this.$baseEventBus.$off('force-vue-rerender', this.handleForceRerender)
      }
      window.removeEventListener('storage', this.handleStorageChange)
    },
    methods: {
      handleThemeUpdate(themeData) {
        console.log('侧边栏收到主题更新:', themeData)
        // 强制重新渲染菜单
        this.menuKey = Date.now()
      },
      handleForceRerender() {
        console.log('侧边栏收到强制重新渲染命令')
        this.menuKey = Date.now()
      },
      handleStorageChange(e) {
        if (e.key === 'vue-admin-better-theme') {
          console.log('检测到主题配置变化:', e.newValue)
          this.menuKey = Date.now()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @mixin active {
    &:hover {
      color: $base-color-white;
      background-color: $base-menu-background-active !important;
    }

    &.is-active {
      color: $base-color-white;
      background-color: $base-menu-background-active !important;
    }
  }

  .side-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: $base-z-index;
    width: $base-left-menu-width;
    height: 100vh;
    overflow: hidden;
    background: $base-menu-background;
    box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
    transition: width $base-transition-time;

    &.is-collapse {
      width: $base-left-menu-width-min;
      border-right: 0;

      ::v-deep {
        .el-menu {
          transition: width $base-transition-time;
        }

        .el-menu--collapse {
          border-right: 0;

          .el-submenu__icon-arrow {
            right: 10px;
            margin-top: -3px;
          }

          .el-menu-item,
          .el-submenu {
            text-align: center;
          }
        }
      }
    }

    ::v-deep {
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }

      .el-menu {
        border: 0;

        .vab-fas-icon {
          padding-right: 3px;
          font-size: $base-font-size-default;
          display: inline-block;
          width: 14px;
        }

        .vab-remix-icon {
          padding-right: 3px;
          font-size: $base-font-size-default + 2;
        }
      }

      .el-menu-item,
      .el-submenu__title {
        height: $base-menu-item-height;
        line-height: $base-menu-item-height;
        vertical-align: middle;
      }

      .el-menu-item {
        @include active;
      }
    }
  }
</style>
