// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import { spec } from '@edgeware/node-types';

const edgeware = spec.typesBundle.spec?.edgeware as OverrideBundleDefinition;

export default edgeware;
