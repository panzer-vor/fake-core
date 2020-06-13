'use strict';

const Controller = require('egg').Controller;
const eleme = require('eleme-openapi-sdk');

class HomeController extends Controller {
  async index() {
    const {
      config: { eleConfig, defalutToken },
      ctx,
    } = this;
    const token = ctx.cookies.get('token') || defalutToken;
    const rpcClient = new eleme.RpcClient(token, eleConfig);

    const shopService = new eleme.ShopService(rpcClient);
    try {
      const shopInfo = await shopService.getShop(123456);
      ctx.body = shopInfo;
    } catch (err) {
      ctx.body = err;
    }
  }
}

module.exports = HomeController;
