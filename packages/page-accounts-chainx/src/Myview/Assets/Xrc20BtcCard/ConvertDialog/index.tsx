
import React, { useState } from 'react';
import StyledDialog from './StyledDialog';
import { AmountInput, PrimaryButton, SelectInput, TextInput } from '@chainx/ui';
import $t from '../../../../../locale';
import { Label, Value } from '../../../components';
import { toPrecision } from '../../../../../utils';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchXrcBtcBalance,
  xrcBtcBalanceSelector,
  xrcBtcXrc20InfoSelector
} from '../../../../../reducers/xrcBtcSlice';
import BigNumber from 'bignumber.js';
import {
  showSnack,
  signAndSendExtrinsic
} from '../../../../../utils/chainxProvider';
import { addressSelector } from '../../../../../reducers/addressSlice';
import { hexToU8a, u8aConcat, u8aToHex } from '@chainx/util';
import { u64 } from '@chainx/types';
import { fetchAccountAssets } from '../../../../../reducers/assetSlice';
import { isDemoSelector } from '../../../../../selectors';
import { accountIdSelector } from '../../../../selectors/assets';
import { getChainx } from '../../../../../services/chainx';
import { xbtcFreeSelector } from '../../selectors';

export default function ({ handleClose }) {
  const accountAddress = useSelector(addressSelector);
  const accountId = useSelector(accountIdSelector);
  const isDemoAddr = useSelector(isDemoSelector);

  const options = ['sBTC', 'XRC20-BTC'].map((token) => ({
    value: token,
    label: token
  }));

  const xbtcFree = useSelector(xbtcFreeSelector);
  const xrcBtcBalance = useSelector(xrcBtcBalanceSelector);

  const [from, setFrom] = useState('sBTC');
  const [to, setTo] = useState('XRC20-BTC');

  const [amount, setAmount] = useState('');
  const [amountErrMsg, setAmountErrMsg] = useState('');

  const [disabled, setDisabled] = useState(false);

  const precision = 8;
  const free = from === 'sBTC' ? xbtcFree : xrcBtcBalance;

  const { address: contractAddress, selectors } = useSelector(
    xrcBtcXrc20InfoSelector
  );

  const dispatch = useDispatch();
  const chainx = getChainx();

  const convert = async () => {
    if (isNaN(parseFloat(amount))) {
      setAmountErrMsg($t('ASSET_TRANSFER_AMOUNT_ERROR'));

      return;
    }

    const realAmount = BigNumber(amount)
      .multipliedBy(Math.pow(10, precision))
      .toNumber();

    if (realAmount > free) {
      setAmountErrMsg($t('ASSET_TRANSFER_AMOUNT_TOO_MUCH_ERROR'));

      return;
    }

    if (realAmount <= 0) {
      setAmountErrMsg($t('COMMON_ASSET_TOO_LOW_ERROR'));

      return;
    }

    const gasLimit = 500000;

    setDisabled(true);

    try {
      let status;

      if (from === 'sBTC') {
        const extrinsic = chainx.api.tx.xContracts.convertToXrc20(
          'BTC',
          realAmount,
          gasLimit
        );

        status = await signAndSendExtrinsic(accountAddress, extrinsic.toHex());
      } else {
        const extrinsic = chainx.api.tx.xContracts.call(
          contractAddress,
          0,
          gasLimit,
          u8aToHex(
            u8aConcat(hexToU8a(selectors.Destroy), new u64(realAmount).toU8a())
          )
        );

        status = await signAndSendExtrinsic(accountAddress, extrinsic.toHex());
      }

      const prefix = from === 'sBTC' ? '划转' : '转回';

      const messages = {
        successTitle: `${prefix}成功`,
        failTitle: `${prefix}失败`,
        successMessage: `${prefix} ${amount} ${from}`,
        failMessage: `交易hash ${status.txHash}`
      };

      await showSnack(status, messages, dispatch);
      handleClose();
      dispatch(fetchXrcBtcBalance(accountId));
      dispatch(fetchAccountAssets(accountAddress));
    } catch (e) {
      console.error(e);
      setDisabled(false);
    }
  };

  return (
    <StyledDialog handleClose={handleClose}
      open
      title={'划转'}>
      <main className='content'>
        <div className='label'>
          <div className='from'>从</div>
          <div className='to'>到</div>
        </div>

        <div className='input'>
          <div className='from'>
            <SelectInput
              onChange={(value) => {
                setFrom(value);
                setTo(value === 'XRC20-BTC' ? 'sBTC' : 'XRC20-BTC');
              }}
              options={options}
              value={from}
            />
          </div>
          <div>
            <TextInput disabled={true}
              showClear={false}
              value={to} />
          </div>
        </div>

        <div className='amount'>
          <div className='amount-input'>
            <AmountInput
              error={!!amountErrMsg}
              errorText={amountErrMsg}
              onChange={(value) => {
                setAmountErrMsg('');
                setAmount(value);
              }}
              placeholder={'划转数量'}
              precision={precision}
              value={amount}
            />
          </div>
          <div className='balance'>
            <Label>{$t('ASSET_BALANCE')}</Label>
            <Value>
              {toPrecision(free, precision)} {from}
            </Value>
          </div>
        </div>

        <div>
          <PrimaryButton
            disabled={isDemoAddr || disabled}
            onClick={convert}
            size='fullWidth'
          >
            {$t('COMMON_CONFIRM')}
          </PrimaryButton>
        </div>
      </main>
    </StyledDialog>
  );
}
