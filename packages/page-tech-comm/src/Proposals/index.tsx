// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hash } from '@polkadot/types/interfaces';
import type { ComponentProps as Props } from '../types';

import React, { useRef } from 'react';
import { Button, Table } from '@polkadot/react-components';
import styled from 'styled-components';
import { useTranslation } from '../translate';
import Proposal from './Proposal';
import Propose from './Propose';

function Proposals ({ className = '', isMember, members, prime, proposals }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('Proposals'), 'start', 2],
    [t('Threshold')],
    [t('Voting End')],
    [t('aye'), 'address'],
    [t('nay'), 'address'],
    []
  ]);

  return (
    <div className={className}>
      <Button.Group>
        <Propose
          isMember={isMember}
          members={members}
        />
      </Button.Group>
      <Table className="proposalscroll"
        empty={proposals && t<string>('No committee proposals')}
        header={headerRef.current}
      >
        {proposals?.map((hash: Hash): React.ReactNode => (
          <Proposal
            imageHash={hash}
            isMember={isMember}
            key={hash.toHex()}
            members={members}
            prime={prime}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(styled(Proposals)`
  .proposalscroll {
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`);