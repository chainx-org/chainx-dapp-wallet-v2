import React from 'react';
import BaseOverlay from '@polkadot/apps/overlays/Base';
import { useTranslation } from '@polkadot/apps/translate';

const AccountAlert = (): React.ReactElement => {
  const {t} = useTranslation();

  return (
    <BaseOverlay
      icon='exclamation-triangle'
      type='error'
    >
      <div>{t('No account is currently selected, please open the account selection panel to select an account')}</div>
    </BaseOverlay>
  );
};

export default AccountAlert;
