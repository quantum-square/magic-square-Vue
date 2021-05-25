import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
    {
        path: '/',
        name: 'Sudoku Game',
        component: resolve => require(['../page/sudoku'], resolve),
        meta:{
            title: 'Sudoku'
        }
    },
    {
        path: '/sudoku-rule',
        name: 'Sudoku Rule',
        component: resolve => require(['../page/srule'], resolve),
        meta:{
            title: 'Sudoku Rule'
        }
    },
    {
        path: '/magic',
        name: 'Magic Game',
        component: resolve => require(['../page/magic'], resolve),
        meta:{
            title: 'Magic Square'
        }
    },
    {
        path: '/magic-rule',
        name: 'Magic Rule',
        component: resolve => require(['../page/mrule'], resolve),
        meta:{
            title: 'Magic Rule'
        }
    },

];

export default new Router({routes});
