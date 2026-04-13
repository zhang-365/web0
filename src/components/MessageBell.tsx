import { Badge, Dropdown, Button, Typography, notification } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef } from 'react';
import { getUnreadCountApi, markAllReadApi, getMessageListApi } from '../api/messageApi';


interface MessageItem {
  id: number;
  title: string;
  content: string;
  isRead: boolean;
  createTime: string;
}

const MessageBell = () => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [messageList, setMessageList] = useState<MessageItem[]>([]);
  const notifiedMsgIds = useRef<number[]>([]);

  // 原生提示音
  const playSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.3;

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.15);
    } catch (e) { }
  };

  // 加载消息
  const loadMsg = async () => {
    try {
      const cRes = await getUnreadCountApi();
      setUnreadCount(cRes.data?.data ?? 0);

      const lRes = await getMessageListApi(1, 10);
      const newList: MessageItem[] = lRes.data?.list ?? [];
      setMessageList(newList);


      newList.forEach((m: MessageItem) => {
        if (!m.isRead && !notifiedMsgIds.current.includes(m.id)) {
          notifiedMsgIds.current.push(m.id);
          playSound();
          notification.info({
            message: m.title,
            description: m.content,
            duration: 4,
          });
        }
      });
    } catch (err) {
      console.log('消息加载失败', err);
    }
  };

  useEffect(() => {
    loadMsg();
    const timer = setInterval(loadMsg, 3000);
    return () => clearInterval(timer);
  }, []);

  // 全部已读
  const handleAllRead = async () => {
    await markAllReadApi();
    setUnreadCount(0);
    setMessageList((prev) => prev.map((m) => ({ ...m, isRead: true })));
  };

  const menu = {
    items: [
      {
        key: 'head',
        label: (
          <div className='xiaoxi'>
            消息通知
            <Button size="small" type="text" onClick={handleAllRead}>全部已读</Button>
          </div>
        ),
        disabled: true,
      },
      ...messageList.map((m: MessageItem) => ({
        key: m.id,
        label: (
          <div className='lable'>
            <div className={m.isRead ? 'lable_Isread' : 'lable_IsNOread'}>{m.title}</div>
            <Typography.Text type="secondary" ellipsis style={{ fontSize: 12 }}>
              {m.content}
            </Typography.Text>
          </div>
        ),
      })),
      {
        key: 'more',
        label: (
          <div className='lablediv'>
            <Button type="link" onClick={() => (window.location.href = '/message/list')}>
              查看全部
            </Button>
          </div>
        ),
      },
    ],
  };

  return (
    <Dropdown menu={menu} trigger={['hover']} placement="bottomRight">
      <Badge count={unreadCount} color="red" offset={[5, 0]}>
        <BellOutlined style={{ fontSize: 18, color: '#fff', marginRight: 16 }} />
      </Badge>
    </Dropdown>
  );
};

export default MessageBell;