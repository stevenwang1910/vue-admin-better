/**
 * 主题工具函数
 * @description 处理主题切换、蓝白主题特殊逻辑等
 */

/**
 * 获取当前主题配置
 * @returns {Object} 主题配置对象
 */
export function getThemeConfig() {
  const themeStr = localStorage.getItem('vue-admin-better-theme')
  if (!themeStr) {
    return {
      name: 'default',
      layout: 'vertical',
      header: 'fixed',
      tabsBar: 'true'
    }
  }
  
  try {
    return JSON.parse(themeStr)
  } catch (error) {
    console.warn('解析主题配置失败，使用默认配置', error)
    return {
      name: 'default',
      layout: 'vertical',
      header: 'fixed',
      tabsBar: 'true'
    }
  }
}

/**
 * 保存主题配置
 * @param {Object} config 主题配置对象
 */
export function saveThemeConfig(config) {
  try {
    localStorage.setItem('vue-admin-better-theme', JSON.stringify(config))
  } catch (error) {
    console.error('保存主题配置失败', error)
  }
}

/**
 * 应用主题
 * @param {string} themeName 主题名称
 */
export function applyTheme(themeName) {
  const body = document.getElementsByTagName('body')[0]
  if (!body) {
    console.warn('无法找到body元素，主题应用失败')
    return
  }
  
  // 移除所有主题类名
  const classes = body.className.split(' ')
  const filteredClasses = classes.filter(cls => !cls.startsWith('vue-admin-better-theme-'))
  
  // 添加新的主题类名
  filteredClasses.push(`vue-admin-better-theme-${themeName}`)
  body.className = filteredClasses.join(' ')
  
  console.log(`主题已应用: ${themeName}`)
}

/**
 * 处理蓝白主题分栏模式
 * @param {boolean} enable 是否启用分栏模式
 */
export function handleBlueWhiteColumnMode(enable) {
  const body = document.body
  
  if (enable) {
    body.classList.add('blue-white-column-mode', 'blue-white-column-transition')
    console.log('蓝白主题分栏模式已启用')
  } else {
    body.classList.remove('blue-white-column-mode', 'blue-white-column-transition')
    console.log('蓝白主题分栏模式已禁用')
  }
}

/**
 * 检查是否为蓝白主题
 * @returns {boolean}
 */
export function isBlueWhiteTheme() {
  const config = getThemeConfig()
  return config.name === 'blue-white'
}

/**
 * 初始化主题
 * @description 在应用启动时调用，用于恢复用户选择的主题
 */
export function initTheme() {
  const config = getThemeConfig()
  
  // 应用主题
  applyTheme(config.name)
  
  // 如果是蓝白主题且启用了分栏模式，应用分栏样式
  if (isBlueWhiteTheme() && config.columnMode === 'true') {
    handleBlueWhiteColumnMode(true)
  }
  
  console.log('主题初始化完成', config)
}

/**
 * 切换主题
 * @param {string} themeName 主题名称
 * @param {Object} options 额外选项
 */
export function switchTheme(themeName, options = {}) {
  const config = getThemeConfig()
  
  // 更新主题名称
  config.name = themeName
  
  // 处理蓝白主题的特殊选项
  if (themeName === 'blue-white') {
    if (options.columnMode !== undefined) {
      config.columnMode = options.columnMode.toString()
      handleBlueWhiteColumnMode(options.columnMode)
    }
  } else {
    // 非蓝白主题时移除分栏模式
    handleBlueWhiteColumnMode(false)
    delete config.columnMode
  }
  
  // 应用主题
  applyTheme(themeName)
  
  // 保存配置
  saveThemeConfig(config)
  
  console.log(`主题已切换至: ${themeName}`, config)
}

/**
 * 强制刷新菜单
 * @description 用于主题切换后重新渲染菜单
 */
export function forceRefreshMenu() {
  // 触发菜单重新渲染的事件
  const event = new CustomEvent('theme-menu-refresh', {
    detail: { timestamp: Date.now() }
  })
  document.dispatchEvent(event)
  
  console.log('菜单强制刷新已触发')
}

/**
 * 获取主题变量
 * @param {string} varName CSS变量名
 * @returns {string} CSS变量值
 */
export function getThemeVar(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName)
}

/**
 * 设置主题变量
 * @param {string} varName CSS变量名
 * @param {string} value CSS变量值
 */
export function setThemeVar(varName, value) {
  document.documentElement.style.setProperty(varName, value)
}

export default {
  getThemeConfig,
  saveThemeConfig,
  applyTheme,
  handleBlueWhiteColumnMode,
  isBlueWhiteTheme,
  initTheme,
  switchTheme,
  forceRefreshMenu,
  getThemeVar,
  setThemeVar
}