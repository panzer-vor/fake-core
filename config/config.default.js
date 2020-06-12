/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {
    key: 'HjNvm9P2fN',
    secret: '5f85bf67b864e9da86e9c2820aa7739f9146749c ',
    sandbox: true,
    callbackUrl: 'http://129.204.178.162:7001/token',
  });

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1591880637169_4156';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
