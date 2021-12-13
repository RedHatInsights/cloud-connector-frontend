export const createQuery = (account, client) => {
  let query = [];

  if (account) {
    query.push(`account_number=${account}`);
  }

  if (client) {
    query.push(`client_id=${client}`);
  }

  if (query.length > 0) {
    return `?${query.join('&')}`;
  }

  return '';
};

const updateQuery = (account, client) => {
  const fullHref = decodeURIComponent(`${window.location.pathname}${createQuery(account, client)}`);
  if (location.href !== fullHref) {
    return history.replaceState('', '', fullHref);
  }
};

export default updateQuery;
