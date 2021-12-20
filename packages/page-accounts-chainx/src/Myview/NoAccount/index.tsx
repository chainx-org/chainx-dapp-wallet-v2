
import React from 'react';
import styled from 'styled-components';
import noneLogo from '../Records/Empty/none.svg';
import shap from '../Records/Empty/shap.svg';
import { Button } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/app-accounts-chainx/translate';
import {useApi, useIpfs, useToggle} from '@polkadot/react-hooks';
import CreateModal from '@polkadot/app-accounts-chainx/modals/Create';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import ImportModal from '@polkadot/app-accounts-chainx/modals/Import';
import {AccountLoading} from '@polkadot/react-components-chainx';
const Wrapper = styled.div`
  margin: 0 !important;
  > .noAccount{
    background: rgba(255, 255, 255);
    margin: auto;
    margin-bottom: 16px;
    width:97.5% !important;
    height: 97.5% !important;
    > img{
      margin: 160px 0 20px 50%;
      transform: translateX(-50%);
      width: 72px;
      height: 72px;
    }
    > p{
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      opacity: 0.24;
      margin-bottom: 40px
    }
  }
`;
const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 300px;
  > button {
    margin: 0 8px;
  }
`;

type Props = {
  onStatusChange: (status: ActionStatus) => void;
}

export default function ({ onStatusChange }: Props): React.ReactElement<Props> {
  const {isApiReady} = useApi()
  const { t } = useTranslation();
  const [isCreateOpen, toggleCreate] = useToggle();
  const [isImportOpen, toggleImport] = useToggle();
  const { isIpfs } = useIpfs();

  return (
    <Wrapper>
      <div className='noAccount'>
        <img alt=''
          src={shap} />
        <p>{t('You don\'t have an account yet. A lot of features are hidden for you, hurry up and add an account to try.')}</p>
        <ButtonGroup>
          <Button
            icon='plus'
            isDisabled={isIpfs || !isApiReady}
            label={t<string>('Add account')}
            onClick={toggleCreate}
          />
          <Button
            icon='sync'
            isDisabled={isIpfs || !isApiReady}
            label={t<string>('Restore JSON')}
            onClick={toggleImport}
          />
        </ButtonGroup>

        {isCreateOpen && (
          <CreateModal
            onClose={toggleCreate}
            onStatusChange={onStatusChange}
          />
        )}
        {isImportOpen && (
          <ImportModal
            onClose={toggleImport}
            onStatusChange={onStatusChange}
          />
        )}
      </div>

      {!isApiReady && <AccountLoading />}
    </Wrapper>
  );
}
