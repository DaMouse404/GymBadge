'use strict';

const assert = require('assert');
const puppeteer = require('puppeteer');

const indexFile = `file://${__dirname}/../index.html`;

function assertImageRank(page, image, rank) {
  const screenshot = `${__dirname}/images/${image}`;

  return page.$('#imgPicker')
    .then((ele) => ele.uploadFile(screenshot))
    .then(() => page.waitForFunction(() => document.querySelector('#results span:nth-of-type(1)').textContent.trim() != ''))
    .then(() => page.$eval('#results span:nth-of-type(1)', (ele) => ele.textContent))
    .then((text) => assert.equal(text, rank));
}

describe('Test Images', () => {
  beforeEach(() => {
    return puppeteer.launch()
      .then((browser) => this.browser = browser)
      .then(() => this.browser.newPage())
      .then((page) => this.page = page)
      .then(() => this.page.goto(indexFile))
  });

  afterEach(() => {
    return this.browser.close();
  });

  it('parses a standard PNG screenshot', () => assertImageRank(this.page, 'DragoniteV2.png', 'Bronze badge at ~76%'));
});