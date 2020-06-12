'use strict';

const Controller = require('egg').Controller;
const eleme = require('eleme-openapi-sdk');

class HomeController extends Controller {
  async index() {
    const {
      config: { eleToken, eleConfig },
    } = this;

    const rpcClient = new eleme.RpcClient(eleToken, eleConfig);
    // 实例化一个服务对象
    const shopService = new eleme.ShopService(rpcClient);
    const shopInfo = await shopService.getShop(123456);
    this.ctx.body = shopInfo;
  }
}

module.exports = HomeController;
