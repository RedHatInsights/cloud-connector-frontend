import React from 'react';
import PropTypes from 'prop-types';

import {
  Title,
  DescriptionList,
  Label,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
} from '@patternfly/react-core';

const ConnectionDetails = ({ status, dispatchers }) => {
  return (
    <React.Fragment>
      <div className="pf-u-color-200 pf-u-font-size-xs pf-u-mb-xs">status</div>
      <Label>{status}</Label>
      <div className="pf-u-color-200 pf-u-font-size-xs pf-u-mb-xs pf-u-mt-md">dispatchers</div>
      {Object.keys(dispatchers).map((key) => {
        const value = dispatchers[key];
        const keys = Object.keys(value);

        return (
          <React.Fragment key={key}>
            <Title headingLevel="h3" size="md" className="pf-u-mt-md pf-u-mb-sm">
              {key}
            </Title>
            <DescriptionList
              columnModifier={{
                default: '2Col',
              }}
            >
              {!keys.length && <div className="pf-u-color-200">Not available</div>}
              {keys.map((key) => (
                <DescriptionListGroup key={key}>
                  <DescriptionListTerm>{key}</DescriptionListTerm>
                  <DescriptionListDescription>{value[key]}</DescriptionListDescription>
                </DescriptionListGroup>
              ))}
            </DescriptionList>
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};

ConnectionDetails.propTypes = {
  status: PropTypes.oneOf(['connected', 'disconnected']),
  dispatchers: PropTypes.object,
};

export default ConnectionDetails;
