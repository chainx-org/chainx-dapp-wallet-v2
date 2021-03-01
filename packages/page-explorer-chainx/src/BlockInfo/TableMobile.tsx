import React from 'react';
import { formatNumber } from '@polkadot/util';
import { AddressSmall, Table } from '@polkadot/react-components';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from '@polkadot/app-explorer-chainx/translate';
import { HeaderExtended } from '@polkadot/api-derive';
import type { SignedBlock, BlockNumber } from '@polkadot/types/interfaces';

const TableWrapper = styled(Table)`
  @media only screen and (min-width: 769px) {
    display: none;
  }
`

interface Props{
  getHeader: HeaderExtended | undefined;
  blockNumber: BlockNumber | undefined;
  myError: Error | null | undefined;
  getBlock: SignedBlock | undefined;
  hasParent: boolean;
  parentHash: string | undefined;
}

function TableMobile({getHeader, blockNumber, myError, getBlock, hasParent, parentHash}: Props): React.ReactElement<Props>{
  const { t } = useTranslation();

  return (
    <TableWrapper
      header={
        getHeader
          ? [
            [formatNumber(blockNumber), 'start', 1],
            [myError? null: <AddressSmall value={getHeader.author} />, 'start'],
          ]
          : [['...', 'start', 6]]
      }
      isFixed
    >
      {myError
        ? <tr><td colSpan={6}>{t('Unable to retrieve the specified block details. {{error}}', { replace: { error: myError.message } })}</td></tr>
        : getBlock && !getBlock.isEmpty && getHeader && !getHeader.isEmpty && (
        <>
          <tr>
            <td className='start'>{t('Hash')}</td>
            <td className='hash overflow'>{getHeader.hash.toHex()}</td>
          </tr>
          <tr>
            <td className='start'>{t('Parent')}</td>
            <td className='hash overflow'>{
              hasParent
                ? <Link to={`/chainstate/explorer/query/${parentHash || ''}`}>{parentHash}</Link>
                : parentHash
            }</td>
          </tr>
          <tr>
            <td className='start'>{t('Extrinsics')}</td>
            <td className='hash overflow'>{getHeader.extrinsicsRoot.toHex()}</td>
          </tr>
          <tr>
            <td className='start'>{t('State')}</td>
            <td className='hash overflow'>{getHeader.stateRoot.toHex()}</td>
          </tr>
        </>
      )}
    </TableWrapper>
  )
}

export default TableMobile;
