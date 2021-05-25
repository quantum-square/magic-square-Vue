import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import router from './router'
import axios from "axios";
import VueAxios from 'vue-axios'

Vue.use(Antd);
Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.prototype.$axios = axios
axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/json'
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    next()
})


new Vue({
    render: h => h(App),
    router
}).$mount('#app')
