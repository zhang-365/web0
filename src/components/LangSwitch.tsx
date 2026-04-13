import { useTranslation } from 'react-i18next';

const LangSwitch = () => {
  const { i18n } = useTranslation();

  const changeLang = (lang: 'en' | 'zh') => {
    i18n.changeLanguage(lang);
  };

  return (
    <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
      <button
        onClick={() => changeLang('en')}
        style={{
          padding: '5px 10px',
          background: i18n.language === 'en' ? '#3498db' : '#fff',
          color: i18n.language === 'en' ? '#fff' : '#333',
          border: 'none',
          borderRadius: 4
        }}
      >
        EN
      </button>
      <button
        onClick={() => changeLang('zh')}
        style={{
          padding: '5px 10px',
          background: i18n.language === 'zh' ? '#3498db' : '#fff',
          color: i18n.language === 'zh' ? '#fff' : '#333',
          border: 'none',
          borderRadius: 4
        }}
      >
        中文
      </button>
    </div>
  );
};

export default LangSwitch;