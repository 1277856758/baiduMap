<template>
 <div class='home'>
   <div class='home_head'>
      home_head
   </div>
   <div class="home_body">
      <Aside></Aside>
      <div id="content">
        <transition name="move" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>

   </div>

 </div>
</template>

<script>
import Aside from './aside.vue';
import Content from './content.vue';
export default {
    name: 'HelloWorld',
    data () {
        return {};
    },
    components: {
        Aside,
        Content
    },
    mounted () {

    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.home_head {
  width: 100%;
  height: 60px;
  background: #000;
  color: #fff;
  font-size: 18px;
  text-align: center;
  line-height: 60px;
}
.home_body {
  flex: 1;
  display: flex;
  overflow: hidden;
}
#content{
  flex:1;
}
</style>
