'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    console.log(this);
    // ctx.body = {
    //   text: 'hello world',
    // };
  }
}

module.exports = HomeController;
