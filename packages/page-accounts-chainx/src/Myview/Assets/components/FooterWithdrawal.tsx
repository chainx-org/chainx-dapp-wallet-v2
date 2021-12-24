import {Button, InputAddress, Modal, TxButton} from '@polkadot/react-components';
import React, {Dispatch, useContext, useEffect, useState} from 'react';
import {useAccounts, useToggle} from '@polkadot/react-hooks';
import {useAccountAssets} from '@polkadot/react-hooks-chainx';
import {useTranslation} from '@polkadot/app-accounts/translate';
import {KeyringSectionOption} from '@polkadot/ui-keyring/options/types';
import {AccountContext} from '@polkadot/react-components-chainx/AccountProvider';
// import LabelHelp from '@polkadot/react-components/LabelHelp';
import {toPrecision} from '@polkadot/app-accounts-chainx/Myview/toPrecision';
import styled from 'styled-components';

interface FooterProps {
  allInterests: number | undefined,
  usableInterests: number | undefined,
  insufficientStake: number | undefined,
  setN: Dispatch<number>
}

// const ActionsButton = styled(Modal.Actions)`
//   display: flex;
//   > button{
//     width: 105px;
//   }
// `;

const Tip = styled.div`
  color: red;
`

export default function ({allInterests, usableInterests, insufficientStake, setN}: FooterProps): React.ReactElement<FooterProps> {
  const {t} = useTranslation();
  const {hasAccounts, allAccounts} = useAccounts()
  const options: KeyringSectionOption[] = [];
  const [isWithDrawButton, toggleWithDrawButton] = useToggle();
  const {allAssets} = useAccountAssets(allAccounts);
  const canwithDrawAccounts: string[] = [];
  const {currentAccount} = useContext(AccountContext);
  const [withdrawalDisabled, setWithdrawalDisabled] = useState<boolean>();
  const [buttonDisabled, setButtonDisabled] = useState<boolean>();

  allAssets.map((item) => {
    if (Number(item.XbtcInterests) > 0) {
      canwithDrawAccounts.push(item.account);
    }
  });
  canwithDrawAccounts.map((account) => {
    options.push(
      {
        key: account,
        name: account,
        value: account
      }
    );
  });

  useEffect(() => {
    const hasCurrentName = allAccounts.find(account => account === currentAccount)
    hasAccounts && hasCurrentName? setButtonDisabled(false): setButtonDisabled(true)
  }, [hasAccounts, currentAccount, allAccounts])

  useEffect(() => {
    insufficientStake === 0 ? setWithdrawalDisabled(false) : setWithdrawalDisabled(true);
  }, [allInterests, usableInterests, insufficientStake]);

  return (
    <div>
      <Button
        icon='plus'
        label={t<string>('Withdraw Interest')}
        onClick={toggleWithDrawButton}
        isDisabled={buttonDisabled}
      />
      {isWithDrawButton && (
        <Modal
          header={t('Withdrawal application of interest')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  defaultValue={currentAccount}
                  help={t<string>('Select the account you wish to submit the tip from.')}
                  label={t('Claim Interests')}
                  isDisabled
                  // onChange={setAccount}
                  labelExtra={
                    <span>
                      {t('Total Interests')}： {allInterests ? allInterests.toFixed(8) : toPrecision(0,18)} KSX
                      {/*<LabelHelp help={'111111'}/>*/}
                    </span>
                  }
                  type='account'
                  withLabel
                />
              </Modal.Column>
              <Modal.Column>
                <span>
                  {t('Available Interest')} : {usableInterests ? usableInterests.toFixed(8) : toPrecision(0,18)} KSX
                </span>
                {insufficientStake ? <Tip>{t('you need to mortgage')} : {insufficientStake.toFixed(8)} KSX</Tip>: ''}
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleWithDrawButton}>
            <TxButton
              accountId={currentAccount}
              icon='plus'
              label={t('Withdraw')}
              params={[1]}
              isDisabled={withdrawalDisabled}
              tx='xMiningAsset.claim'
              onSuccess={() => {
                setN(Math.random());
                toggleWithDrawButton()
              }}
            />
          </Modal.Actions>
        </Modal>)
      }
    </div>
  );
}
