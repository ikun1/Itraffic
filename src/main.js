//CommonJS模块化写法
var say = require('./util');
say();

/*es6模块化写法
import say from './util';

say();*/

import Vue from 'vue';
import './style/common.scss';
import App from './App.vue';
import dataInfo from './dataInfo.vue';
import { dataGenerator } from './dataGenerator.js'

var app = new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
	data:{
		message:'test'
	}
});
