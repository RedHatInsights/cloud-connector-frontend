import React from 'react';
import { List, ListItem } from '@patternfly/react-core';

const arrayFormatter = (value) => (
  <List isPlain>
    {value.map((item) => (
      <ListItem key={item}>{item}</ListItem>
    ))}
  </List>
);

const overviewFormatters = (value, key) =>
  ({
    account: () => value,
    connections: () => arrayFormatter(value),
  }[key] || value);

export default overviewFormatters;
