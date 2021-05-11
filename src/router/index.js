import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
    {
        path: '/',
        name: 'Sudoku Game',
        component: resolve => require(['../page/sudoku'], resolve)
    },
    {
        path: '/sudoku-rule',
        name: 'Sudoku Rule',
        component: resolve => require(['../page/srule'], resolve)
    },
    {
        path: '/magic',
        name: 'Magic Game',
        component: resolve => require(['../page/magic'], resolve)
    },
    {
        path: '/magic-rule',
        name: 'Magic Rule',
        component: resolve => require(['../page/mrule'], resolve)
    },

];

export default new Router({routes});
