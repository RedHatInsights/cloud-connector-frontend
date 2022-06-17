import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Accounts from '../pages/Accounts';
import { resetConnectionStore } from '../store/connectionsStore';
import TestWrapper from './TestWrapper';
import api from '../api';
import generateConnections from './__mocks__/connections';
import generateAccount from './__mocks__/account';
import generateStatus from './__mocks__/status';
import * as updateQuery from '../shared/updateQuery';
import useNotificationStore, { resetNotificationStore } from '../store/notificationStore';

describe('<Accounts />', () => {
  it('renders and loads data correctly', async () => {
    api.getListConnection = mockApi();

    resetConnectionStore();

    render(
      <TestWrapper>
        <Accounts />
      </TestWrapper>
    );

    expect(screen.getByText('Accounts')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument());

    const connections = generateConnections(1, 10);

    expect(api.getListConnection).toHaveBeenCalledWith({ limit: 10, offset: 0 });

    const data = {
      meta: { count: connections.length },
      data: connections,
    };

    api.getListConnection.resolve(data);

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());
    expect(screen.getByText('Select an account to see a list of connections')).toBeInTheDocument();

    expect(screen.getByText(connections[0].account)).toBeInTheDocument();
    expect(screen.getByText(connections[0].connections_count + ' connections')).toBeInTheDocument();
  });

  it('renders error real', async () => {
    api.getListConnection = mockApi();

    resetConnectionStore();

    render(
      <TestWrapper>
        <Accounts />
      </TestWrapper>
    );

    expect(screen.getByText('Accounts')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument());

    api.getListConnection.reject('SOME API ERROR');

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());
    expect(screen.getByText('Accounts')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('There was a problem processing the request. Please try again.')).toBeInTheDocument();
  });

  it('opens an account from the list', async () => {
    const user = userEvent.setup();

    updateQuery.default = jest.fn();

    const connections = generateConnections(1, 10);

    const data = {
      meta: { count: connections.length },
      data: connections,
    };

    api.getListConnection = jest.fn().mockResolvedValue(data);

    const account = generateAccount();

    api.getListByAccountConnection = jest.fn().mockResolvedValue(account);

    resetConnectionStore();
    resetNotificationStore();

    render(
      <TestWrapper>
        <Accounts />
      </TestWrapper>
    );

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    await user.click(screen.getByText(`${connections[0].connections_count} connections`));

    expect(api.getListByAccountConnection).toHaveBeenCalledWith({
      account: String(connections[0].account),
      limit: 10,
      offset: 0,
    });
  });

  it('search by account', async () => {
    const user = userEvent.setup();

    updateQuery.default = jest.fn();
    api.getListConnection = mockApi();

    resetConnectionStore();
    resetNotificationStore();

    render(
      <TestWrapper>
        <Accounts />
      </TestWrapper>
    );

    await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument());

    const connections = generateConnections(1, 10);

    const data = {
      meta: { count: connections.length },
      data: connections,
    };

    api.getListConnection.resolve(data);

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    api.getListByAccountConnection = mockApi();

    await user.type(screen.getByLabelText('Find by account number'), '12345');

    await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument(), { timeout: '501' });

    expect(api.getListByAccountConnection).toHaveBeenCalledWith({ account: '12345', limit: 10, offset: 0 });
    expect(updateQuery.default).toHaveBeenLastCalledWith('12345', '');

    const account = generateAccount();

    api.getListByAccountConnection.resolve(account);

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    api.statusConnection = mockApi();

    await user.click(screen.getByText(account.data[0]));

    expect(api.statusConnection).toHaveBeenCalledWith({ node_id: account.data[0] });
    expect(updateQuery.default).toHaveBeenLastCalledWith('12345', account.data[0]);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    const status = generateStatus();

    api.statusConnection.resolve(status);

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    expect(screen.getByText(status.account)).toBeInTheDocument();
    expect(screen.getByText(status.status)).toBeInTheDocument();
    expect(screen.getByText(status.dispatchers.catalog.ApplicationType)).toBeInTheDocument();

    await user.click(screen.getByText('Actions'));
    api.pingConnection = jest.fn();
    await user.click(screen.getByText('Ping'));

    expect(api.pingConnection).toHaveBeenCalledWith(account.data[0]);
    expect(useNotificationStore.getState().notifications).toEqual([
      { id: '0', title: `Ping request for ${account.data[0]} was sent`, variant: 'info' },
    ]);

    expect(screen.getByText(status.account).closest('.pf-c-drawer')).toHaveClass('pf-m-expanded');

    await user.click(screen.getByLabelText('Close drawer panel'));

    expect(screen.getByText(status.account).closest('.pf-c-drawer')).not.toHaveClass('pf-m-expanded');

    api.getListConnection = jest.fn().mockResolvedValue(data);

    await user.click(screen.getAllByLabelText('Reset')[0]);

    expect(api.getListConnection).toHaveBeenCalledWith({ limit: 10, offset: 0 });
    expect(screen.getByLabelText('Find by account number')).toHaveValue('');
  });

  it('renders empty state', async () => {
    api.getListConnection = mockApi();

    resetConnectionStore();

    render(
      <TestWrapper>
        <Accounts />
      </TestWrapper>
    );

    expect(screen.getByText('Accounts')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument());

    expect(api.getListConnection).toHaveBeenCalledWith({ limit: 10, offset: 0 });

    const data = {
      meta: { count: 0 },
      data: [],
    };

    api.getListConnection.resolve(data);

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());
    expect(screen.getByText('No connections found')).toBeInTheDocument();
  });

  it('renders empty state with filter', async () => {
    const user = userEvent.setup();

    updateQuery.default = jest.fn();
    api.getListConnection = mockApi();

    resetConnectionStore();

    render(
      <TestWrapper>
        <Accounts />
      </TestWrapper>
    );

    await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument());

    const data = {
      meta: { count: 0 },
      data: [],
    };

    api.getListConnection.resolve(data);

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    api.getListByAccountConnection = mockApi();

    await user.type(screen.getByLabelText('Find by account number'), '12345');

    await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument(), { timeout: '501' });

    expect(api.getListByAccountConnection).toHaveBeenCalledWith({ account: '12345', limit: 10, offset: 0 });
    expect(updateQuery.default).toHaveBeenLastCalledWith('12345', '');

    api.getListByAccountConnection.resolve(data);

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    expect(screen.getByText('No connections found')).toBeInTheDocument();
    expect(
      screen.getByText('No connections match the filter criteria. Remove all filters or clear all filters to show results.')
    ).toBeInTheDocument();

    await user.click(screen.getByText('Clear all filters'));

    expect(screen.getByText('Select an account to see a list of connections')).toBeInTheDocument();
    expect(screen.getByLabelText('Find by account number')).toHaveValue('');
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    api.getListConnection.resolve(data);

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());
  });

  it('pagination works', async () => {
    const user = userEvent.setup();

    updateQuery.default = jest.fn();
    api.getListConnection = mockApi();

    resetConnectionStore();

    render(
      <TestWrapper>
        <Accounts />
      </TestWrapper>
    );

    await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument());

    const connections = generateConnections(1, 10);

    expect(api.getListConnection).toHaveBeenCalledWith({ limit: 10, offset: 0 });

    const data = {
      meta: { count: 100 },
      data: connections,
    };

    api.getListConnection.resolve(data);

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    await user.click(screen.getAllByLabelText('Go to next page')[0]);

    expect(api.getListConnection).toHaveBeenLastCalledWith({ limit: 10, offset: 10 });

    api.getListConnection.resolve(data);
    api.getListConnection.mockClear();

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    await user.click(screen.getAllByLabelText('Items per page')[0]);
    await user.click(screen.getByText('20 per page'));

    expect(api.getListConnection).toHaveBeenLastCalledWith({ limit: 20, offset: 0 });
  });

  it('search by account on larger screen', async () => {
    // eslint-disable-next-line no-global-assign
    innerWidth = 800;

    const user = userEvent.setup();

    updateQuery.default = jest.fn();

    const connections = generateConnections(1, 10);

    const data = {
      meta: { count: connections.length },
      data: connections,
    };

    api.getListConnection = jest.fn().mockResolvedValue(data);

    resetConnectionStore();
    resetNotificationStore();

    render(
      <TestWrapper>
        <Accounts />
      </TestWrapper>
    );

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    const account = generateAccount();
    api.getListByAccountConnection = jest.fn().mockResolvedValue(account);

    await user.type(screen.getByLabelText('Find by account number'), '12345');

    await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument(), { timeout: '501' });

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    const status = generateStatus();

    api.statusConnection = jest.fn().mockResolvedValue(status);

    const scrollSpy = jest.spyOn(Element.prototype, 'scrollIntoView');

    await user.click(screen.getByText(account.data[0]));

    expect(scrollSpy).toHaveBeenCalled();

    // eslint-disable-next-line no-global-assign
    innerWidth = 0;
    scrollSpy.mockReset();
  });
});
