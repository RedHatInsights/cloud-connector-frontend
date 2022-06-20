import { act, render, screen } from '@testing-library/react';

import RCANotificationsPortal from '../components/notificationsPortal/NotificationsPortal';
import { addNotification, clearAllNotifications, removeNotification, resetNotificationStore } from '../store/notificationStore';
import TestWrapper from './TestWrapper';

describe('NotificationsPortal', () => {
  it('renders and removes notification', async () => {
    resetNotificationStore();

    render(
      <TestWrapper>
        <RCANotificationsPortal />
      </TestWrapper>
    );

    let notification;

    await act(async () => {
      notification = addNotification({
        title: 'notification custom title',
        variant: 'danger',
        description: 'custom description',
        autoDismiss: false,
      });
    });

    expect(screen.getByText('notification custom title')).toBeInTheDocument();
    expect(screen.getByText('custom description')).toBeInTheDocument();

    await act(async () => {
      removeNotification(notification.id);
    });

    expect(() => screen.getByText('notification custom title')).toThrow();
    expect(() => screen.getByText('custom description')).toThrow();
  });

  it('remove all notifications', async () => {
    resetNotificationStore({
      notifications: [
        {
          id: `1`,
          variant: 'danger',
          title: 'Notification 1',
        },
        {
          id: `2`,
          variant: 'success',
          title: 'Notification 2',
        },
        {
          id: `3`,
          variant: 'warning',
          title: 'Notification 3',
        },
      ],
    });

    render(
      <TestWrapper>
        <RCANotificationsPortal />
      </TestWrapper>
    );

    expect(screen.getByText('Notification 1')).toBeInTheDocument();
    expect(screen.getByText('Notification 2')).toBeInTheDocument();
    expect(screen.getByText('Notification 3')).toBeInTheDocument();

    await act(async () => {
      clearAllNotifications();
    });

    expect(() => screen.getByText('Notification 1')).toThrow();
    expect(() => screen.getByText('Notification 2')).toThrow();
    expect(() => screen.getByText('Notification 3')).toThrow();
  });
});
