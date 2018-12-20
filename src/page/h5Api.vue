<template>
    <div id="h5">
      <div class="box">
        <h1 id="h1">scrollIntoView</h1>
      </div>
      <div class="classlist" @click="cList">classList</div>
    </div>
</template>
<script>
export default {
    data () {
        return {

        };
    },
    mounted () {
        const h = document.querySelector('#h1');
        console.log(h.scrollIntoView);
        h.addEventListener('click', () => {
            h.scrollIntoView(true);
        });
    },
    methods: {
        cList () {
            let clist = document.querySelector('.classlist').classList;
            // clist.length;  =>  / 1
            // clist.item(0);  =>  / classlist
            /* 添加删除一次只能操作一个 */
            // clist.add('c1');  =>  / classlist c1
            // clist.add('c2');  =>  / classlist c1 c2
            // clist.remove('c1');  =>  / classlist c1
            // clist.toggle('c1', false);  => / 只有一个参数 判断有则删除(返回false)，无则添加（返回true）。
            // 有两个参数的时候，判断第二个位 true=》添加 反之=》删除
            // clist.contains('c1') => / 检查class数组中是否包含某个class名
        }
    }
};
</script>
<style>
  #h5 {
    width: 100%;
    height: 100%;
    background: #eee;
    overflow-y: scroll;
    position: relative;
  }
  .box {
    width: 100%;
    height: 1000px;
    text-align: center;
  }
  h1{
    font-size: 34px;
    position: absolute;
    top: 300px;
  }
  .classlist {
    font-size: 34px;
    font-weight: 800;
  }
  .c1 {
    color: red;
  }
  .c2 {
    background: aquamarine;
  }
</style>
