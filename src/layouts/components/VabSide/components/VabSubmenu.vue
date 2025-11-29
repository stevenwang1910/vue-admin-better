<template>
  <el-submenu ref="subMenu" :index="handlePath(item.path)" :popper-append-to-body="false">
    <template slot="title">
      <vab-icon v-if="item.meta && item.meta.icon" :icon="['fas', item.meta.icon]" class="vab-fas-icon" />
      <vab-remix-icon v-if="item.meta && item.meta.remixIcon" :icon-class="item.meta.remixIcon" class="vab-remix-icon" />
      <span>{{ item.meta.title }}</span>
    </template>
    <div class="submenu-content" :class="{ 'column-layout': theme.columnLayout }" :style="{ gridTemplateColumns: `repeat(${theme.columnCount}, 1fr)` }">
      <slot />
    </div>
  </el-submenu>
</template>

<script>
  import { isExternal } from '@/utils/validate'
  import path from 'path'
  import { mapGetters } from 'vuex'

  export default {
    name: 'VabSubmenu',
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
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
      }),
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
    },
  }
</script>

<style lang="scss" scoped>
  .submenu-content {
    display: block;
    &.column-layout {
      display: grid;
      grid-gap: 8px;
      padding: 8px;
    }
  }
</style>
