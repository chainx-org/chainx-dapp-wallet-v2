  // Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import styled from 'styled-components';
import { AddressRow } from '@polkadot/react-components';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import AccountList from './AccountList';
import Button from '@polkadot/react-components-chainx/Button';
import {StyledWrapper} from './StyledWrapper';

interface Props {
  onStatusChange?: (status: ActionStatus) => void;
  setStoredValue: string | React.Dispatch<any> | ((value: string) => void) | undefined;
  storedValue: string | undefined | ((value: string) => void);
  className?: string
}


function AccountStatus ({ storedValue, onStatusChange, setStoredValue, className}: Props): React.ReactElement<Props> {
  const [isAccountListOpen, setIsAccountListOpen] = useState<boolean>(false);

  const _toggleAccountList = (): void => setIsAccountListOpen(!isAccountListOpen);

  return (
    <div className={className}>

      {isAccountListOpen && (
        <AccountList
          storedValue={storedValue}
          onClose={_toggleAccountList}
          onStatusChange={onStatusChange}
          setStoredValue={setStoredValue}
        />
      )}

      <StyledWrapper>
        <div className='ui--AccountStatus-Box' >
          <AddressRow
            className='ui--AccountStatus-Address'
            isEditable={true}
            value={storedValue}
          >
          </AddressRow>
          <div className="usermarks" onClick={_toggleAccountList} ></div>
          <Button
            className='ui--AccountStatus-ChangeAccount'
            isBasic={true}
            icon='angle-down'
            onClick={_toggleAccountList}
          />
        </div>
      </StyledWrapper>

    </div>
  );
}

export default styled(AccountStatus)`
  .filter--tags {

    .ui--Dropdown {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }

  .noAccount{
      margin: 200px auto 0 auto;
      width: 630px;
      text-align: center;
      border: 1px solid #EDEDED;
      padding: 80px 100px;
      color: #302b3c;
      background: #fff;

      img{
        margin-bottom: 30px;
      }

      .h1{
        font-size: 20px;
        font-weight: bold;
      }

      p{
        font-size: 14px;
        margin-bottom: 40px;
      }

      button+button{
        margin-left: 30px;
      }
    }

    @media (max-width: 767px) {
      .noAccount{
        width: auto;
        padding: 40px 0;
      }
    }
`;
