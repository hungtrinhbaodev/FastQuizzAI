import { useState, useEffect } from 'react';

import AppConst from './services/AppConst';
import appService from './services/AppService';

import userAvatar from './assets/user.jpg'
import UserInfo from './UserInfo';
import './Sidebar.css';
import DialogData from './data/DialogData';

const Sidebar = ({ onSelect, currentId, useDialog}) => {

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
    { id: 'examing', label: 'Examing' },
  ];

  const getButtonStyles = (id) => {
    const styles = {};
    if (id == 'examing') {
      appService.getAppData().getAppState() !== AppConst.APP_STATE.EXEMING && (styles['display'] = 'none');
    }
    return styles;
  };

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
          style={getButtonStyles(item.id)}
          onClick={() => {
            if (appService.getAppData().getAppState() === AppConst.APP_STATE.IDLE) {
              onSelect(item.id);
              return;
            }
            if (appService.getAppData().getAppState() === AppConst.APP_STATE.EXEMING) {
              useDialog(DialogData.makeConfirmNotify("You're in examing phase can't open other tab!"));
            }
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;