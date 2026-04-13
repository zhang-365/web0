class NotFoundLogger {
  private readonly MAX_ALLOWED: number;
  private readonly cacheKey: string;

  constructor() {
    this.MAX_ALLOWED = 3;
    this.cacheKey = '404_COUNT';
  }

  // 【修复】去掉了国外IP接口，完全避免网络错误
  // 你的后端可以直接拿到真实IP，前端不需要获取
  getClientIP(): string {
    return 'client-side-protected'; // 前端不获取IP，交给后端记录
  }

  // 获取本地存储的404次数
  getCount(): number {
    const val = localStorage.getItem(this.cacheKey);
    return val ? parseInt(val, 10) : 0;
  }

  // 增加计数
  increaseCount(): number {
    const count = this.getCount() + 1;
    localStorage.setItem(this.cacheKey, count.toString());
    return count;
  }

  // 上报日志（只传访问信息，IP由后台自动获取）
  async report(path: string) {
    const ip = this.getClientIP();
    const count = this.increaseCount();

    const log = {
      path,
      count,
      url: window.location.href,
      ua: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch('/api/log/404', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
    } catch (err) {}

    return { count, ip };
  }

  // 是否需要警告
  needWarn(): boolean {
    return this.getCount() >= this.MAX_ALLOWED;
  }
}

export default new NotFoundLogger();