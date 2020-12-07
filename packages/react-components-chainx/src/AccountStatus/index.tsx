// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import styled from 'styled-components';
import { AddressRow, Button } from '@polkadot/react-components';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import AccountList from './AccountList';
import { useTranslation } from '../translate';

interface Props {
  onStatusChange?: (status: ActionStatus) => void;
  setStoredValue: string | React.Dispatch<any> | ((value: string) => void) | undefined;
  storedValue: string | undefined | ((value: string) => void);
  className?: string
}


function AccountStatus ({ storedValue, onStatusChange, setStoredValue, className}: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isAccountListOpen, setIsAccountListOpen] = useState(false);

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
        <div className='ui--AccountStatus-Box'>
          <AddressRow
            className='ui--AccountStatus-Address'
            isEditable={true}
            value={storedValue}
          >
          </AddressRow>
          <Button
            className='ui--AccountStatus-ChangeAccount'
            isBasic={true}
            label={t('Change account')}
            onClick={_toggleAccountList}
          />
        </div>
      </StyledWrapper>

    </div>
  );
}

const StyledWrapper = styled.div`
  background: rgb(63, 63, 63);
  padding: 4px 0 0 2rem;
  min-height: 61px;
  margin: 0 -2rem;
  display: flex !important;
  align-items: center;
  .ui--AccountStatus-Convert {
    margin-right: 10px;
  }

  .ui--AccountStatus-ChangeAccount {
    margin-right: 30px;
  }

  @media (max-width: 767px) {
    min-height: 44px;
    display: flex;
    padding: 0 0.5rem;
    margin: 0 0;
    .ui--AccountStatus-Address{
      display: none;
    }
  }

  .ui--AccountStatus-Box{
    display: flex;
    justify-content: space-between;
    align-items: center;
    > .ui--Row {
      display: flex;
      align-items: center;
      .ui--Row-icon{
        display: flex;
        align-items: center;
        svg{
          width: 46px;
          height: 46px;
        }
      }
    }
    > button{
      color: black;
    }
  }

  .ui--AccountStatus-Network{
    color: #8231D8;
    font-size: 18px;
    font-weight: bold;
    flex: 1;
    span{
      margin-right: .5rem;
    }
  }
  .accounts--Account-buttons{
    padding: 40px;
  }
  .switchBtn{
    margin-left: 16px;
    cursor: pointer;
  }
`;

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
