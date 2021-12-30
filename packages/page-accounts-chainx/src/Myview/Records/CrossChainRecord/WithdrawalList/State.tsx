import { useTranslation } from '@polkadot/app-accounts/translate';

export default function (txstate: any) {
  const { t } = useTranslation();

  switch (txstate) {
    case 'NormalCancel':
      return t('NormalCancel');
    case 'Applying':
      return t('Applying');
    case 'RootFinish':
      return t('RootFinish');
    case 'RootCancel':
      return t('RootCancel');
    case 'Processing':
     return t('Processing'); 
    case 'NormalFinish':
      return t('NormalFinish');
    default:
      return txstate;
  }
}
