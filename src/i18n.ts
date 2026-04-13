import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 【可从后台获取】
const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        products: "Products",
        about: "About Us",
        contact: "Contact"
      },
      404: {
        title: "Page Not Found",
        desc: "The page you visited does not exist",
        back: "Return Home",
        warning: "We detected frequent invalid access. Your IP has been recorded."
      },
      common: {
        warning: "Warning"
      }
    }
  },
  zh: {
    translation: {
      nav: {
        home: "首页",
        products: "产品中心",
        about: "关于我们",
        contact: "联系我们"
      },
      404: {
        title: "页面不存在",
        desc: "您访问的页面无法找到",
        back: "返回首页",
        warning: "我们检测到多次无效访问，您的 IP 已被记录。"
      },
      common: {
        warning: "警告"
      }
    }
  }
};

i18n
  .use(LanguageDetector) // 自动检测浏览器语言
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'cookie', 'navigator']
    }
  });

export default i18n;