'use strict';

const Controller = require('egg').Controller;
const eleme = require('eleme-openapi-sdk');

class AuthController extends Controller {
  async index() {
    const { ctx } = this;

    const config = new eleme.Config({
      key: 'TNuHiM2yjw',
      secret: 'bd517d26e0b099575736934034464bfbdac32227 ',
      sandbox: false,
    });
    const oAuthClient = new eleme.OAuthClient(config);
    const result = await oAuthClient.getOAuthUrl('http://localhost:7001', 'state111', 'all');
    const token = result.access_token;
    // const rpcClient = new eleme.RpcClient(token, config);
    // const shopService = new eleme.ShopService(rpcClient);
    // const shopInfo = await shopService.getShop(123456);
    console.log(result);
    ctx.body = result;
  }
}

module.exports = AuthController;
