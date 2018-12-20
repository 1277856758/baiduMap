<template>
  <div id="mapvBox">
    <div class="mapvBoxTypeBox">
      <ul class="mapvBoxType" @click="tabMap">
        <li>one</li>
        <li>two</li>
      </ul>
    </div>
    <div class="mapvFlag" @click="mapvFlag">
      {{mapvFalgText}}
    </div>
    <div id="mapv">
    </div>
  </div>
</template>

<script>
  import {arr} from '../utils/lt.js';
export default {
    data () {
        return {
            map: null,
            markers: [],
            markerClusterer: null,
            dataSet: null,
            mapvLayer: null,
            mapvFalgText: '关'
        };
    },
    mounted () {
    // 创建Map实例
        this.map = new BMap.Map('mapv', {
            enableMapClick: false
        });
        // 创建热力图
        this.heatMapv();
        // 创建点聚合
        // this.add_overlay();
        // this.mapvType();
    },
    methods: {
    // 创建点聚合
        add_overlay () {
            // 最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
            let MAX = 20;
            for (let i = 0; i < MAX; i++) {
                const pt = new BMap.Point(Math.random() * 40 + 85, Math.random() * 30 + 21);
                const marker = new BMap.Marker(pt);
                this.map.addOverlay(marker);
                this.markers.push(marker);
            }
            this.markerClusterer = new BMapLib.MarkerClusterer(this.map, {markers: this.markers});
        },
        // 重新创建点聚合
        remove_overlay () {
            for (let i = 0; i < 4; i++) {
              this.map.removeOverlay(markers[i]);
            }

            let markers1 = markers.slice(4, markers.length);
            this.markerClusterer.clearMarkers(); // 此步骤需要
            this.markerClusterer = new BMapLib.MarkerClusterer(this.map, {markers: markers1});
        },
        // 热力图
        heatMapv () {
            this.map.centerAndZoom(new BMap.Point(105.403119, 38.028658), 5); // 初始化地图,设置中心点坐标和地图级别
            this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
            this.map.setMapStyle({
                style: 'midnight'
            });
            let randomCount = 300;
            let data = [];
            let citys = ['北京', '天津', '上海', '重庆', '石家庄', '太原', '呼和浩特', '哈尔滨', '长春', '沈阳', '济南', '南京', '合肥', '杭州', '南昌',
                '福州', '郑州', '武汉', '长沙', '广州', '南宁', '西安', '银川', '兰州', '西宁', '乌鲁木齐', '成都', '贵阳', '昆明', '拉萨', '海口'];
            // 构造数据
            while (randomCount--) {
                let cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)]);
                data.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [cityCenter.lng - 2 + Math.random() * 4, cityCenter.lat - 2 + Math.random() * 4]
                    },
                    count: 30 * Math.random()
                });
            }
            this.dataSet = new mapv.DataSet(data);
            let options = {
                fillStyle: 'rgba(255, 50, 50, 0.6)',
                maxSize: 20,
                max: 30,
                draw: 'bubble'
            };
            // var options = {
            //   fillStyle: 'rgba(55, 50, 250, 0.8)',
            //   shadowColor: 'rgba(255, 250, 50, 1)',
            //   shadowBlur: 20,
            //   max: 100,
            //   size: 50,
            //   label: {
            //     show: true,
            //     fillStyle: 'white',
            //     // shadowColor: 'yellow',
            //     // font: '20px Arial',
            //     // shadowBlur: 10,
            //   },
            //   globalAlpha: 0.5,
            //   gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
            //   draw: 'honeycomb'
            // }
            // this.mapvLayer = new mapv.baiduMapLayer(this.map, this.dataSet, options);
            let points = [];
            for (var i = 0; i < arr.length; i++) {
              points.push(new BMap.Point(arr[i][0], arr[i][1]));
            }
            console.log(points);
            let pointCollection = new BMap.PointCollection(points, {
            size: BMAP_POINT_SIZE_SMALL,
            shape: BMAP_POINT_SHAPE_STAR,
            color: '#d340c3'
            });  // 初始化PointCollection
            pointCollection.addEventListener('click', function (e) {
              alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
            });
            this.map.addOverlay(pointCollection);  // 添加Overlay
        },
        // 切换热力图模式
        tabMap (e) {
            // this.mapvLayer.destroy(); // 销毁当前图层
            let options = null;
            if (e.target.innerHTML === 'two') {
                options = {
                    fillStyle: 'rgba(55, 50, 250, 0.8)', // 填充颜色
                    shadowColor: 'rgba(255, 250, 50, 1)', // 投影颜色
                    shadowBlur: 20, // 投影模糊级数
                    max: 100, // 最大权重值
                    size: 50, // 每个热力点的半径大小
                    label: { // 网格中显示累加的值总和
                        show: true,
                        fillStyle: 'white'
                    // shadowColor: 'yellow',
                    // font: '20px Arial',
                    // shadowBlur: 10,
                    },
                    globalAlpha: 0.5, // 透明度
                    gradient: { // 热力图渐变色
                        0.25: 'rgb(0,0,255)',
                        0.55: 'rgb(0,255,0)',
                        0.85: 'yellow',
                        1.0: 'rgb(255,0,0)'},
                    draw: 'honeycomb' // 类型
                };
            } else {
                options = {
                    fillStyle: 'rgba(255, 50, 50, 0.6)',
                    shadowColor: 'rgba(255, 0, 0, 0)', // 投影颜色
                    globalAlpha: 1, // 透明度
                    maxSize: 20,
                    max: 30,
                    draw: 'bubble'
                };
            }

            this.mapvLayer.update({
                options: options // 修改配置
            });
        },
        mapvFlag () {
            this.mapvFalgText === '关' ? this.mapvFalgText = '开' : this.mapvFalgText = '关';
            this.mapvFalgText === '开' ? this.mapvLayer.hide() : this.mapvLayer.show();
        },
        mapvType () {
            let mapvType = document.querySelector('.mapvBoxType');
            let mapvTypeLi = mapvType.querySelectorAll('li')[0];
            mapvType.addEventListener('mouseover', () => {
                let mapvTypeClass = mapvType.className.split(' ');
                let classFlag = mapvTypeClass.includes('mapvBoxTypeAnimation');
                if (!classFlag) mapvType.className += ' mapvBoxTypeAnimation';
            });
            mapvType.addEventListener('mouseout', () => {
                let mapvTypeClass = mapvType.className.split(' ');
                mapvType.className = mapvTypeClass[0];
            });
        }
    }
};
</script>
<style scoped lang="scss">
  #mapvBox, #mapv {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .mapvBoxTypeBox{
    position: absolute;
    bottom:0;
    right: 0;
    z-index: 9999;
  }
  .mapvBoxType{
    position: absolute;
    width: 130px;
    height: 75px;
    bottom:0;
    right: 0;
    z-index: 9999;
    display: flex;
    color: #fff;
    -webkit-transition-property: width,opacity;
    transition-property: width;
    -webkit-transition-duration: .4s;
    transition-duration: .4s;
  }
  .mapvBoxType li{
    position: absolute;
    bottom: 2px;
    width: 120px;
    height: 70px;
    text-align: center;
    line-height: 70px;
    background: rgba(255,255,255,0.3);
    border-radius: 8px;
    margin: 0 2px;
    -webkit-transition-property: right,opacity;
    transition-property: right,opacity;
    -webkit-transition-duration: .4s;
    transition-duration: .4s;
  }
  .mapvBoxType li:hover{
    border:1px solid #fff;
  }
  .mapvBoxType li:nth-child(1){
    background-image:url("../../static/img/map1.png");
    background-repeat:no-repeat;
    background-size:100% 100%;
    -moz-background-size:100% 100%;
    opacity: 0.5;
    right: 15px;
  }
  .mapvBoxType li:nth-child(2){
    background-image:url("../../static/img/map2.png");
    background-repeat:no-repeat;
    background-size:100% 100%;
    -moz-background-size:100% 100%;
    right: 5px;
    z-index: 10;
  }
  .mapvBoxTypeAnimation{
    width: 260px;
    background: rgba(255,255,255,0.8);
    border-radius: 8px;
    li:nth-child(1){
      opacity: 1 !important;
      right: 130px !important;
    }
  }
  .mapvFlag {
    position: absolute;
    top: 10px;
    left: 10px;
    color: #333;
    background: #fff;
    width: 60px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    border-radius: 8px;
    z-index: 999;
  }
</style>
