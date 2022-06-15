import getRandomInt from './getRandomInt';

export const generateAccount = () => {
  const connections = [...Array(getRandomInt(1, 100))].map((_, idx) => `node-${idx}-${getRandomInt(1000, 10000)}`);

  return {
    data: connections,
    meta: {
      count: connections.length,
    },
  };
};

export default generateAccount;
