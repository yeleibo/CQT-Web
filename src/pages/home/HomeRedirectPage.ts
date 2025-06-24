import { history } from '@@/core/history';
import { useModel } from '@@/plugin-model';
import { FC, useEffect } from 'react';

const HomeRedirectPage: FC = () => {
  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    // 从 initialState 里获取菜单数组
    const menus = initialState?.currentUser?.menus;
    // 在 menus 里找到 name === '首页' 的那一项
    const homeMenuItem = menus?.find((menu) => menu.name === '首页');

    // 如果找到了，就拿到它的 path 执行跳转
    if (homeMenuItem && homeMenuItem.path) {
      // 打印跳转的路径
      console.log(`正在跳转到首页: ${homeMenuItem.path}`);
      history.push(homeMenuItem.path);
    } else {
      // 如果没找到，可以考虑跳转到一个默认页面
      // navigate('/default', { replace: true });
      console.warn('未找到 name 为“首页”的菜单项，请检查 initialState 配置。');
    }
  }, [initialState]);

  // 该组件不需要渲染任何 UI
  return null;
};

export default HomeRedirectPage;
