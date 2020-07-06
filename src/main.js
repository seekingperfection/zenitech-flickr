import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// import fetch from "./modules/fetch";
import "@/assets/styles.css";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

Vue.config.productionTip = false;

// Vue.use(fetch)

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
