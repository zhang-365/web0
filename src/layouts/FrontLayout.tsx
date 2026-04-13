import { Outlet } from 'react-router-dom';

export default function FrontLayout() {
  return (
    <div>
      {/* 前台头部导航 */}
      <header>前台头部</header>

      {/* 页面内容 */}
      <main>
        <Outlet />
      </main>

      {/* 底部 */}
      <footer>前台底部</footer>
    </div>
  );
}