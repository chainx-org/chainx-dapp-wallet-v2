import React, {useContext, useEffect, useState} from 'react';
import { useTranslation } from '../../../translate';
import Card from '../components/CardWrapper';
import XpcxCard from '../XpcxCard';
import XsBTCCard from '../XsBTCCard';
export default function (): React.ReactElement {
  const {t} = useTranslation();


  return (
    <Card className='details'>
        <div className='header'>{t('Cross-chain assets')}</div>
        <XsBTCCard />
        <XpcxCard />
    </Card>
  );
}
