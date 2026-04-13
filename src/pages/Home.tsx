const Home = () => {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>网站首页</h1>
      <p>欢迎访问本站，这里是前台首页内容。</p>
      <div style={{ marginTop: '20px' }}>
        <a href="/about" style={{ marginRight: '10px' }}>关于我们</a>
        <a href="/product">产品中心</a>
      </div>
    </div>
  );
};

export default Home;