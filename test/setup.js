/* global global */

// VUE DEFAULT CONFIG
require('jsdom-global')();
window.Date = Date;

// CUSTOM CONFIG
const chai = require('chai');
const sinon = require('sinon');

const sinonChai = require('sinon-chai');
const testUtils = require('@vue/test-utils');

chai.use(sinonChai);

global.expect = chai.expect;
global.mount = testUtils.mount;
global.shallowMount = testUtils.shallowMount;
global.sinon = sinon;
