<template>
  <div>
    <div id="mess"></div>
    <textarea id="area"></textarea>
    <button class="kuang">
      发送
    </button>
  </div>
</template>

<script>
export default {
    data () {
        return {
            name: '帅哥'
        };
    },
    mounted () {
        let mess = document.getElementById('mess');
        let _this = this;
        if (window.WebSocket) {
            let ws = new WebSocket('ws://localhost:3002');

            ws.onopen = function (e) {
                console.log('连接服务器成功');
                ws.send('game1');
            };
            ws.onclose = function (e) {
                console.log('服务器关闭');
            };
            ws.onerror = function () {
                console.log('连接出错');
            };
            document.querySelector('.kuang').onclick = function (e) {
                ws.send(`${_this.name}:${area.value}`);
                // mess.innerHTML += `${_this.name}:${area.value}</br>`;
            };
            ws.onmessage = function (e) {
                console.log(e.data);
                mess.innerHTML += `${e.data}</br>`;
            };
        }
    }
};
</script>

<style>
  .kuang{text-align: center;margin-top:200px;}
  #mess{text-align: center}
</style>
