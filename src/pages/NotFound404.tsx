import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import logger from '../utils/404Logger';

const NotFound404 = () => {
  const { t } = useTranslation();
  const [showWarn, setShowWarn] = useState(false);
  const [ip, setIp] = useState('');

  useEffect(() => {
    const log = async () => {
      const { count, ip } = await logger.report(window.location.pathname);
      setIp(ip);
      if (count >= 3) setShowWarn(true);
    };
    log();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f9fa'
    }}>
      <h1 style={{ fontSize: '80px' }}>404</h1>
      <h2>{t('404.title')}</h2>
      <p>{t('404.desc')}</p>

      {showWarn && (
        <div style={{
          marginTop: '20px',
          padding: '15px 25px',
          background: '#fff3cd',
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <h4>{t('common.warning')}</h4>
          <p>{t('404.warning')}</p>
        </div>
      )}

      <a href="/" style={{
        marginTop: '20px',
        padding: '10px 20px',
        background: '#3498db',
        color: '#fff',
        borderRadius: 6,
        textDecoration: 'none'
      }}>
        {t('404.back')}
      </a>
    </div>
  );
};

export default NotFound404;