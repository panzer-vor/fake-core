'use strict';

const Controller = require('egg').Controller;
const eleme = require('eleme-openapi-sdk');

class AuthController extends Controller {
  async index() {
    const {
      ctx,
      app,
      config: { key, secret, sandbox, callbackUrl },
    } = this;

    const config = new eleme.Config({
      key,
      secret,
      sandbox,
    });
    const oAuthClient = new eleme.OAuthClient(config);
    const result = oAuthClient.getOAuthUrl(callbackUrl, 'state111', 'all');
    app.config.eleConfig = config;
    // const rpcClient = new eleme.RpcClient(token, config);
    // const shopService = new eleme.ShopService(rpcClient);
    // const shopInfo = await shopService.getShop(123456);

    ctx.redirect(result);
  }
  async getToken() {
    const {
      app,
      config: { callbackUrl, defalutToken, eleConfig },
    } = this;
    const { code } = this.ctx.queries;

    const oAuthClient = new eleme.OAuthClient(eleConfig);
    try {
      const token = await oAuthClient.getTokenByCode(code, callbackUrl);
      app.config.eleToken = token.access_token;
    } catch (err) {
      app.config.eleToken = defalutToken;
      // throw err;
    }
  }
}

module.exports = AuthController;
