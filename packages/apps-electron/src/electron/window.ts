// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {BrowserWindow, dialog, screen, shell} from 'electron';
import path from 'path';
import axios from 'axios';

export function createWindow(environment: string): Promise<unknown> {
  const {height, width} = screen.getPrimaryDisplay().workAreaSize;
  const packageJson = require('../../../../package.json');

  const win = new BrowserWindow({
    height,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    },
    width
  });
  if (environment === 'development') {
    win.webContents.openDevTools();
    return win.loadURL('http://127.0.0.1:3000/');
  }


  async function getRelease() {
    try {
      const {data} = await axios.get('https://api.github.com/repos/chainx-org/chainx-dapp-wallet-v2/releases/latest');
      const fileNameList: string[] = await data.assets.map((file: any) => file.name);
      const fileNameToDownload: string | string[] = await fileNameList.filter((fileName: string) => (fileName.indexOf('.exe') !== -1 || fileName.indexOf('.dmg') !== -1) && fileName.indexOf('.blockmap') === -1);
      const filesToDownload = await data.assets.filter((file: any) => file.name === fileNameToDownload[0] || file.name === fileNameToDownload[1]);
      const latestVersion = data.tag_name.slice(1)
      const fileOfWin = filesToDownload.find((file: any) => file.name.indexOf('.exe') !== -1)
      const fileOfMac = filesToDownload.find((file: any) => file.name.indexOf('.dmg') !== -1)

      if (packageJson.version !== latestVersion) {
        dialog.showMessageBox(win, {
          title: '温馨提示',
          message: `您访问的版本不是最新版本哦，如果可以，请使用我们的最新版本，点击下方按钮进入下载页面：`,
          buttons: ['暂不更新', 'mac 下载入口', 'windows 下载入口']
        }).then((index) => {
          if (index.response === 1) {
            shell.openExternal(fileOfMac.browser_download_url);
          } else if (index.response === 2) {
            shell.openExternal(fileOfWin.browser_download_url);
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  getRelease();


  const mainFilePath = path.resolve(__dirname, 'index.html');

  return win.loadFile(mainFilePath);
}
