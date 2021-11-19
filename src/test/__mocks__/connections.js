import getRandomInt from './getRandomInt';

export const generateConnection = (account) => ({
  account: account || getRandomInt(100000, 999999),
  connections: ['node-a', 'node-b', 'node-c', 'node-d'].splice(getRandomInt(0, 4)),
  connections_count: getRandomInt(0, 999),
});

const generateConnections = (min = 0, max = 10) => [...Array(getRandomInt(min, max))].map(() => generateConnection());

export default generateConnections;
