import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {ChainLock, Forget, Icon, Menu, Popup, StatusContext} from '@polkadot/react-components';
import {createMenuGroup} from '@polkadot/app-accounts-chainx/util';
import {useTranslation} from '@polkadot/app-accounts-chainx/translate';
import {useAccountInfo, useAccounts, useApi, useCall, useToggle} from '@polkadot/react-hooks';
import {ThemeDef} from '@polkadot/react-components/types';
import {ThemeContext} from 'styled-components';
import {SubmittableExtrinsic} from '@polkadot/api/types';
import {ProxyDefinition, RecoveryConfig} from '@polkadot/types/interfaces';
import useMultisigApprovals from '@polkadot/app-accounts-chainx/Accounts/useMultisigApprovals';
import useXbtcAssets from '@polkadot/app-accounts-chainx/Myview/useXbtcAssets';
import {useLocalStorage} from '@polkadot/react-hooks-chainx';
import {AccountContext} from '@polkadot/react-components-chainx/AccountProvider';
import {Option} from '@polkadot/types';
import {getLedger} from '@polkadot/react-api';
import {ActionStatus} from '@polkadot/react-components/Status/types';
import keyring from '@polkadot/ui-keyring';
import Backup from '@polkadot/app-accounts-chainx/modals/Backup';
import DelegateModal from '@polkadot/app-accounts-chainx/modals/Delegate';
import Derive from '@polkadot/app-accounts-chainx/modals/Derive';
import Withdraw from '@polkadot/app-accounts-chainx/modals/withdraw';
import XbtcTransfer from '@polkadot/app-accounts-chainx/modals/XBTCTransfer';
import IdentityMain from '@polkadot/app-accounts-chainx/modals/IdentityMain';
import IdentitySub from '@polkadot/app-accounts-chainx/modals/IdentitySub';
import ChangePass from '@polkadot/app-accounts-chainx/modals/ChangePass';
import Deposite from '@polkadot/app-accounts-chainx/modals/deposite/deposite';
import ProxyOverview from '@polkadot/app-accounts-chainx/modals/ProxyOverview';
import MultisigApprove from '@polkadot/app-accounts-chainx/modals/MultisigApprove';
import RecoverAccount from '@polkadot/app-accounts-chainx/modals/RecoverAccount';
import RecoverSetup from '@polkadot/app-accounts-chainx/modals/RecoverSetup';
import UndelegateModal from '@polkadot/app-accounts-chainx/modals/Undelegate';
import BN from 'bn.js';
import {KeyringAddress} from '@polkadot/ui-keyring/types';
import {Delegation} from '@polkadot/app-accounts-chainx/types';
import Multisig from '@polkadot/app-accounts-chainx/modals/MultisigCreate';
import {DeriveDemocracyLock} from '@polkadot/api-derive/types';
import {ApiPromise} from '@polkadot/api';

interface DemocracyUnlockable {
  democracyUnlockTx: SubmittableExtrinsic<'promise'> | null;
  ids: BN[];
}

interface Props {
  account: KeyringAddress;
  propsIsValid?: boolean;
  isContract?: boolean;
  delegation?: Delegation;
  proxy?: [ProxyDefinition[], BN];
}

function createClearDemocracyTx(api: ApiPromise, address: string, unlockableIds: BN[]): SubmittableExtrinsic<'promise'> {
  return api.tx.utility.batch(
    unlockableIds
      .map((id) => api.tx.democracy.removeVote(id))
      .concat(api.tx.democracy.unlock(address))
  );
}

const transformRecovery = {
  transform: (opt: Option<RecoveryConfig>) => opt.unwrapOr(null)
};

