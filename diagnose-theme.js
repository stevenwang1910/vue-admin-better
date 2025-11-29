// 主题配置检查工具
const fs = require('fs');
const path = require('path');

console.log('=== 蓝白主题切换问题诊断工具 ===\n');

// 检查关键文件是否存在
const keyFiles = [
    'src/styles/themes/blue-white.scss',
    'src/utils/theme.js',
    'src/layouts/components/VabTheme/index.vue',
    'src/layouts/components/VabSide/index.vue',
    'src/layouts/components/VabSide/components/VabSideItem.vue'
];

console.log('1. 检查关键文件是否存在:');
keyFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`   ${file}: ${exists ? '✓ 存在' : '✗ 不存在'}`);
});

// 检查blue-white.scss文件内容
console.log('\n2. 检查蓝白主题样式文件:');
try {
    const blueWhiteScss = fs.readFileSync('src/styles/themes/blue-white.scss', 'utf8');
    const hasColumnMode = blueWhiteScss.includes('blue-white-column-mode');
    const hasMenuStyles = blueWhiteScss.includes('.el-menu') && blueWhiteScss.includes('.el-menu-item');
    console.log(`   包含分栏模式类名: ${hasColumnMode ? '✓ 是' : '✗ 否'}`);
    console.log(`   包含菜单样式: ${hasMenuStyles ? '✓ 是' : '✗ 否'}`);
} catch (error) {
    console.log(`   读取文件失败: ${error.message}`);
}

// 检查theme.js文件
console.log('\n3. 检查主题工具文件:');
try {
    const themeJs = fs.readFileSync('src/utils/theme.js', 'utf8');
    const hasBlueWhiteHandling = themeJs.includes('blue-white-column-mode');
    const hasForceRerender = themeJs.includes('force-vue-rerender');
    console.log(`   包含分栏模式处理: ${hasBlueWhiteHandling ? '✓ 是' : '✗ 否'}`);
    console.log(`   包含强制重新渲染: ${hasForceRerender ? '✓ 是' : '✗ 否'}`);
} catch (error) {
    console.log(`   读取文件失败: ${error.message}`);
}

// 检查VabTheme组件
console.log('\n4. 检查主题配置组件:');
try {
    const vabTheme = fs.readFileSync('src/layouts/components/VabTheme/index.vue', 'utf8');
    const hasBlueWhiteTheme = vabTheme.includes('blue-white');
    const hasColumnMode = vabTheme.includes('columnMode');
    const hasForceRerender = vabTheme.includes('force-vue-rerender');
    console.log(`   包含蓝白主题选项: ${hasBlueWhiteTheme ? '✓ 是' : '✗ 否'}`);
    console.log(`   包含分栏模式设置: ${hasColumnMode ? '✓ 是' : '✗ 否'}`);
    console.log(`   包含强制重新渲染: ${hasForceRerender ? '✓ 是' : '✗ 否'}`);
} catch (error) {
    console.log(`   读取文件失败: ${error.message}`);
}

// 检查侧边栏组件
console.log('\n5. 检查侧边栏组件:');
try {
    const vabSide = fs.readFileSync('src/layouts/components/VabSide/index.vue', 'utf8');
    const hasForceRerender = vabSide.includes('force-vue-rerender');
    const hasMenuKey = vabSide.includes('menuKey');
    console.log(`   包含强制重新渲染: ${hasForceRerender ? '✓ 是' : '✗ 否'}`);
    console.log(`   包含菜单key: ${hasMenuKey ? '✓ 是' : '✗ 否'}`);
} catch (error) {
    console.log(`   读取文件失败: ${error.message}`);
}

// 检查VabSideItem组件
console.log('\n6. 检查菜单项组件:');
try {
    const vabSideItem = fs.readFileSync('src/layouts/components/VabSide/components/VabSideItem.vue', 'utf8');
    const hasThemeConfig = vabSideItem.includes('themeConfig');
    const hasForceUpdate = vabSideItem.includes('$forceUpdate');
    console.log(`   包含主题配置监听: ${hasThemeConfig ? '✓ 是' : '✗ 否'}`);
    console.log(`   包含强制更新: ${hasForceUpdate ? '✓ 是' : '✗ 否'}`);
} catch (error) {
    console.log(`   读取文件失败: ${error.message}`);
}

console.log('\n=== 诊断完成 ===');
console.log('\n建议操作:');
console.log('1. 确保所有文件都存在且包含必要的代码');
console.log('2. 检查浏览器控制台是否有错误信息');
console.log('3. 使用测试工具验证主题切换功能');
console.log('4. 检查网络请求是否成功加载了主题样式文件');