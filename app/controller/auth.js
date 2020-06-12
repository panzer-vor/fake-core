'use strict';

const Controller = require('egg').Controller;
const eleme = require('eleme-openapi-sdk');

class AuthController extends Controller {
  async index() {
    const {
      ctx,
      config: { key, secret, sandbox, callbackUrl },
    } = this;

    const config = new eleme.Config({
      key,
      secret,
      sandbox,
    });
    const oAuthClient = new eleme.OAuthClient(config);
    const result = oAuthClient.getOAuthUrl(callbackUrl, 'state111', 'all');
    // const rpcClient = new eleme.RpcClient(token, config);
    // const shopService = new eleme.ShopService(rpcClient);
    // const shopInfo = await shopService.getShop(123456);
    ctx.redirect(result);
  }
  async getToken() {
    const {
      app,
      config: { key, secret, sandbox, callbackUrl },
    } = this;
    this.ctx.body = this.ctx.queries;
    return;
    const config = new eleme.Config({
      key,
      secret,
      sandbox,
    });
    const oAuthClient = new eleme.OAuthClient(config);
    try {
      const token = await oAuthClient.getTokenByCode(code, callbackUrl);
      app.config.token = token.access_token;
    } catch (err) {
      app.config.token = 'e6fd931d8f4bad712f0289815178949b';

      // throw err;
    }
  }
}

module.exports = AuthController;
