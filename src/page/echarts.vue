<template>
  <div id="echartsBox">
    <div id="echarts" :style="{width: '300px', height: '300px'}"></div>
    <div id="echartsPie" :style="{width: '100%', height: '500px'}"></div>
  </div>
</template>

<script>
export default {
    data () {
        return {

        };
    },
    mounted () {
        this.drawLine();
    },
    methods: {
        drawLine () {
        // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('echarts'));
            let myChartPie = this.$echarts.init(document.getElementById('echartsPie'));
            // 绘制图表
            let dataName = ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'];
            let dataCont = [5, 20, 36, 10, 10, 20];
            myChart.setOption({
                title: { text: '在Vue中使用echarts' },
                tooltip: {},
                xAxis: {
                    data: dataName
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: dataCont
                }]
            });
            setTimeout(() => {
                dataName.push('卫衣');
                dataCont.push(15);
                myChart.setOption({
                    xAxis: {
                        data: dataName
                    },
                    series: [{
                        data: dataCont
                    }]
                });
            }, 3000);
            let optionPie = {
                title: {
                    text: '南丁格尔玫瑰图',
                    subtext: '纯属虚构',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    x: 'center',
                    y: 'bottom',
                    data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {
                            show: true,
                            type: ['pie', 'funnel']
                        },
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                series: [
                    {
                        name: '半径模式',
                        type: 'pie',
                        radius: [20, 110],
                        center: ['25%', '50%'],
                        roseType: 'radius',
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        lableLine: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        data: [
                            {value: 10, name: 'rose1'},
                            {value: 5, name: 'rose2'},
                            {value: 15, name: 'rose3'},
                            {value: 25, name: 'rose4'},
                            {value: 20, name: 'rose5'},
                            {value: 35, name: 'rose6'},
                            {value: 30, name: 'rose7'},
                            {value: 40, name: 'rose8'}
                        ]
                    },
                    {
                        name: '面积模式',
                        type: 'pie',
                        radius: [30, 110],
                        center: ['75%', '50%'],
                        roseType: 'area',
                        data: [
                            {value: 10, name: 'rose1'},
                            {value: 5, name: 'rose2'},
                            {value: 15, name: 'rose3'},
                            {value: 25, name: 'rose4'},
                            {value: 20, name: 'rose5'},
                            {value: 35, name: 'rose6'},
                            {value: 30, name: 'rose7'},
                            {value: 40, name: 'rose8'}
                        ]
                    }
                ]
            };
            myChartPie.setOption(optionPie);
        }
    }
};
</script>
