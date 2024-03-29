// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Signer, SignerResult } from '@polkadot/api/types';
import type { Ledger } from '@polkadot/hw-ledger';
import type { Registry, SignerPayloadJSON } from '@polkadot/types/types';
import { getLedger, registry } from '@polkadot/react-api';

let id = 0;

export default class LedgerSigner implements Signer {
  readonly #accountOffset: number;
  readonly #addressOffset: number;
  readonly #getLedger: () => Ledger;
  readonly #registry: Registry;

  constructor (registry: Registry, getLedger: () => Ledger, accountOffset: number, addressOffset: number) {
    this.#accountOffset = accountOffset;
    this.#addressOffset = addressOffset;
    this.#getLedger = getLedger;
    this.#registry = registry;
  }

  public async signPayload (payload: SignerPayloadJSON): Promise<SignerResult> {
    const raw = registry.createType('ExtrinsicPayload', payload, { version: payload.version });
    const { signature } = await getLedger().sign(raw.toU8a(true), this.#accountOffset, this.#addressOffset);

    return { id: ++id, signature };
  }
}
