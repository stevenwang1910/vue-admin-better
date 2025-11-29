// 主题配置测试脚本
console.log('=== 主题配置测试开始 ===');

// 检查localStorage中的主题配置
const themeData = localStorage.getItem('vue-admin-better-theme');
console.log('localStorage中的主题配置:', themeData);

if (themeData) {
    try {
        const theme = JSON.parse(themeData);
        console.log('解析后的主题配置:', theme);
        
        // 检查主题属性
        console.log('主题名称:', theme.name);
        console.log('分栏模式:', theme.columnMode);
        console.log('分栏数量:', theme.columnCount);
        
        // 检查body类名
        const bodyClasses = document.body.className;
        console.log('Body类名:', bodyClasses);
        
        // 检查是否应用了正确的类名
        const expectedThemeClass = `vue-admin-better-theme-${theme.name}`;
        const hasThemeClass = document.body.classList.contains(expectedThemeClass);
        console.log('主题类名应用状态:', hasThemeClass ? '✓ 正确' : '✗ 错误');
        
        if (theme.name === 'blue-white' && theme.columnMode === 'true') {
            const hasColumnMode = document.body.classList.contains('blue-white-column-mode');
            const hasColumnTransition = document.body.classList.contains('blue-white-column-transition');
            console.log('分栏模式类名:', hasColumnMode ? '✓ 已应用' : '✗ 未应用');
            console.log('分栏过渡类名:', hasColumnTransition ? '✓ 已应用' : '✗ 未应用');
            
            // 检查列数类名
            const columnClassMap = {
                '1': 'column-single',
                '2': 'column-double', 
                '3': 'column-triple',
                '4': 'column-quad'
            };
            const expectedColumnClass = columnClassMap[theme.columnCount] || 'column-double';
            const hasColumnClass = document.body.classList.contains(expectedColumnClass);
            console.log('列数类名:', hasColumnClass ? `✓ ${expectedColumnClass}` : `✗ 缺少 ${expectedColumnClass}`);
        }
        
    } catch (error) {
        console.error('主题配置解析失败:', error);
    }
} else {
    console.log('未找到主题配置，使用默认主题');
}

console.log('=== 主题配置测试结束 ===');

// 导出测试函数供全局使用
window.testThemeConfig = function() {
    console.log('=== 手动主题测试 ===');
    
    // 设置测试主题
    const testTheme = {
        "name": "blue-white",
        "layout": "vertical",
        "header": "fixed",
        "tabsBar": "true",
        "columnMode": "true",
        "columnCount": "2"
    };
    
    localStorage.setItem('vue-admin-better-theme', JSON.stringify(testTheme));
    console.log('已设置测试主题:', testTheme);
    
    // 触发主题初始化
    if (window.initTheme) {
        window.initTheme();
        console.log('已调用initTheme函数');
    } else {
        console.log('未找到initTheme函数，手动应用主题...');
        
        // 手动应用主题
        const body = document.body;
        body.className = `vue-admin-better-theme-blue-white`;
        body.classList.add('blue-white-column-mode');
        body.classList.add('blue-white-column-transition');
        body.classList.add('column-double');
        
        console.log('已手动应用蓝白主题和分栏模式');
    }
    
    updateStatus();
};

window.clearThemeConfig = function() {
    localStorage.removeItem('vue-admin-better-theme');
    document.body.className = '';
    console.log('主题配置已清除');
    updateStatus();
};

window.updateStatus = function() {
    console.log('=== 状态更新 ===');
    const themeData = localStorage.getItem('vue-admin-better-theme');
    console.log('当前主题配置:', themeData);
    console.log('当前body类名:', document.body.className);
};

// 自动执行一次测试
setTimeout(() => {
    console.log('执行自动主题测试...');
    updateStatus();
}, 1000);