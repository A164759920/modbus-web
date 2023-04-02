<template>
  <div id="app">
    <!-- <HelloWorld />
     -->
    <MqttPage></MqttPage>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import MqttPage from './components/MqttPage.vue';
export default {
  name: 'App',
  components: {
    MqttPage
    // HelloWorld,
  }
}
</script>

<style lang="scss">
#app,
html,
body {
  width: 100%;
  height: 100%;

}
</style>
