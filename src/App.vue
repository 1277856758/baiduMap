<template>
  <div id="app">
   <home></home>
  </div>
</template>

<script>

import Home from './components/home';

export default {
    name: 'App',
    components: {
        Home
    }
};
</script>

<style>
#app{
  width: 100%;
  height: 100%;
}
</style>
