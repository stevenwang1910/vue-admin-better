// 主题初始化脚本
export function initTheme() {
  console.log('开始主题初始化...')
  const themeData = localStorage.getItem('vue-admin-better-theme')
  console.log('获取到的主题数据:', themeData)
  
  if (themeData) {
    try {
      const theme = JSON.parse(themeData)
      console.log('解析后的主题对象:', theme)
      
      const body = document.getElementsByTagName('body')[0]
      
      // 清除之前的主题类名（保留必要的系统类名）
      const classesToRemove = []
      body.classList.forEach(className => {
        if (className.startsWith('vue-admin-better-theme-') ||
            className.startsWith('blue-white-column-') ||
            className.startsWith('column-')) {
          classesToRemove.push(className)
        }
      })
      classesToRemove.forEach(className => body.classList.remove(className))
      
      // 应用主题类名
      const themeClass = `vue-admin-better-theme-${theme.name || 'default'}`
      body.classList.add(themeClass)
      console.log('应用主题类名:', themeClass)
      
      // 应用分栏模式类名
      if (theme.name === 'blue-white' && theme.columnMode === 'true') {
        console.log('检测到蓝白主题分栏模式，应用相关类名')
        body.classList.add('blue-white-column-mode')
        body.classList.add('blue-white-column-transition')
        
        // 添加对应的列数类名
        const columnClassMap = {
          '1': 'column-single',
          '2': 'column-double',
          '3': 'column-triple',
          '4': 'column-quad'
        }
        const columnClass = columnClassMap[theme.columnCount] || 'column-double'
        body.classList.add(columnClass)
        console.log('应用分栏类名:', columnClass)
      } else {
        console.log('未检测到蓝白主题分栏模式，移除相关类名')
        body.classList.remove('blue-white-column-mode', 'blue-white-column-transition')
        body.classList.remove('column-single', 'column-double', 'column-triple', 'column-quad')
      }
      
      console.log('主题初始化成功，最终类名:', body.className)
      
      // 触发自定义事件通知主题已初始化
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('theme-initialized', { detail: theme }))
      }
      
      // 强制重新渲染Vue组件
      setTimeout(() => {
        if (window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('force-vue-rerender'))
        }
      }, 100)
      
    } catch (error) {
      console.error('主题初始化失败:', error)
    }
  } else {
    console.log('未找到主题配置，使用默认主题')
    // 应用默认主题
    const body = document.getElementsByTagName('body')[0]
    body.classList.add('vue-admin-better-theme-default')
  }
}