<template>
  <div id="routing">
  </div>
</template>

<script>
export default {
    data () {
        return {
            mapRouting: null
        };
    },
    mounted () {
        this.mapRouting = new BMap.Map('routing', {
            enableMapClick: false
        });
        // 初始化地图,设置中心点坐标和地图级别
        this.mapRouting.centerAndZoom(new BMap.Point(116.404, 39.915), 11);

        this.mapRouting.setCurrentCity('北京');
        // 开启鼠标滚轮缩放
        this.mapRouting.enableScrollWheelZoom(true);
        // 创建热力图
        // this.heatMapv();
        this.$http.post(
            '/addTest'
        ).then(response => {
            let data = response.data;
            let markers = data.markers.slice(0, 1);
            let line = data.lines.slice(0, 10)
            //
            console.time('渲染点 time');
            let points = [];
            let lines = [];
            line.forEach((item, i) => {
                // 渲染点
                let marker = new BMap.Marker(new BMap.Point(item.lng, item.lat));
                let marker2 = new BMap.Marker(new BMap.Point(item.lng2, item.lat2))
                this.mapRouting.addOverlay(marker);
                this.mapRouting.addOverlay(marker2);
                points.push(new BMap.Point(item.lng, item.lat));
                points.push(new BMap.Point(item.lng2, item.lat2));
                lines.push({
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': [[item.lng, item.lat], [item.lng2, item.lat2]]
                    },
                    'count': item.count
                });
            });
            let pointCollection = new BMap.PointCollection(points); // 初始化PointCollection
            this.mapRouting.addOverlay(pointCollection);
            console.timeEnd('渲染点 time');
            // console.time('渲染线 time');
            data.lines.forEach(item => {
                // , {
                //     strokeColor: 'red',
                //       strokeWeight: 2,
                //       strokeOpacity: 0.5,
                //       enableClicking: false
                //   }
                // 渲染线
                // let line = new BMap.Polyline([new BMap.Point(item.lng, item.lat), new BMap.Point(item.lng2, item.lat2)]);
                // this.map.addOverlay(line);

                lines.push({
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': [[item.lng, item.lat], [item.lng2, item.lat2]]
                    },
                    'count': item.count
                });
            });
            let dataSet = new mapv.DataSet(lines);
            let options = {
                gradient: {
                    0: 'blue',
                    0.5: 'yellow',
                    1: 'red'
                },
                lineWidth: 2,
                max: 30,
                draw: 'intensity'
            };
            let mapvLayer = new mapv.baiduMapLayer(this.mapRouting, dataSet, options);
            // console.timeEnd('渲染线 time');
            // this.$Spin.hide();
        }).catch((e) => {
            console.error(e);
            // this.$Spin.hide();
        });
    }
};
</script>
<style scoped lang="scss">
  #routing {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
