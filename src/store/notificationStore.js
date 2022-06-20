import create from 'zustand';

let id = 0;

const initialState = {
  notifications: [],
};

const useNotificationStore = create((set, get) => ({
  ...initialState,
  // actions
  removeNotification: (id) =>
    set({
      notifications: get().notifications.filter((not) => not.id !== id),
    }),
  addNotification: (notification) => {
    const notificationWithId = { ...notification, id: `${id++}` };

    set({
      notifications: [...get().notifications, notificationWithId],
    });

    return notificationWithId;
  },
  clearAllNotifications: () =>
    set({
      notifications: [],
    }),
}));

export const getNotifications = (store) => store.notifications;

export const removeNotification = useNotificationStore.getState().removeNotification;
export const addNotification = useNotificationStore.getState().addNotification;
export const clearAllNotifications = useNotificationStore.getState().clearAllNotifications;

export const resetNotificationStore = (customInitialState) => {
  id = 0;
  return useNotificationStore.setState({ ...initialState, ...customInitialState });
};

export default useNotificationStore;
