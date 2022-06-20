import React from 'react';
import { useIntl } from 'react-intl';

let boldId = 0;

export const bold = (chunks) => <b key={`b-${chunks.length}-${boldId++}}`}>{chunks}</b>;

const useEnhancedIntl = () => {
  const intl = useIntl();

  const formatMessage = intl.formatMessage.bind({});

  intl.formatMessage = (descriptor, values, options) => formatMessage(descriptor, { b: bold, ...values }, options);

  return intl;
};

export default useEnhancedIntl;
