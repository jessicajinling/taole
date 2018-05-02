$(function(){
    barCharts();
    pieCharts();
});


var barCharts = function() {
    /*获取数据*/
    var data = [{
        name: '1月',
        value: 300
        },
        {
            name: '2月',
            value: 400
        },
        {
            name: '3月',
            value: 500
        },
        {
            name: '4月',
            value: 200
        }
    ];
    var xdata = [], ydata = [];
    data.forEach(function(item,i){
        xdata.push(item.name);
        ydata.push(item.value);
    });


    /*引入eacharts.min.js文件 */
    /*找到画图的容器*/
    var box = document.querySelector('.picTable:first-child');
    /*初始化插件*/
    var myChart = echarts.init(box);
    /*配置参数*/
    var option = {
        title: {
          text: '2017年注册人数'
        },
        legend: {
            data: ['注册人数']
        },
        tooltip : {
        },

        xAxis : [
            {
                data : [],

            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'注册人数',
                type:'bar',
                barWidth: '60%',
                data:[]
            }
        ]
    }
    option.xAxis[0].data = xdata;
    option.series[0].data = ydata;
    /*设置参数*/
    myChart.setOption(option);

}


var pieCharts = function(){

    /*引入eacharts.min.js文件 */
    /*找到画图的容器*/
    var box = document.querySelector('.picTable:last-child');
    /*初始化插件*/
    var myChart = echarts.init(box);
    /*配置参数*/
    var option = {
        title : {
            text: '热门品牌销售',
            subtext: '2017年10月',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['李宁','耐克','阿迪达斯','匡威','搜索引擎']
        },
        series : [
            {
                name: '销售情况',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'李宁'},
                    {value:310, name:'耐克'},
                    {value:234, name:'阿迪达斯'},
                    {value:135, name:'匡威'},
                    {value:1548, name:'搜索引擎'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }

    /*设置参数*/
    myChart.setOption(option);
}
