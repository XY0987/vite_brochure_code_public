// remote 自己也能独立运行（独立部署的前提）。这里把暴露的 widget 挂到自己页面上。
import { mount } from './widget.js';
mount(document.querySelector('#app'));
