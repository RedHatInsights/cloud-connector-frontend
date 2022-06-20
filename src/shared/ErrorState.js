import React from 'react';

import { ErrorState as FCErrorState } from '@redhat-cloud-services/frontend-components/ErrorState';

import useEnhancedIntl from './useEnhancedIntl';

const ErrorState = () => {
  const intl = useEnhancedIntl();

  return (
    <FCErrorState
      errorTitle={intl.formatMessage({
        id: 'error.title',
        defaultMessage: 'Something went wrong',
      })}
      errorDescription={intl.formatMessage({
        id: 'error.description',
        defaultMessage: 'There was a problem processing the request. Please try again.',
      })}
    />
  );
};

export default ErrorState;
