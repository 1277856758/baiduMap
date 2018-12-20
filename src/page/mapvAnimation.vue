<template>
  <div id="animation">
  </div>
</template>

<script>
export default {
    data () {
        return {
            mapAnimation: null
        };
    },
    mounted () {
        this.mapAnimation = new BMap.Map('animation', {
            enableMapClick: false
        });
        // 初始化地图,设置中心点坐标和地图级别
        this.mapAnimation.centerAndZoom(new BMap.Point(116.404, 39.915), 5);

        this.mapAnimation.setCurrentCity('北京');
        // 开启鼠标滚轮缩放
        this.mapAnimation.enableScrollWheelZoom(true);
        // 创建热力图
        this.mapAnimation.setMapStyle({
            styleJson: [{
                'featureType': 'water',
                'elementType': 'all',
                'stylers': {
                    'color': '#044161'
                }
            }, {
                'featureType': 'land',
                'elementType': 'all',
                'stylers': {
                    'color': '#091934'
                }
            }, {
                'featureType': 'boundary',
                'elementType': 'geometry',
                'stylers': {
                    'color': '#064f85'
                }
            }, {
                'featureType': 'railway',
                'elementType': 'all',
                'stylers': {
                    'visibility': 'off'
                }
            }, {
                'featureType': 'highway',
                'elementType': 'geometry',
                'stylers': {
                    'color': '#004981'
                }
            }, {
                'featureType': 'highway',
                'elementType': 'geometry.fill',
                'stylers': {
                    'color': '#005b96',
                    'lightness': 1
                }
            }, {
                'featureType': 'highway',
                'elementType': 'labels',
                'stylers': {
                    'visibility': 'on'
                }
            }, {
                'featureType': 'arterial',
                'elementType': 'geometry',
                'stylers': {
                    'color': '#004981',
                    'lightness': -39
                }
            }, {
                'featureType': 'arterial',
                'elementType': 'geometry.fill',
                'stylers': {
                    'color': '#00508b'
                }
            }, {
                'featureType': 'poi',
                'elementType': 'all',
                'stylers': {
                    'visibility': 'off'
                }
            }, {
                'featureType': 'green',
                'elementType': 'all',
                'stylers': {
                    'color': '#056197',
                    'visibility': 'off'
                }
            }, {
                'featureType': 'subway',
                'elementType': 'all',
                'stylers': {
                    'visibility': 'off'
                }
            }, {
                'featureType': 'manmade',
                'elementType': 'all',
                'stylers': {
                    'visibility': 'off'
                }
            }, {
                'featureType': 'local',
                'elementType': 'all',
                'stylers': {
                    'visibility': 'off'
                }
            }, {
                'featureType': 'arterial',
                'elementType': 'labels',
                'stylers': {
                    'visibility': 'off'
                }
            }, {
                'featureType': 'boundary',
                'elementType': 'geometry.fill',
                'stylers': {
                    'color': '#029fd4'
                }
            }, {
                'featureType': 'building',
                'elementType': 'all',
                'stylers': {
                    'color': '#1a5787'
                }
            }, {
                'featureType': 'label',
                'elementType': 'all',
                'stylers': {
                    'visibility': 'off'
                }
            }, {
                'featureType': 'poi',
                'elementType': 'labels.text.fill',
                'stylers': {
                    'color': '#ffffff'
                }
            }, {
                'featureType': 'poi',
                'elementType': 'labels.text.stroke',
                'stylers': {
                    'color': '#1e1c1c'
                }
            }, {
                'featureType': 'administrative',
                'elementType': 'labels',
                'stylers': {
                    'visibility': 'off'
                }
            }, {
                'featureType': 'road',
                'elementType': 'labels',
                'stylers': {
                    'visibility': 'off'
                }
            }]
        });

        let randomCount = 10;

        let node_data = {
            '0': {'x': 108.154518, 'y': 36.643346},
            '1': {'x': 121.485124, 'y': 31.235317}
        };

        let edge_data = [
            {'source': '1', 'target': '0'}
        ];

        let citys = ['北京', '天津', '上海', '重庆', '石家庄', '太原', '呼和浩特', '哈尔滨', '长春', '沈阳', '济南', '南京', '合肥', '杭州', '南昌', '福州', '郑州', '武汉', '长沙', '广州', '南宁', '西安', '银川', '兰州', '西宁', '乌鲁木齐', '成都', '贵阳', '昆明', '拉萨', '海口'];

        // 构造数据
        for (let i = 1; i < randomCount; i++) {
            let cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)]);
            node_data[i] = {
                x: cityCenter.lng - 5 + Math.random() * 10,
                y: cityCenter.lat - 5 + Math.random() * 10
            };
            edge_data.push(
                {'source': ~~(i * Math.random()), 'target': '0'}
            );
        }

        var fbundling = mapv.utilForceEdgeBundling()
            .nodes(node_data)
            .edges(edge_data);

        var results = fbundling();

        var data = [];
        var timeData = [];

        for (var i = 0; i < results.length; i++) {
            var line = results[i];
            var coordinates = [];
            for (var j = 0; j < line.length; j++) {
                coordinates.push([line[j].x, line[j].y]);
                timeData.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [line[j].x, line[j].y]
                    },
                    count: 1,
                    time: j
                });
            }
            data.push({
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates
                }
            });
        }

        var dataSet = new mapv.DataSet(data);

        var options = {
            strokeStyle: 'rgba(55, 50, 250, 0.3)',
            globalCompositeOperation: 'lighter',
            shadowColor: 'rgba(55, 50, 250, 0.5)',
            shadowBlur: 10,
            methods: {
                click: function (item) {
                }
            },
            lineWidth: 1.0,
            draw: 'simple'
        };

        var mapvLayer = new mapv.baiduMapLayer(this.mapAnimation, dataSet, options);

        var dataSet = new mapv.DataSet(timeData);

        var options = {
            fillStyle: 'rgba(255, 250, 250, 0.9)',
            globalCompositeOperation: 'lighter',
            size: 1.5,
            animation: {
                type: 'time',
                stepsRange: {
                    start: 0,
                    end: 100
                },
                trails: 1,
                duration: 5
            },
            draw: 'simple'
        };

        var mapvLayer = new mapv.baiduMapLayer(this.mapAnimation, dataSet, options);
    }
};
</script>

<style scoped>
  #animation{
    width: 100%;
    height: 100%;
  }
</style>
