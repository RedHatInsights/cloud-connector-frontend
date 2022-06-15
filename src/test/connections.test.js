import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import api from '../api';
import Connections from '../pages/Connections';
import * as updateQuery from '../shared/updateQuery';

import { resetConnectionStore } from '../store/connectionsStore';
import TestWrapper from './TestWrapper';
import generateStatus from './__mocks__/status';

describe('<Connections />', () => {
  it('renders', async () => {
    resetConnectionStore();

    render(
      <TestWrapper>
        <Connections />
      </TestWrapper>
    );

    expect(screen.getByText('Connections')).toBeInTheDocument();
    expect(screen.getByText('Find by client id to see the connection')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Find by client id')).toBeInTheDocument();
  });

  it('renders error', async () => {
    resetConnectionStore({ error: 'Some API failed' });

    render(
      <TestWrapper>
        <Connections />
      </TestWrapper>
    );

    expect(screen.getByText('Connections')).toBeInTheDocument();

    expect(() => screen.getByText('Find by client id to see the connection')).toThrow();
    expect(() => screen.getByPlaceholderText('Find by client id')).toThrow();

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('There was a problem processing the request. Please try again.')).toBeInTheDocument();
  });

  it('renders with an URL parameter', async () => {
    api.statusConnection = mockApi();

    let tmpLocation;

    tmpLocation = Object.assign({}, window.location);

    delete window.location;

    window.location = {};

    window.location.pathname = 'connections';
    window.location.search = '?client_id=123';

    resetConnectionStore();

    render(
      <TestWrapper>
        <Connections />
      </TestWrapper>
    );

    expect(screen.getByText('Connections')).toBeInTheDocument();
    expect(() => screen.getByText('Find by client id to see the connection')).toThrow();
    expect(screen.getByPlaceholderText('Find by client id')).toHaveValue('123');
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    const status = generateStatus();

    api.statusConnection.resolve(status);

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    expect(screen.getByText(status.account)).toBeInTheDocument();
    expect(screen.getByText(status.status)).toBeInTheDocument();
    expect(screen.getByText(status.dispatchers.catalog.ApplicationType)).toBeInTheDocument();

    window.location = tmpLocation;
  });

  it('finds a connection', async () => {
    api.statusConnection = mockApi();
    updateQuery.default = jest.fn();

    const user = userEvent.setup();

    resetConnectionStore();

    render(
      <TestWrapper>
        <Connections />
      </TestWrapper>
    );

    await user.type(screen.getByPlaceholderText('Find by client id'), '123');

    await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument(), { timeout: '501' });

    const status = generateStatus();

    api.statusConnection.resolve(status);

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    expect(screen.getByText(status.account)).toBeInTheDocument();
    expect(screen.getByText(status.status)).toBeInTheDocument();
    expect(screen.getByText(status.dispatchers.catalog.ApplicationType)).toBeInTheDocument();

    expect(updateQuery.default).toHaveBeenLastCalledWith('', '123');
  });

  it('clears a connection', async () => {
    api.statusConnection = mockApi();
    updateQuery.default = jest.fn();

    const user = userEvent.setup();

    resetConnectionStore();

    render(
      <TestWrapper>
        <Connections />
      </TestWrapper>
    );

    await user.type(screen.getByPlaceholderText('Find by client id'), '123');

    await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument(), { timeout: '501' });

    const status = generateStatus();

    api.statusConnection.resolve(status);

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    await user.click(screen.getByLabelText('Reset'));

    expect(updateQuery.default).toHaveBeenLastCalledWith('', '');

    expect(screen.getByText('Find by client id to see the connection')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Find by client id')).toHaveValue('');
  });

  describe('connection dropdown', () => {
    it('toogles', async () => {
      api.statusConnection = mockApi();

      const user = userEvent.setup();

      resetConnectionStore();

      render(
        <TestWrapper>
          <Connections />
        </TestWrapper>
      );

      await user.type(screen.getByPlaceholderText('Find by client id'), '123');

      await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument(), { timeout: '501' });

      const status = generateStatus();

      api.statusConnection.resolve(status);

      await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

      await user.click(screen.getByText('Actions'));

      expect(screen.getByText('Ping')).toBeInTheDocument();

      await user.click(screen.getByText('Actions'));

      expect(() => screen.getByText('Ping')).toThrow();
    });

    it('pings', async () => {
      api.statusConnection = mockApi();

      const user = userEvent.setup();

      resetConnectionStore();

      render(
        <TestWrapper>
          <Connections />
        </TestWrapper>
      );

      await user.type(screen.getByPlaceholderText('Find by client id'), '123');

      await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument(), { timeout: '501' });

      const status = generateStatus();

      api.statusConnection.resolve(status);

      await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

      await user.click(screen.getByText('Actions'));

      api.pingConnection = jest.fn();

      await user.click(screen.getByText('Ping'));

      expect(api.pingConnection).toHaveBeenCalledWith('123');
    });

    it('reconnects', async () => {
      api.statusConnection = mockApi();

      const user = userEvent.setup();

      resetConnectionStore();

      render(
        <TestWrapper>
          <Connections />
        </TestWrapper>
      );

      await user.type(screen.getByPlaceholderText('Find by client id'), '123');

      await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument(), { timeout: '501' });

      const status = generateStatus();

      api.statusConnection.resolve(status);

      await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

      await user.click(screen.getByText('Actions'));

      api.reconnectConnection = jest.fn();

      await user.click(screen.getByText('Reconnect'));

      expect(api.reconnectConnection).toHaveBeenCalledWith('123');
    });

    it('disconnects', async () => {
      api.statusConnection = mockApi();

      const user = userEvent.setup();

      resetConnectionStore();

      render(
        <TestWrapper>
          <Connections />
        </TestWrapper>
      );

      await user.type(screen.getByPlaceholderText('Find by client id'), '123');

      await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument(), { timeout: '501' });

      const status = generateStatus();

      api.statusConnection.resolve(status);

      await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

      await user.click(screen.getByText('Actions'));

      api.disconnectConnection = jest.fn();

      await user.click(screen.getByText('Disconnect'));

      expect(api.disconnectConnection).toHaveBeenCalledWith('123');
    });

    it('resets state', async () => {
      api.statusConnection = mockApi();

      const user = userEvent.setup();

      resetConnectionStore();

      render(
        <TestWrapper>
          <Connections />
        </TestWrapper>
      );

      await user.type(screen.getByPlaceholderText('Find by client id'), '123');

      await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument(), { timeout: '501' });

      const status = generateStatus();

      api.statusConnection.resolve(status);

      await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

      await user.click(screen.getByText('Actions'));

      api.resetStateConnection = jest.fn();

      await user.click(screen.getByText('Reset state'));

      expect(api.resetStateConnection).toHaveBeenCalledWith('123');
    });
  });
});
