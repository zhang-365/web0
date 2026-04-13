// 让 TypeScript 识别 CSS/SCSS 文件
declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.module.less' {
  const classes: Record<string, string>;
  export default classes;
}