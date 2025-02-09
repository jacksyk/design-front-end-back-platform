const path = require('path');
const { globSync } = require('glob');

// 递归遍历目录生成路由配置
const generateRoutes = (dir) => {
  const pattern = `${dir}/*/`;
  const files = globSync(pattern);
  const routes = [];

  routes.push({
    path: '/',
    redirect: '/home',
  });

  files.forEach((file) => {
    routes.push({
      // path: file.slice(file.lastIndexOf('\\') + 1).toLowerCase(), // 兼容性问题
      path: path.basename(file).toLowerCase(),
      component: path.resolve(process.cwd(), file, 'index.tsx'), // 使用绝对路径
    });
  });
  return routes;
};

// 定义插件
module.exports = (api) => {
  api.modifyConfig((memo) => {
    api.logger.profile('路由生成');
    const routes = generateRoutes(path.join(process.cwd(), 'src/pages'));
    memo.routes = routes;
    api.logger.profile('路由生成');
    api.logger.info('路由自动生成完成');
    return memo;
  });
};
