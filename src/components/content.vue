<template>
    <div class='home_content' id="home_content">
        <!--<div id='map'>-->
        <!--</div>-->
        <!--<div class='map_top'>-->
            <!--<button @click="addLayers">-->
                <!--<svg class="icon_addLayers" aria-hidden="true">-->
                    <!--<use xlink:href="#dzfd-icon-tianjiawangluo"></use>-->
                <!--</svg>  -->
            <!--</button> -->
        <!--</div>-->
        <!--<div id="echarts" :style="{width: '300px', height: '300px'}"></div>-->
      <router-view></router-view>
    </div>
</template>

<script>

import {mapState, mapGetters, mapMutations} from 'vuex';
import {GeoJSON, ClipperLib, Clipper, Snapping} from '../utils/layer/Polygon.Plugin';


export default {
    data () {
        return {
            map: null,
            stylePolygon: {
                strokeColor: '#2099f4', // 边线颜色。
                fillColor: '#3daafc', // 填充颜色。当参数为空时，圆形将没有填充效果。
                strokeWeight: 2, // 边线的宽度，以像素为单位。
                strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
                fillOpacity: 0.6, // 填充的透明度，取值范围0 - 1。
                strokeStyle: 'solid' // 边线的样式，solid或dashed。
            },
            styleMarker: {
                icon: new BMap.Icon('/static/img/HT.png', new BMap.Size(8, 8)), // 点上的实心图标
                enableClicking: false // 是否可点击
            },
            snappable: false, // 鼠标吸附功能开关
            prohibitSelfIntersection: true, // 禁止自相交开关
            doesSelfIntersect: false, // 当前区域是否自交
            enabledDraw: false, // 绘图状态
            hintMarker: null, // 吸附marker
            hintLabel: null, // 提示标题
            polygon: null,
            points: [],
            markers: [], // 节点上的marker集合
            updateLabelDate: null // 修改提示标题后的计时时间
        };
    },
    mounted () {
        // this.drawLine();
        // this.$http.post('/layerDatas')
        // .then((res) => {
        //     if (res.data.code == 1) {
        //         this.$store.commit("map/setLayers", res.data.data);
        //         res.data.data.forEach((layer, i) => {
        //             let _polygon = new BMap.Polygon(layer.optins, Object.assign(
        //                 {
        //                 strokeColor: "#2099f4",
        //                 strokeWeight: 1,
        //                 strokeOpacity: 0.8,
        //                 fillOpacity: 0.2,
        //                 fillColor: "#3daafc"}, {strokeWeight: 2}));
        //             this.map.addOverlay(_polygon)
        //             _polygon.addEventListener('click', () => {
        //                 this.layerStyle(_polygon)
        //             })
        //
        //         })
        //     } else {
        //         console.log('error')
        //     }
        // })
        //
        // this.map = new BMap.Map("map", {enableMapClick: false})
        // // 初始化地图,设置中心点坐标和地图级别
        // this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
        // //添加地图类型控件
        // this.map.addControl(new BMap.MapTypeControl({
        //     mapTypes:[
        //         BMAP_NORMAL_MAP,
        //         BMAP_HYBRID_MAP
        //     ]}));
        // // 设置地图显示的城市 此项是必须设置的
        // this.map.setCurrentCity("北京");
        // //开启鼠标滚轮缩放
        // this.map.enableScrollWheelZoom(true);
    },
    methods: {
        drawLine () {
        // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('echarts'));
            // 绘制图表
            myChart.setOption({
                title: { text: '在Vue中使用echarts' },
                tooltip: {},
                xAxis: {
                    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            });
        },
        layerStyle (polygon) {
            this.highlightLayer ? this.highlightLayer.setFillOpacity(0.2) : '';
            this.$store.commit('map/setHighlightLayer', polygon);
            polygon.setFillOpacity(0.5);
        },
        addLayers () {
            // 启用绘图模式
            this.enabledDraw = true;

            // 添加Marker光标(必须初始坐标，否则最大地图级别添加空坐标marker时，覆盖物有少量偏移问题)
            this.hintMarker = new BMap.Marker(new BMap.Point(116.404, 39.915), this.styleMarker);
            this.map.addOverlay(this.hintMarker);
            // 添加提示标签
            this.hintLabel = new BMap.Label('', {offset: new BMap.Size(5, -25)});

            // 添加多边形区域
            this.polygon = new BMap.Polygon({}, Object.assign({enableClicking: false}, this.stylePolygon));
            this.polygon.setStrokeWeight(2);
            this.map.addOverlay(this.polygon);

            // 修改地图光标
            this.map.setDefaultCursor('crosshair');

            // 临时关闭地图双击放大
            this.map.disableDoubleClickZoom();

            // 单击创建一个多边形节点
            this.map.addEventListener('click', this.clickAction);

            // 双击完成绘制
            this.map.addEventListener('dblclick', this.dblclickAction);

            // 移动同步提示线
            this.map.addEventListener('mousemove', this.moveHintMarker);

            // 右键单击移除一个节点
            this.map.addEventListener('rightclick', this.rightclickAction);

            // 按下Esc事件 停用绘图模式
            document.addEventListener('keydown', this.escAction);
        },
        clickAction () {
            // 点数组长度大于 1 并且 点数组最后一个点坐标与当前点坐标相等
            // 防止创建相同点和自交点
            if (this.points.length > 1 && ClipperLib.op_Equality(this.points[this.points.length - 1], this.hintMarker.getPosition())) {
                return false;
            }

            this.points.push(this.hintMarker.getPosition());
            // 在当前位置拼接一个动态点，跟随鼠标移动
            var drawPoint = this.points.concat(this.hintMarker.getPosition());
            this.polygon.setPath(drawPoint);

            // 节点提示
            let marker = new BMap.Marker(this.hintMarker.getPosition(), this.styleMarker);
            this.map.addOverlay(marker);
            this.markers.push(marker);

            // 设置提示标题
            this.setLabelText();
        },
        moveHintMarker (e) {
            // 同步提示标题
            this.hintLabel.setPosition(e.point);
            // 同步marker光标
            this.hintMarker.setPosition(e.point);
            // 同步区域临时节点
            this.polygon.setPositionAt(this.points.length, e.point);

            // 如果启用了吸附功能，就执行它
            if (this.snappable) {
                // 假拖动事件 = 鼠标移动事件 e
                const fakeDragEvent = e;
                fakeDragEvent.target = this.hintMarker; // target 目标是 圆点提示光标
                fakeDragEvent.polygon = this.polygon; // polygon 多边形覆盖物
                // Snapping._handleSnapping(fakeDragEvent); // 处理吸附函数
            }
            // 如果禁止了自相交，就执行它
            // 暂停自交验证：单击事件触发的鼠标移动事件不执行自交验证，防止单击添加Marker后边框变红
            if (this.prohibitSelfIntersection) {
                this._handleSelfIntersection();
            }
        },
        setLabelText (text, styles) {
            // 提示错误信息后 2秒内不可修改标题
            if (this.updateLabelDate) {
                var now = new Date();
                if (now - this.updateLabelDate < 1000 * 2) {
                    return;
                }
                else {
                    this.updateLabelDate = null;
                }
            }

            // 默认修改标题背景成白色
            this.hintLabel.setStyle({backgroundColor: 'white'});

            // 节点为空 则移除提示标题
            if (this.points == null || this.points.length === 0) {
                this.map.removeOverlay(this.hintLabel);
            }
            else if (text) {
                // 如果有传入文本 则为错误提示标题
                this.hintLabel.setContent(text);
                // 背景改为黄色
                this.hintLabel.setStyle({backgroundColor: 'yellow'});
                // 初始化计时器 暂时不可改变标题
                this.updateLabelDate = new Date();
            }
            else if (this.doesSelfIntersect) {
                this.hintLabel.setContent('不能交叉画图');
            }
            else if (this.points.length === 1) {
                this.map.addOverlay(this.hintLabel);
                this.hintLabel.setContent('点击继续绘制');
            }
            else if (this.points.length >= 2) {
                this.hintLabel.setContent('点击继续绘制，双击结束，右键回退，Esc键清除');
            }
        },
        // 鼠标双击事件
        dblclickAction () {
            // 点数组长度 小于 3个坐标点 或 当前区域自交
            if (this.points.length < 3) return;
            if (this.doesSelfIntersect) {
                // 双击保存失败时，不添加点，移除最后一个点
                // 删除最后一个节点
                this.deleteAPoint();
                return;
            }
            this.polygon.setPath(this.points);

            // const loading = this.$loading({lock: true, text: '', spinner: 'el-icon-loading',});
            this.$store.commit('map/updateFullscreenLoadingMessage', '');
            this.$store.commit('map/updateFullscreenLoading', true);
            setTimeout(() => {
                try {
                    // 处理裁剪去重 (要裁剪的区域, 地图上的所有覆盖物)
                    const results = Clipper.execute(this.polygon, this.map.getOverlays());
                    // 添加裁剪后的区域 边线宽度覆盖为1
                    let _polygon = new BMap.Polygon(results, Object.assign(this.stylePolygon, {strokeWeight: 1}));
                    let obj = {
                        optins: results
                    };
                    this.$http.post('/mapData', {
                        layers: obj,
                        id: null
                    })
                        .then((res) => {
                            if (res.data.code == 1) {
                                this.$store.commit('map/setHighlightLayer', _polygon);
                                this.highlightLayer ? this.highlightLayer.setFillOpacity(0.2) : '';
                                console.log('区域保存成功');
                            }
                        });
                    this.map.addOverlay(_polygon);

                    // // 添加单击打开信息窗口
                    // _polygon.addEventListener("click", e => {
                    //     this.addInfoWindow({}, _polygon, e.point, this.hasPermission("drawLayer"));
                    // });

                    // // 打开编辑信息窗口
                    // this.addInfoWindowUpdate({}, _polygon, _polygon.getBounds().getCenter());

                    // // 关闭绘图
                    this.disableDraw();
                    this.$store.commit('map/updateFullscreenLoading', false);
                }
                catch (e) {
                    // 删除最后一个节点
                    this.deleteAPoint();
                    this.$store.commit('map/updateFullscreenLoading', false);
                    if (e.name === 'ClipperError') {
                        this.setLabelText(e.message);
                        return;
                    }
                    console.error(e);
                }
            }, 500);
        },
        // 停用绘图模式
        disableDraw () {
            if (!this.enabledDraw) {
                return;
            }

            // 停用绘图模式
            this.enabledDraw = false;

            // 清理吸附数据
            if (this.snappable) {
                Snapping._cleanupSnapping();
            }

            // 移除Marker光标
            this.map.removeOverlay(this.hintMarker);

            // 移除提示标题
            this.map.removeOverlay(this.hintLabel);

            // 移除多边形
            this.map.removeOverlay(this.polygon);

            this.markers.forEach(m => {
                this.map.removeOverlay(m);
            });

            // 清空数据
            this.points = [];
            this.markers = [];
            this.hintMarker = null;
            this.hintLabel = null;
            this.polygon = null;

            // 还原地图双击放大
            this.map.enableDoubleClickZoom();

            // 解除监听事件
            this.map.removeEventListener('click', this.clickAction);
            this.map.removeEventListener('dblclick', this.dblclickAction);
            this.map.removeEventListener('mousemove', this.moveHintMarker);
            this.map.removeEventListener('rightclick', this.rightclickAction);
            // 按下Esc事件 停用绘图模式
            document.removeEventListener('keydown', this.escAction);

            // 重置地图光标
            this.map.setDefaultCursor('url(\'http://api0.map.bdimg.com/images/openhand.cur\'), default');
        },
        deleteAPoint () {
            // 删除最后一个节点
            this.points.pop();

            // 移除节点对应的marker
            this.map.removeOverlay(this.markers[this.markers.length - 1]);
            this.markers.pop();

            // 拼接一个临时点 位置为提示marker坐标
            var drawPoint = this.points.concat(this.hintMarker.getPosition());

            // 设置区域坐标点
            this.polygon.setPath(drawPoint);
        },
        rightclickAction () {
            if (this.points.length === 0) {
                return;
            }

            // 删除最后一个节点
            this.deleteAPoint();

            // 如果禁止了自相交，就执行它
            if (this.prohibitSelfIntersection) {
                this._handleSelfIntersection();
            }
        },
        _handleSelfIntersection () {
            // 防止低版本浏览器单击事件触发移动事件
            // 扩展运算符数组深拷贝
            let [...paths] = this.polygon.getPath();
            // 如果最后一个点与提示marker光标坐标相同，则移除最后一个点
            if (this.points.length >= 3 && ClipperLib.op_Equality(this.points[this.points.length - 1], this.hintMarker.getPosition())) {
                paths.pop();
            }

            // 好的，我们需要检查这里的自相交。
            // 检查自相交
            this.doesSelfIntersect = ClipperLib.containKinks(GeoJSON.toGeoJSON(paths));

            // 修改自交样式
            if (this.doesSelfIntersect) {
                // this.polygon.setStrokeColor('red');
                this.setLabelText();
            }
            else {
                // this.polygon.setStrokeColor(this.stylePolygon.strokeColor);
                this.setLabelText();
            }
        },
        escAction (e) {
            // 点击键盘Esc键
            if (e.keyCode === 27) {
                this.disableDraw();
            }
        }
    },
    computed: {
        ...mapState({
            highlightLayer: state => state.map.highlightLayer
        })
    }
};
</script>

<style scoped>
.home_content {
  flex: 1;
  position: relative;
}
#map{
    width: 100%;
    height: 100%;
}
.map_top{
    position: absolute;
    background: rgb(14, 206, 240, 0.8);
    color: rgb(0, 217, 255);
    border-radius: 8px;
    padding: 3px 20px;
    top:15px;
    left: 50px;
}
.icon_addLayers{
    font-size: 26px;
}
</style>
