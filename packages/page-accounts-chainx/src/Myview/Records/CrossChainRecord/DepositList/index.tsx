import React  from 'react';
import Empty from '../../Empty';
import Wrapper from './Wrapper';
import Line from './Line';
import { useTranslation } from '@polkadot/app-accounts/translate';
import {Deposit} from '@polkadot/app-accounts-chainx/useRecords';

interface Props{
  deposits: Deposit[];
}

export default function ({deposits}: Props): React.ReactElement<Props> {

  const { t } = useTranslation();

  const depositsElement = (
    <ul>
      {(deposits || []).map((deposit, index) => {
        return <Line deposit={deposit} key={index} />;
      })}
    </ul>
  );
  return (
    <Wrapper>
      {(deposits || []).length > 0 ? (
        depositsElement
      ) : (
          <div>
            <Empty text={t('No top-up record')} />
          </div>
        )}
    </Wrapper>
  );
}
