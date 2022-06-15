import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
    resetConnectionStore();

    render(<App />);

    expect(screen.getByText('Cloud Connector')).toBeInTheDocument();
    expect(screen.getByText('Accounts')).toBeInTheDocument();
    expect(screen.getByText('Connections')).toBeInTheDocument();

    await waitFor(() => expect(() => screen.getByRole('progressbar')).toThrow());

    expect(screen.getByText('Accounts page')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Connections'));

    expect(screen.getByText('Connections page')).toBeInTheDocument();
  });
});
