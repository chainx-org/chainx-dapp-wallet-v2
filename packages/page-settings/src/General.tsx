// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/apps-config/settings/types';

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { createLanguages, createSs58 } from '@polkadot/apps-config';
import { allNetworks } from '@polkadot/networks';
import { useApi, useLedger } from '@polkadot/react-hooks';
import { Button, Dropdown } from '@polkadot/react-components';
import uiSettings from '@polkadot/ui-settings';
import type { SettingsStruct } from '@polkadot/ui-settings/types';

import { useTranslation } from './translate';
import { createIdenticon, createOption, save, saveAndReload } from './util';

interface Props {
  className?: string;
}

const ledgerConnOptions = uiSettings.availableLedgerConn;

function General ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { chainSS58, isApiReady, isElectron } = useApi();
  const { isLedgerCapable } = useLedger();

  // tri-state: null = nothing changed, false = no reload, true = reload required
  const [changed, setChanged] = useState<boolean | null>(null);
  const [settings, setSettings] = useState((): SettingsStruct => {
    const settings = uiSettings.get();

    return { ...settings, uiTheme: settings.uiTheme === 'dark' ? 'dark' : 'light' };
  });

  const iconOptions = useMemo(
    () => uiSettings.availableIcons
      .map((o): Option => createIdenticon(o, ['default']))
      .concat(createIdenticon({ info: 'robohash', text: 'RoboHash', value: 'robohash' })),
    []
  );

  const prefixOptions = useMemo(
    (): (Option | React.ReactNode)[] => {
      const network = allNetworks.find(({ prefix }) => prefix === chainSS58);

      return createSs58(t).map((o) =>
        createOption(o, ['default'], 'empty', (
          o.value === -1
            ? isApiReady
            ? network
              ? ` (${network.displayName}, ${chainSS58 || 0})`
              : ` (${chainSS58 || 0})`
            : undefined
            : ` (${o.value})`
        ))
      );
    },
    [chainSS58, isApiReady, t]
  );

  const themeOptions = useMemo(
    () => [
      { text: t('Light theme (default)'), value: 'light' },
      { text: t('Dark theme (experimental, work-in-progress)'), value: 'dark' }
    ],
    [t]
  );

  const translateLanguages = useMemo(
    () => createLanguages(t),
    [t]
  );

  useEffect((): void => {
    const prev = uiSettings.get() as unknown as Record<string, unknown>;
    const hasChanges = Object.entries(settings).some(([key, value]) => prev[key] !== value);
    const needsReload = prev.apiUrl !== settings.apiUrl || prev.prefix !== settings.prefix;

    setChanged(
      hasChanges
        ? needsReload
        : null
    );
  }, [settings]);

  const _handleChange = useCallback(
    (key: keyof SettingsStruct) => <T extends string | number>(value: T) =>
      setSettings((settings) => ({ ...settings, [key]: value })),
    []
  );

  const _saveAndReload = useCallback(
    () => saveAndReload(settings),
    [settings]
  );

  const _save = useCallback(
    (): void => {
      save(settings);
      setChanged(null);
    },
    [settings]
  );

  const { i18nLang, icon, ledgerConn, prefix, uiTheme } = settings;

  return (
    <div className={className}>
      <div className='ui--row'>
        <Dropdown
          defaultValue={prefix}
          help={t<string>('Override the default ss58 prefix for address generation')}
          label={t<string>('address prefix')}
          onChange={_handleChange('prefix')}
          options={prefixOptions}
        />
      </div>
      <div className='ui--row'>
        <Dropdown
          defaultValue={icon}
          help={t<string>('Override the default identity icon display with a specific theme')}
          label={t<string>('default icon theme')}
          onChange={_handleChange('icon')}
          options={iconOptions}
        />
      </div>
      {isLedgerCapable() && (
        <div className='ui--row'>
          <Dropdown
            defaultValue={ledgerConn}
            help={t<string>('Manage your connection to Ledger S')}
            label={t<string>('manage hardware connections')}
            onChange={_handleChange('ledgerConn')}
            options={ledgerConnOptions}
          />
        </div>
      )}
      <div className='ui--row'>
        <Dropdown
          defaultValue={uiTheme}
          label={t<string>('default interface theme')}
          onChange={_handleChange('uiTheme')}
          options={themeOptions}
        />
      </div>
      <div className='ui--row'>
        <Dropdown
          defaultValue={i18nLang}
          label={t<string>('default interface language')}
          onChange={_handleChange('i18nLang')}
          options={translateLanguages}
        />
      </div>
      <Button.Group>
        <Button
          icon='save'
          isDisabled={changed === null}
          label={
            changed
              ? t<string>('Save & Reload')
              : t<string>('Save')
          }
          onClick={
            changed
              ? _saveAndReload
              : _save
          }
        />
      </Button.Group>
    </div>
  );
}

export default React.memo(General);
