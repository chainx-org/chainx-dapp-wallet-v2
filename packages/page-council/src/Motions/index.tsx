// Copyright 2017-2020 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { AccountId } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';
import { Button, Table } from '@polkadot/react-components';
import { useMembers } from '@polkadot/react-hooks';
import styled from 'styled-components';
import { useTranslation } from '../translate';
import Motion from './Motion';
import ProposeMotion from './ProposeMotion';
import ProposeExternal from './ProposeExternal';
import Slashing from './Slashing';

const Wrapper = styled.div`
  .motionscroll {
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

interface Props {
  className?: string;
  motions?: DeriveCollectiveProposal[];
  prime: AccountId | null;
}

function Proposals ({ className = '', motions, prime }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { isMember, members } = useMembers();

  const headerRef = useRef([
    [t('Motions'), 'start', 2],
    [t('Threshold')],
    [t('Voting End')],
    [t('Votes'), 'expand'],
    [],
    [undefined, 'badge'],
    []
  ]);

  return (
    <Wrapper className={className}>
      <Button.Group>
        <ProposeMotion
          isMember={isMember}
          members={members}
        />
        <ProposeExternal
          isMember={isMember}
          members={members}
        />
        <Slashing
          isMember={isMember}
          members={members}
        />
      </Button.Group>
      <Table className="motionscroll"
        empty={motions && t<string>('No council motions')}
        header={headerRef.current}
      >
        {motions?.map((motion: DeriveCollectiveProposal): React.ReactNode => (
          <Motion
            isMember={isMember}
            key={motion.hash.toHex()}
            members={members}
            motion={motion}
            prime={prime}
          />
        ))}
      </Table>
    </Wrapper>
  );
}

export default React.memo(Proposals);
