import create from 'zustand';

import api from '../api';
import updateQuery from '../shared/updateQuery';

const defaultFilters = {
  account_number: '',
  client_id: '',
};

const initialState = {
  page: 1,
  perPage: 10,
  total: 0,
  connections: undefined,
  account_connections: undefined,
  loaded: 0,
  error: undefined,
  filters: defaultFilters,
};

const useConnectionsStore = create((set, get) => ({
  ...initialState,
  // actions
  setPerPage: (perPage) => {
    set({ perPage, page: 1 });
    get().refreshList();
  },
  setPage: (page) => {
    set({ page });
    get().refreshList();
  },
  setAccount: (value) => {
    set({ filters: { ...get().filters, account_number: value }, page: 1 });
    get().refreshList();
    updateQuery(get().filters.account_number, get().filters.client_id);
  },
  setClient: (value) => {
    set({ filters: { ...get().filters, client_id: value } });
    updateQuery(get().filters.account_number, get().filters.client_id);
  },
  resetFilters: () => {
    set({ filters: defaultFilters });
    get().refreshList();
  },
  refreshList: async (paramFilters) => {
    try {
      set({
        loaded: get().loaded + 1,
        ...(paramFilters && {
          filters: {
            ...get().filters,
            ...paramFilters,
          },
        }),
      });

      const { page, perPage, filters } = get();

      let result;
      if (filters.account_number) {
        result = await api.getListByAccountConnection({
          offset: (page - 1) * perPage,
          limit: perPage,
          account: filters.account_number,
        });
        set({
          loaded: get().loaded - 1,
          account_connections: result.data,
          total: result.meta.count,
        });
      } else {
        result = await api.getListConnection({
          offset: (page - 1) * perPage,
          limit: perPage,
        });
        set({
          loaded: get().loaded - 1,
          connections: result.data,
          total: result.meta.count,
        });
      }
    } catch (error) {
      set({
        loaded: get().loaded - 1,
        error,
      });
    }
  },
}));

export const getFilters = (store) => store.filters;
export const getConnections = (store) => store.connections;
export const getAccountConnections = (store) => store.account_connections;
export const getMetaData = ({ sortBy, sortDirection, total, page, perPage, error }) => ({
  sortBy,
  sortDirection,
  total,
  page,
  perPage,
  error,
});
export const getLoading = (store) => (!store.connections && !store.account_connections) || Boolean(store.loaded);

export const setPerPage = useConnectionsStore.getState().setPerPage;
export const setPage = useConnectionsStore.getState().setPage;
export const refreshList = useConnectionsStore.getState().refreshList;
export const resetFilters = useConnectionsStore.getState().resetFilters;
export const setAccount = useConnectionsStore.getState().setAccount;
export const setClient = useConnectionsStore.getState().setClient;

export const resetConnectionStore = (customInitialState) =>
  useConnectionsStore.setState({ ...initialState, ...customInitialState });

export default useConnectionsStore;
