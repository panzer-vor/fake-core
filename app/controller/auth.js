'use strict';

const Controller = require('egg').Controller;
const eleme = require('eleme-openapi-sdk');

class AuthController extends Controller {
  async index() {
    const {
      ctx,
      config: { eleConfig, callbackUrl },
    } = this;

    const oAuthClient = new eleme.OAuthClient(eleConfig);
    const result = oAuthClient.getOAuthUrl(callbackUrl, 'state111', 'all');

    ctx.redirect(result);
  }
  async getToken() {
    const {
      ctx,
      config: { callbackUrl, defalutToken, eleConfig },
    } = this;
    const { code } = this.ctx.queries;
    const oAuthClient = new eleme.OAuthClient(eleConfig);
    try {
      const result = await oAuthClient.getTokenByCode(code, callbackUrl);
      const token = result.access_token;
      ctx.cookies.set('token', token);
      ctx.body = {
        success: true,
      };
    } catch (err) {
      ctx.cookies.set('token', defalutToken);
      console.log(err);
    }
  }
}

module.exports = AuthController;
