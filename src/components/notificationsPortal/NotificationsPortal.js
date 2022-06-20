import React from 'react';
import shallow from 'zustand/shallow';

import Portal from '@redhat-cloud-services/frontend-components-notifications/Portal';

import useNotificationStore, { clearAllNotifications, getNotifications, removeNotification } from '../../store/notificationStore';

const RCANotificationsPortal = () => {
  const notifications = useNotificationStore(getNotifications, shallow);

  return <Portal notifications={notifications} removeNotification={removeNotification} onClearAll={clearAllNotifications} />;
};

export default RCANotificationsPortal;
