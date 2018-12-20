<template>
    <div class='home_aside'>
          home_aside
      <ul class="aside">
        <router-link to="/map" tag="li">map</router-link>
        <router-link to="/mapv" tag="li">mapv</router-link>
        <router-link to="/routing" tag="li">routing</router-link>
        <router-link to="/animation" tag="li">animation</router-link>
        <router-link to="/webSocket" tag="li">webSocket</router-link>
        <router-link to="/webSocket1" tag="li">webSocket1</router-link>
        <router-link to="/h5Api" tag="li">h5Api</router-link>
      </ul>
      </div>
</template>

<script>
export default {

};
</script>

<style scoped>
.home_aside {
  width: 250px;
  height: 100%;
  background: rgb(121,221,238);
  color: rgb(30, 161, 238);
  font-size: 24px;
  text-align: center;
}
.aside{
  width: 100%;
  height: 100%;
}
.aside li {
  width: 100%;
  height: 30px;
  font-size: 18px;
  color: bisque;
  line-height: 30px;
}
</style>
