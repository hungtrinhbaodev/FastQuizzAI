import { useState, useEffect } from 'react';

import AppConst from './services/AppConst';
import appService from './services/AppService';

import userAvatar from './assets/user.jpg'
import UserInfo from './UserInfo';
import './Sidebar.css';

const Sidebar = ({ onSelect, currentId }) => {

  const hasUser = appService.hasUser();
  const userData = appService.getUserData();

  const [, setForceUpdate] = useState(0);

  useEffect(() => {
    const onDataChange = (subscribeType) => {
      switch (subscribeType) {
        case AppConst.SUBSCRIBE_TYPE.RELOAD_USER_DATA: {
          setForceUpdate(n => n + 1);
          break;
        }
      }
    };
    appService.subscribe(onDataChange);
    return () => {
      appService.unsubscribe(onDataChange);
    };
  }, []);

  const menuItems = [
    { id: 'create_exam', label: 'Create Exam' },
    { id: 'view_exam', label: 'View Exam' },
    { id: 'exam_history', label: 'Exam History' },
  ];

  return (
    <div className="sidebar"> 
      {hasUser && (
        <UserInfo
          name={userData.getUserName()}
          avatarURL={AppConst.SERVER_BASE_URL + userData.getUserAvatar() || userAvatar}
          onClickAvatar={() => {}}
        />
      )}
      {menuItems.map((item) => (
        <button
          key={item.id}
          className={`sidebar-button ${currentId === item.id ? 'active' : ''}`}
          onClick={() => {
            onSelect(item.id);
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;