function AccountActions({account: {address, meta}, isContract, delegation, proxy}: Props): React.ReactElement<Props> {
  const {t} = useTranslation();
  const api = useApi();
  const {flags: {isDevelopment, isExternal, isHardware, isInjected, isMultisig}, identity, genesisHash, name: accName, onSetGenesisHash, tags} = useAccountInfo(address ? address.toString() : null, isContract);
  const {theme} = useContext<ThemeDef>(ThemeContext);
  const [isSettingsOpen, toggleSettings] = useToggle();
  const [isDepositeOpen, toggleDeposite] = useToggle();
  const [isWithdraw, toggleWithdraw] = useToggle();
  const [isXbtcTransfer, toggleXbtcTransfer] = useToggle();
  const [isIdentityMainOpen, toggleIdentityMain] = useToggle();
  const [isIdentitySubOpen, toggleIdentitySub] = useToggle();
  const [{democracyUnlockTx}, setUnlockableIds] = useState<DemocracyUnlockable>({democracyUnlockTx: null, ids: []});
  const [vestingVestTx, setVestingTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const {queueExtrinsic} = useContext(StatusContext);
  const [isDeriveOpen, toggleDerive] = useToggle();
  const [isPasswordOpen, togglePassword] = useToggle();
  const [isBackupOpen, toggleBackup] = useToggle();
  const [isForgetOpen, toggleForget] = useToggle();
  const [isRecoverSetupOpen, toggleRecoverSetup] = useToggle();
  const [isRecoverAccountOpen, toggleRecoverAccount] = useToggle();
  const [isMultisigOpen, toggleMultisig] = useToggle();
  const [isDelegateOpen, toggleDelegate] = useToggle();
  const [isUndelegateOpen, toggleUndelegate] = useToggle();
  const [isProxyOverviewOpen, toggleProxyOverview] = useToggle();
  const [isAddMultisigOpen, toggleAddMultisig] = useToggle();
  const bestNumber = useCall<BN>(api.api.derive.chain.bestNumber);
  const democracyLocks = useCall<DeriveDemocracyLock[]>(api.api.derive.democracy?.locks, [address]);
  const recoveryInfo = useCall<RecoveryConfig | null>(api.api.query.recovery?.recoverable, [address], transformRecovery);
  const multiInfos = useMultisigApprovals(address);
  const [n, setN] = useState<number>(0);
  const assetInfo = useXbtcAssets(address, n);
  const [, setValue] = useLocalStorage('currentAccount');
  const {changeAccount} = useContext(AccountContext);
  const {allAccounts, hasAccounts} = useAccounts();
  const {currentAccount} = useContext(AccountContext);
  const {queueAction} = useContext(StatusContext);


  const _clearDemocracyLocks = useCallback(
    () => democracyUnlockTx && queueExtrinsic({
      accountId: address,
      extrinsic: democracyUnlockTx
    }),
    [address, democracyUnlockTx, queueExtrinsic]
  );

  const _vestingVest = useCallback(
    () => vestingVestTx && queueExtrinsic({
      accountId: address,
      extrinsic: vestingVestTx
    }),
    [address, queueExtrinsic, vestingVestTx]
  );

  const _showOnHardware = useCallback(
// TODO: we should check the hardwareType from metadata here as well,
// for now we are always assuming hardwareType === 'ledger'
    (): void => {
      getLedger()
        .getAddress(true, meta.accountOffset as number || 0, meta.addressOffset as number || 0)
        .catch((error): void => {
          console.error(`ledger: ${(error as Error).message}`);
        });
    },
    [meta]
  );

  const _onForget = function () {
    if (!address) {
      return;
    }

    const status: Partial<ActionStatus> = {
      account: address,
      action: 'forget'
    };

    try {
      keyring.forgetAccount(address);
      status.status = 'success';
      status.message = t<string>('account forgotten');
      const lastAccount = allAccounts[allAccounts.length - 1];

      if (lastAccount === address) {
        setValue('');
        changeAccount('');
      } else {
        setValue(lastAccount);
        changeAccount(lastAccount);
      }
      toggleForget();
    } catch (error) {
      status.status = 'error';
      status.message = (error as Error).message;
    }
  };

  useEffect(() => {
    const hasCurrentName = allAccounts.find(account => account === currentAccount);
    if (hasAccounts && (!currentAccount || !hasCurrentName)) {
      const lastAccount = allAccounts[allAccounts.length - 1];
      setValue(lastAccount);
      changeAccount(lastAccount);
    }

  }, [currentAccount, allAccounts, hasAccounts]);

  useEffect((): void => {
    bestNumber && democracyLocks && setUnlockableIds(
      (prev): DemocracyUnlockable => {
        const ids = democracyLocks
          .filter(({isFinished, unlockAt}) => isFinished && bestNumber.gt(unlockAt))
          .map(({referendumId}) => referendumId);

        if (JSON.stringify(prev.ids) === JSON.stringify(ids)) {
          return prev;
        }

        return {
          democracyUnlockTx: createClearDemocracyTx(api.api, address, ids),
          ids
        };
      }
    );
  }, [address, api, bestNumber, democracyLocks]);
  return (
    <>
      {isBackupOpen && (
        <Backup
          address={address}
          key='modal-backup-account'
          onClose={toggleBackup}
        />
      )}
      {isDelegateOpen && (
        <DelegateModal
          key='modal-delegate'
          onClose={toggleDelegate}
          previousAmount={delegation?.amount}
          previousConviction={delegation?.conviction}
          previousDelegatedAccount={delegation?.accountDelegated}
          previousDelegatingAccount={address}
        />
      )}
      {isDeriveOpen && (
        <Derive
          from={address}
          key='modal-derive-account'
          onClose={toggleDerive}
        />
      )}
      {
        isWithdraw && (
          <Withdraw
            account={address}
            btc={assetInfo.Usable}
            onClose={toggleWithdraw}
            setN={setN}
          />
        )
      }
      {
        isXbtcTransfer && (
          <XbtcTransfer
            onClose={toggleXbtcTransfer}
            senderId={address}
            setN={setN}
          />
        )
      }
      {isForgetOpen && (
        <Forget
          address={address}
          key='modal-forget-account'
          onClose={toggleForget}
          onForget={_onForget}
          onStatusChange={queueAction}
        />
      )}
      {isIdentityMainOpen && (
        <IdentityMain
          address={address}
          key='modal-identity-main'
          onClose={toggleIdentityMain}
        />
      )}
      {isIdentitySubOpen && (
        <IdentitySub
          address={address}
          key='modal-identity-sub'
          onClose={toggleIdentitySub}
        />
      )}
      {isPasswordOpen && (
        <ChangePass
          address={address}
          key='modal-change-pass'
          onClose={togglePassword}
        />
      )}

      {
        isDepositeOpen && (
          <Deposite
            address={address}
            onClose={toggleDeposite}
          />
        )

      }
      {isProxyOverviewOpen && (
        <ProxyOverview
          key='modal-proxy-overview'
          onClose={toggleProxyOverview}
          previousProxy={proxy}
          proxiedAccount={address}
        />
      )}
      {isMultisigOpen && multiInfos && (
        <MultisigApprove
          address={address}
          key='multisig-approve'
          onClose={toggleMultisig}
          ongoing={multiInfos}
          threshold={meta.threshold as number}
          who={meta.who as string[]}
        />
      )}
      {isRecoverAccountOpen && (
        <RecoverAccount
          address={address}
          key='recover-account'
          onClose={toggleRecoverAccount}
        />
      )}
      {isRecoverSetupOpen && (
        <RecoverSetup
          address={address}
          key='recover-setup'
          onClose={toggleRecoverSetup}
        />
      )}
      {isUndelegateOpen && (
        <UndelegateModal
          accountDelegating={address}
          key='modal-delegate'
          onClose={toggleUndelegate}
        />
      )}
      {isAddMultisigOpen && (
        <Multisig
          onClose={toggleAddMultisig}
          onStatusChange={queueAction}
        />
      )}

      <Popup
        className={`theme--${theme}`}
        isOpen={isSettingsOpen}
        onClose={toggleSettings}
        trigger={
          <Icon icon='ellipsis-h' onClick={toggleSettings}/>
        }
      >
        <Menu
          onClick={toggleSettings}
          text
          vertical
        >
          {createMenuGroup([

            // (
            //   <Menu.Item
            //     key='sbtc recharge'
            //     onClick={toggleDeposite}
            //   >
            //     {t('sBTC recharge')}
            //   </Menu.Item>
            //
            // ),
            // (
            //   <Menu.Item
            //     key='sbtc withdraw'
            //     onClick={toggleWithdraw}
            //   >
            //     {t('sBTC Withdrawals')}
            //   </Menu.Item>
            // ),
            // (
            //   <Menu.Item
            //     key='sbtc transfer'
            //     onClick={toggleXbtcTransfer}
            //   >
            //     {t('sBTC Transfer')}
            //   </Menu.Item>
            // ),
            // api.api.tx.identity?.setIdentity && (
            //   // 设置链上身份
            //   <Menu.Item
            //     key='identityMain'
            //     onClick={toggleIdentityMain}
            //   >
            //     {t('Set on-chain identity')}
            //   </Menu.Item>
            // ),
            // api.api.tx.identity?.setSubs && identity?.display && (
            //   // 设置链上子身份
            //   <Menu.Item
            //     key='identitySub'
            //     onClick={toggleIdentitySub}
            //   >
            //     {t('Set on-chain sub-identities')}
            //   </Menu.Item>
            // ),
            // api.api.tx.vesting?.vest && vestingVestTx && (
            //   // 解锁既得金额
            //   <Menu.Item
            //     key='vestingVest'
            //     onClick={_vestingVest}
            //   >
            //     {t('Unlock vested amount')}
            //   </Menu.Item>
            // )
          ])}
          {createMenuGroup([
//通过链上账户派生路径
            !(isExternal || isHardware || isInjected || isMultisig) && (
              <Menu.Item
                key='deriveAccount'
                onClick={toggleDerive}
              >
                {t('Derive account via derivation path')}
              </Menu.Item>
            ),

            // isHardware && (
            //   //在硬件设备上显示地址
            //   <Menu.Item
            //     key='showHwAddress'
            //     onClick={_showOnHardware}
            //   >
            //     {t('Show address on hardware device')}
            //   </Menu.Item>
            // )
          ])}
          {createMenuGroup([
            !(isExternal || isInjected || isMultisig || isDevelopment) && (
              <Menu.Item
                key='backupJson'
                onClick={toggleBackup}
              >
                {t('Create a backup file for this account')}
              </Menu.Item>
            ),
            !(isExternal || isInjected || isMultisig || isDevelopment) && (
              <Menu.Item
                key='changePassword'
                onClick={togglePassword}
              >
                {t('Change this account\'s password')}
              </Menu.Item>
            ),
            !(isInjected || isDevelopment) && (
              <Menu.Item
                key='forgetAccount'
                onClick={toggleForget}
              >
                {t('Forget this account')}
              </Menu.Item>
            ),
            (api.api.query.democracy?.votingOf && !delegation?.accountDelegated && (
              <Menu.Item
                key='delegate'
                onClick={toggleDelegate}
              >
                {t('Delegate democracy votes')}
              </Menu.Item>
            )),
            (api.api.tx.multisig?.asMulti && isMultisig && (<Menu.Item
                disabled={!multiInfos || !multiInfos.length}
                key='multisigApprovals'
                onClick={toggleMultisig}
              >
                {t('Multisig approvals')}
              </Menu.Item>
            )),
            (
              <Menu.Item
                key='addMultisig'
                onClick={toggleAddMultisig}
              >
                {t('Multisig')}
              </Menu.Item>
            ),
            (api.api.tx.democracy?.unlock && democracyUnlockTx && (
              <Menu.Item
                key='clearDemocracy'
                onClick={_clearDemocracyLocks}
              >
                {t('Clear expired democracy locks')}
              </Menu.Item>
            )),
            // (api.api.query.proxy?.proxies && (
            //   <Menu.Item
            //     key='proxy-overview'
            //     onClick={toggleProxyOverview}
            //   >
            //     {proxy?.[0].length
            //       ? t('Manage proxies')
            //       : t('Add proxy')
            //     }
            //   </Menu.Item>
            // ))
          ])}

          {/*{api.api.tx.recovery?.createRecovery && createMenuGroup([*/}
          {/*  !recoveryInfo && (*/}
          {/*    // 使之可恢复*/}
          {/*    <Menu.Item*/}
          {/*      key='makeRecoverable'*/}
          {/*      onClick={toggleRecoverSetup}*/}
          {/*    >*/}
          {/*      {t('Make recoverable')}*/}
          {/*    </Menu.Item>*/}
          {/*  ),*/}
          {/*  // 启动针对另一个账户的恢复*/}
          {/*  <Menu.Item*/}
          {/*    key='initRecovery'*/}
          {/*    onClick={toggleRecoverAccount}*/}
          {/*  >*/}
          {/*    {t('Initiate recovery for another')}*/}
          {/*  </Menu.Item>*/}
          {/*])}*/}
          {/*{api.api.query.democracy?.votingOf && delegation?.accountDelegated && createMenuGroup([*/}
          {/*  // 更改民主代表*/}
          {/*  <Menu.Item*/}
          {/*    key='changeDelegate'*/}
          {/*    onClick={toggleDelegate}*/}
          {/*  >*/}
          {/*    {t('Change democracy delegation')}*/}
          {/*  </Menu.Item>,*/}
          {/*  // 不受委托的*/}
          {/*  <Menu.Item*/}
          {/*    key='undelegate'*/}
          {/*    onClick={toggleUndelegate}*/}
          {/*  >*/}
          {/*    {t('Undelegate')}*/}
          {/*  </Menu.Item>*/}
          {/*])}*/}

          {/*<ChainLock*/}
          {/*  className='accounts--network-toggle'*/}
          {/*  genesisHash={genesisHash}*/}
          {/*  isDisabled={api.isDevelopment}*/}
          {/*  onChange={onSetGenesisHash}*/}
          {/*/>*/}
        </Menu>
      </Popup>
    </>
  );
}


export default AccountActions;
