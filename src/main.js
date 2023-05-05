import Vue from "vue";
import App from "./App.vue";

console.log("test");
Vue.config.productionTip = false;
Vue.directive("drag", {
  inserted: function (el) {
    el.onmousedown = function (e) {
      //按下鼠标
      let l = e.clientX - el.offsetLeft; //记录按下鼠标时的坐标
      let t = e.clientY - el.offsetTop;
      document.onmousemove = function (e) {
        //鼠标移动
        el.style.left = e.clientX - l + "px"; //计算每次拖动后的坐标
        el.style.top = e.clientY - t + "px";
      };
      el.onmouseup = function () {
        //松开鼠标
        document.onmousemove = null;
        el.onmouseup = null;
      };
    };
  },
});

new Vue({
  render: (h) => h(App),
}).$mount("#app");
