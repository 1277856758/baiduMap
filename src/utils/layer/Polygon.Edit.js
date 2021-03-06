import {ClipperLib, LineUtil, Clipper, Snapping} from './Polygon.Plugin';

const img_solid = '/static/img/HT.png';
const img_hollow = '/static/img/HT1.png';

function disable () {
    // 如果区域编辑模式未启用 则不需要禁用它
    if (!this.enabled) return;

    this.enabled = false;

    // 清除实心和空心点
    for (var i = 0; i < this.markers.length; i++) {
        this.getMap().removeOverlay(this.markers[i]);
    }

    // markers数组置空
    this.markers = [];
}

const PolygonEdit = {
    data: function () {
        return {
            icon_solid: null,
            icon_hollow: null
        };
    },
    methods: {

        // 切换编辑模式
        toggleEdit (layer) {
            if (!layer.enabled) {
                this.enableEdit(layer);
            }
            else {
                this.disableEdit(layer);
            }
        },

        enableEdit (layer) {
            if (layer == null) {
                return;
            }

            if (!this.map) {
                this.map = layer.getMap();
            }

            if (layer.enabled) {
                return;
            }

            layer.enabled = true;

            layer.markers = [];

            layer.disable = disable;

            this.map.closeInfoWindow();

            // 初始化编辑节点
            this._initMarkers(layer);
        },

        disableEdit (layer) {
            if (!layer.enabled) {
                return;
            }
            if (layer.dcId == null) {
                // try {
                //     const results = Clipper.execute(layer, this.map.getOverlays()); // 处理裁剪去重 (要裁剪的区域, 获取所有覆盖物)
                //
                //     // 关闭区域编辑节点状态
                //     layer.disable && (layer.disable());
                //
                //     // 设置区域节点为裁剪后的节点
                //     layer.setPath(results);
                //     this.$notify({
                //         message: "保存成功",
                //         type: "success"
                //     })
                // } catch (e) {
                //     this.$notify({
                //         message: e.message,
                //         type: "error"
                //     })
                // }

                return;
            }
            this.$store.commit('updateFullscreenLoadingMessage', '拼命加载中');
            this.$store.commit('updateFullscreenLoading', true);
            setTimeout(() => {
                try {
                    const results = Clipper.execute(layer, this.map.getOverlays()); // 处理裁剪去重 (要裁剪的区域, 获取所有覆盖物)

                    // 保存节点
                    this.updatePloygon(layer.dcId, LineUtil.toPathString(results));

                    // 关闭区域编辑节点状态
                    layer.disable && (layer.disable());

                    // 设置区域节点为裁剪后的节点
                    layer.setPath(results);
                    this.$store.commit('updateFullscreenLoading', false);
                }
                catch (e) {
                    this.$store.commit('updateFullscreenLoading', false);
                    if (e.name === 'ClipperError') {
                        this.$alertBox(e.message);
                        return;
                    }
                    console.error(e);
                }
            }, 500);
        },
        /**
         * 初始化区域对应的节点
         * @param layer
         * @private
         */
        _initMarkers (layer) {
            // 实心块
            this.icon_solid || (this.icon_solid = new BMap.Icon(img_solid, new BMap.Size(8, 8)));
            // 空心块
            this.icon_hollow || (this.icon_hollow = new BMap.Icon(img_hollow, new BMap.Size(8, 8)));

            let paths = layer.getPath();
            // 如果起点与终点坐标相等 则删除终点并修改区域节点
            if (ClipperLib.op_Equality(paths[0], paths[paths.length - 1])) {
                paths.pop();
                layer.setPath(paths);
            }
            const length = paths.length;
            for (var i = 0; i < length; i++) {
                this.createEditMarker(layer, paths[i], this.icon_solid, i * 2, 0, 'solid');
                var point = LineUtil.getCenterPoint(paths[i], i + 1 === length ? paths[0] : paths[i + 1]);
                this.createEditMarker(layer, point, this.icon_hollow, i * 2 + 1, 1, 'hollow');
            }
        },
        /**
         * 创建编辑节点
         * @param layer 区域
         * @param point 坐标点
         * @param icon 图标
         * @param index 索引位置
         * @param genre 0 节点, 1 中心点
         * @param type solid 实心点, hollow 空心点
         */
        createEditMarker (layer, point, icon, index, genre, type) {
            var marker = new BMap.Marker(point, {icon: icon});
            marker.genre = genre;
            marker.type = type;
            // 开启拖拽功能
            marker.enableDragging();

            // 判断是在角上的节点 还是在线上的中心点
            if (genre == 0) {
                // 初始化实心点
                this._initSolid(layer, marker);
            }
            else if (genre == 1) {
                // 初始化空心点
                this._initHollow(layer, marker);
            }

            // 添加marker节点
            this.map.addOverlay(marker);

            // 插入区域对象markers节点数组中
            layer.markers.splice(index, 0, marker);
        },

        /**
         * 获取索引位置
         * @param point
         * @param markers
         * @param genre
         * @returns {*}
         */
        getIndexPoint (point, markers, genre) {
            var obj = null;
            // 返回数组中第一个相等的元素索引
            var index = markers.findIndex(p => point.equals(p.getPosition()));

            if (index == -1) {
                return null;
            }

            if (genre == 0) { // 实点
                if (index % 2 != 0) {
                    console.error('取点错误,不是实点');
                }
                obj = {
                    index: index,
                    indexBefore: index == 0 ? markers.length - 2 : index - 2,
                    indexAfter: index == markers.length - 2 ? 0 : index + 2,
                    moveBefore: index == 0 ? markers.length - 1 : index - 1,
                    moveAfter: index + 1,
                    indexWill: index == 0 ? markers.length - 3 : index - 1
                };
            }
            if (genre == 1) { // 空点
                if (index % 2 != 1) {
                    console.error('取点错误,不是虚点');
                }
                obj = {
                    index: index,
                    indexBefore: index - 1,
                    indexAfter: index == markers.length - 1 ? 0 : index + 1,
                    willBefore: index,
                    willAfter: index == markers.length - 1 ? markers.length + 2 : index + 2
                };
            }
            return obj;
        },

        /**
         * 初始化实心点
         * @param layer 区域
         * @param marker 点
         * @private
         */
        _initSolid (layer, marker) {
            // 实心点层级高于空心点
            marker.setZIndex(1);

            var solidRightclickAction = () => {
                var paths = layer.getPath();
                if (paths.length > 3) {
                    // index, indexBefore, indexAfter, moveBefore, moveAfter
                    var obj = this.getIndexPoint(marker.getPosition(), layer.markers, marker.genre);
                    this.map.removeOverlay(layer.markers[obj.index]);
                    this.map.removeOverlay(layer.markers[obj.moveBefore]);
                    this.map.removeOverlay(layer.markers[obj.moveAfter]);
                    var point_before = layer.markers[obj.indexBefore].getPosition();
                    var point_after = layer.markers[obj.indexAfter].getPosition();
                    var pt = LineUtil.getCenterPoint(point_before, point_after);
                    delete layer.markers[obj.index];
                    delete layer.markers[obj.moveBefore];
                    delete layer.markers[obj.moveAfter];
                    var newmarkers = layer.markers.filter(val => {
                        return val != undefined;
                    });
                    layer.markers = newmarkers;
                    this.createEditMarker(layer, pt, this.icon_hollow, obj.indexWill, 1, 'hollow');
                    paths.splice(obj.index / 2, 1);
                    layer.setPath(paths);
                }
            };
            var solid_sbindex = -1;// 操作点的序号
            var solid_index_before = -1;// 前一个实心点序号
            var solid_index_after = -1;// 后一个实心点序号
            var solid_move_before = -1;// 前一个要动的点序号
            var solid_move_after = -1;// 后一个要动的点序号
            var solid_pt_before = null;// 前一个动点坐标
            var solid_pt_after = null;// 后一个动点坐标
            var solidDraggingAction = (e) => {
                solid_pt_before = LineUtil.getCenterPoint(layer.markers[solid_index_before].getPosition(), e.point);
                solid_pt_after = LineUtil.getCenterPoint(e.point, layer.markers[solid_index_after].getPosition());
                layer.markers[solid_sbindex].setPosition(e.point);// 设置拖拽点的坐标
                layer.markers[solid_move_before].setPosition(solid_pt_before);// 设置前一个动点的坐标
                layer.markers[solid_move_after].setPosition(solid_pt_after);// 设置后一个动点的坐标
                layer.setPositionAt(solid_sbindex / 2, e.point);// 设置多边形当前点的坐标位置
            };
            var solidDragendAction = () => {
                marker.removeEventListener('dragging', solidDraggingAction);
                marker.removeEventListener('dragend', solidDragendAction);
            };
            var solidDragstartAction = () => {
                // index, indexBefore, indexAfter, moveBefore, moveAfter
                var obj = this.getIndexPoint(marker.getPosition(), layer.markers, marker.genre);
                solid_sbindex = obj.index;
                solid_index_before = obj.indexBefore;
                solid_index_after = obj.indexAfter;
                solid_move_before = obj.moveBefore;
                solid_move_after = obj.moveAfter;
                marker.addEventListener('dragging', solidDraggingAction);
                marker.addEventListener('dragend', solidDragendAction);
            };
            marker.addEventListener('dragstart', solidDragstartAction);
            marker.addEventListener('rightclick', solidRightclickAction);
        },

        /**
         * 初始化空心点
         * @param layer 区域
         * @param marker 点
         * @private
         */
        _initHollow (layer, marker) {
            // 空心点层级低于实心点
            marker.setZIndex(0);

            var hollowRightclickAction = () => {
                // index, indexBefore, indexAfter, willBefore, willAfter
                var obj = this.getIndexPoint(marker.getPosition(), layer.markers, marker.genre);
                var pt = layer.markers[obj.index].getPosition();
                this.map.removeOverlay(layer.markers[obj.index]);
                layer.markers.splice(obj.index, 1);
                this.createEditMarker(layer, pt, this.icon_solid, obj.index, 0, 'solid');
                var paths = layer.getPath();
                paths.splice((obj.index + 1) / 2, 0, pt);
                layer.setPath(paths);
                var pt_before = LineUtil.getCenterPoint(layer.markers[obj.indexBefore].getPosition(), pt);
                var pt_after = LineUtil.getCenterPoint(pt, layer.markers[obj.indexAfter].getPosition());
                this.createEditMarker(layer, pt_before, this.icon_hollow, obj.willBefore, 1, 'hollow');
                this.createEditMarker(layer, pt_after, this.icon_hollow, obj.willAfter, 1, 'hollow');
                return obj.index + 1;
            };
            var hollow_sbindex = -1;
            var hollow_index_before = -1;
            var hollow_index_after = -1;
            var hollow_will_before = -1;
            var hollow_will_after = -1;
            var ovlindex = -1;
            var hollowDraggingAction = (e) => {
                marker.setPosition(e.point);
                layer.setPositionAt(ovlindex, e.point);
            };
            var hollowDragendAction = (e) => {
                layer.setPositionAt(ovlindex, e.point);
                this.map.removeOverlay(layer.markers[hollow_sbindex]);
                layer.markers.splice(hollow_sbindex, 1);
                this.createEditMarker(layer, e.point, this.icon_solid, hollow_sbindex, 0, 'solid');
                var pt_before = LineUtil.getCenterPoint(layer.markers[hollow_index_before].getPosition(), e.point);
                var pt_after = LineUtil.getCenterPoint(e.point, layer.markers[hollow_index_after].getPosition());
                this.createEditMarker(layer, pt_before, this.icon_hollow, hollow_will_before, 1, 'hollow');
                this.createEditMarker(layer, pt_after, this.icon_hollow, hollow_will_after, 1, 'hollow');
                marker.removeEventListener('dragging', hollowDraggingAction);
                marker.removeEventListener('dragend', hollowDragendAction);
            };
            var hollowDragstartAction = () => {
                // index, indexBefore, indexAfter, willBefore, willAfter
                var obj = this.getIndexPoint(marker.getPosition(), layer.markers, marker.genre);
                hollow_sbindex = obj.index;
                hollow_index_before = obj.indexBefore;
                hollow_index_after = obj.indexAfter;
                hollow_will_before = obj.willBefore;
                hollow_will_after = obj.willAfter;
                ovlindex = (obj.index + 1) / 2;
                var paths = layer.getPath();
                paths.splice(ovlindex, 0, marker.getPosition());
                layer.setPath(paths);
                marker.addEventListener('dragging', hollowDraggingAction);
                marker.addEventListener('dragend', hollowDragendAction);
            };
            marker.addEventListener('dragstart', hollowDragstartAction);
            marker.addEventListener('rightclick', hollowRightclickAction);
        }
    }
};

export default PolygonEdit;
