import getRandomInt from './getRandomInt';

export const generateStatus = () => ({
  status: ['connected', 'disconnected'][getRandomInt(1, 2)],
  dispatchers: {
    catalog: {
      ApplicationType: '/insights/platform/catalog',
      SourceRef: 'df2bac3e-c7b4-4a8b-8226-b943b9a12eaf',
      SrcName: 'dehort Testing Bulk Create',
      SrcType: 'ansible-tower',
      WorkerBuild: '2021-02-19 10:18:24',
      WorkerSHA: '48d28791e3b59f7334d2671c07978113b0d40374',
      WorkerVersion: 'v0.1.0',
    },
    echo: {},
    'rhc-worker-playbook': {
      'ansible-runner-version': '1.2.3',
    },
  },
});

export default generateStatus;
