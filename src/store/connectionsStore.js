import create from 'zustand';

import api from '../api';

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
  selectedConnection: undefined,
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
  setSort: (sortBy, sortDirection) => {
    set({ sortBy, sortDirection });
    get().refreshList();
  },
  setFilters: (name, value) => {
    set({ filters: { ...get().filters, [name]: value }, page: 1 });
    get().refreshList();
  },
  resetFilters: () => {
    set({ filters: defaultFilters });
    get().refreshList();
  },
  refreshList: async () => {
    try {
      set({
        loaded: get().loaded + 1,
      });

      const { page, perPage, filters } = get();

      let result;
      if (filters.account_number) {
        result = await api.getListByAccountConnection({
          offset: page,
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
          offset: page,
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
  selectConnection: (account, node) => {
    set({
      selectedConnection: { account, node },
    });
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
export const getLoading = (store) => !store.connections || Boolean(store.loaded);
export const getSelected = (store) => store.selectedConnection;

export const setPerPage = useConnectionsStore.getState().setPerPage;
export const setPage = useConnectionsStore.getState().setPage;
export const refreshList = useConnectionsStore.getState().refreshList;
export const setFilters = useConnectionsStore.getState().setFilters;
export const resetFilters = useConnectionsStore.getState().resetFilters;
export const selectConnection = useConnectionsStore.getState().selectConnection;

export const resetOverviewState = (customInitialState) =>
  useConnectionsStore.setState({ ...initialState, ...customInitialState });

export default useConnectionsStore;
