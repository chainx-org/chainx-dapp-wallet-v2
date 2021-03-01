// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EventRecord, SignedBlock } from '@polkadot/types/interfaces';
import type { KeyedEvent } from '@polkadot/react-query/types';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeaderExtended } from '@polkadot/api-derive';
import { AddressSmall, Columar, Column, LinkExternal, Table } from '@polkadot/react-components';
import { useApi, useIsMountedRef } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Events from '../Events';
import Extrinsics from './Extrinsics';
import Logs from './Logs';
import styled from 'styled-components';
import TableMobile from '@polkadot/app-explorer-chainx/BlockInfo/TableMobile';

const TablePc = styled(Table)`
  @media only screen and (max-width: 768px) {
    display: none;
  }
`

interface Props {
  className?: string;
  error?: Error | null;
  value?: string | null;
}

function transformResult ([events, getBlock, getHeader]: [EventRecord[], SignedBlock, HeaderExtended?]): [KeyedEvent[], SignedBlock, HeaderExtended?] {
  return [
    events.map((record, index) => ({
      indexes: [index],
      key: `${Date.now()}-${index}-${record.hash.toHex()}`,
      record
    })),
    getBlock,
    getHeader
  ];
}

function BlockByHash ({ className = '', error, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [[events, getBlock, getHeader], setState] = useState<[KeyedEvent[]?, SignedBlock?, HeaderExtended?]>([]);
  const [myError, setError] = useState<Error | null | undefined>(error);

  useEffect((): void => {
    value && Promise
      .all([
        api.query.system.events.at(value),
        api.rpc.chain.getBlock(value),
        api.derive.chain.getHeader(value)
      ])
      .then((result): void => {
        mountedRef.current && setState(transformResult(result));
      })
      .catch((error: Error): void => {
        mountedRef.current && setError(error);
      });
  }, [api, mountedRef, value]);

  const blockNumber = getHeader?.number.unwrap();
  const parentHash = getHeader?.parentHash.toHex();
  const hasParent = !getHeader?.parentHash.isEmpty;

  return (
    <div className={className}>
      <TablePc
        header={
          getHeader
            ? [
              [formatNumber(blockNumber), 'start', 1],
              [t('Hash'), 'start'],
              [t('Parent'), 'start'],
              [t('Extrinsics'), 'start'],
              [t('State'), 'start'],
              []
            ]
            : [['...', 'start', 6]]
        }
        isFixed
      >
        {myError
          ? <tr><td colSpan={6}>{t('Unable to retrieve the specified block details. {{error}}', { replace: { error: myError.message } })}</td></tr>
          : getBlock && !getBlock.isEmpty && getHeader && !getHeader.isEmpty && (
            <tr>
              <td className='address'>
                {getHeader.author && (
                  <AddressSmall value={getHeader.author} />
                )}
              </td>
              <td className='hash overflow'>{getHeader.hash.toHex()}</td>
              <td className='hash overflow'>{
                hasParent
                  ? <Link to={`/chainstate/explorer/query/${parentHash || ''}`}>{parentHash}</Link>
                  : parentHash
              }</td>
              <td className='hash overflow'>{getHeader.extrinsicsRoot.toHex()}</td>
              <td className='hash overflow'>{getHeader.stateRoot.toHex()}</td>
              <td>
                <LinkExternal
                  data={value}
                  type='block'
                />
              </td>
            </tr>
          )
        }
      </TablePc>

      <TableMobile
        getHeader = {getHeader}
        blockNumber = {blockNumber}
        myError = {myError}
        getBlock = {getBlock}
        hasParent = {hasParent}
        parentHash = {parentHash}
      />

      {getBlock && getHeader && (
        <>
          <Extrinsics
            blockNumber={blockNumber}
            events={events}
            value={getBlock.block.extrinsics}
          />
          <Columar>
            <Column>
              <Events
                eventClassName='explorer--BlockByHash-block'
                events={events?.filter(({ record: { phase } }) => !phase.isApplyExtrinsic)}
                label={t<string>('System Events')}
              />
            </Column>
            <Column>
              <Logs value={getHeader.digest.logs} />
            </Column>
          </Columar>
        </>
      )}
    </div>
  );
}

export default React.memo(BlockByHash);
