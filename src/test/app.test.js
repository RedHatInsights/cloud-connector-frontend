import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import api from '../api';

import App from '../App';

import { resetConnectionStore } from '../store/connectionsStore';

jest.mock('../pages/Accounts', () => ({
  __esModule: true,
  default: () => {
    return <div>Accounts page</div>;
  },
}));

jest.mock('../pages/Connections', () => ({
  __esModule: true,
  default: () => {
    return <div>Connections page</div>;
  },
}));

describe('<App />', () => {
  it('renders correctly', async () => {
    api.getListConnection = jest.fn();

    resetConnectionStore();

    render(<App />);

    expect(screen.getByText('Cloud Connector')).toBeInTheDocument();
    expect(screen.getByText('Accounts')).toBeInTheDocument();
    expect(screen.getByText('Connections')).toBeInTheDocument();

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    expect(screen.getByText('Accounts page')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/cloud-connect/accounts');

    await userEvent.click(screen.getByText('Connections'));

    expect(api.getListConnection).toHaveBeenCalled();

    expect(screen.getByText('Connections page')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/cloud-connect/connections');

    await userEvent.click(screen.getByText('Accounts'));

    expect(screen.getByText('Accounts page')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/cloud-connect/accounts');
  });

  it('open and close nav', async () => {
    api.getListConnection = jest.fn();

    resetConnectionStore();

    render(<App />);

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    expect(screen.getByText('Accounts').closest('#page-sidebar')).toHaveAttribute('aria-hidden', 'false');

    await userEvent.click(screen.getByLabelText('Global navigation'));

    expect(screen.getByText('Accounts').closest('#page-sidebar')).toHaveAttribute('aria-hidden', 'true');

    await userEvent.click(screen.getByLabelText('Global navigation'));

    expect(screen.getByText('Accounts').closest('#page-sidebar')).toHaveAttribute('aria-hidden', 'false');
  });

  it('goes back via logo', async () => {
    api.getListConnection = jest.fn();

    resetConnectionStore();

    render(<App />);

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    await userEvent.click(screen.getByText('Connections'));

    expect(window.location.pathname).toBe('/cloud-connect/connections');

    await userEvent.click(screen.getByAltText('Red Hat logo'));

    expect(window.location.pathname).toBe('/cloud-connect/accounts');
  });
});
