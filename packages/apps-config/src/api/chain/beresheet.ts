// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

import { spec } from '@edgeware/node-types';

export default {
  ...spec.typesBundle,
  // Substrate overrides
  RefCount: 'u32'
};
