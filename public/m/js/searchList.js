$(function () {
    // 区域滚动
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false
    });

    // 页面初始化时关键字在输入框内显示
    var urlParams = lt.getParamsByUrl();
    var $input = $('input').val(urlParams.key || '');
    // console.log(urlParams);
    // 页面初始化时根据关键字查询第一页4条数据
    // 下拉刷新配置自动执行，重复操作
    // getSearchData({
    //     proName: urlParams.key,
    //     page: 1,
    //     pageSize: 4
    // }, function (data) {
    //     // 渲染数据
    //     $('.lt_product').html(template('list', data));
    // });

    // 用户点击搜索的时候，根据新的关键字搜索商品
    $('.lt_search a').on('tap', function () {
        var key = $.trim($input.val());
        if (!key) {
            mui.toast('请输入关键字');
            return false
        }
        getSearchData({
            proName: key,
            page: 1,
            pageSize: 4
        }, function (data) {
            // 渲染数据
            $('.lt_product').html(template('list', data));
        });
    });
    // 用户点击排序时，根据排序的选项进行排序（默认的时候是降序，再次点击为升序）
    $('.lt_order a').on('tap',function(){
        // 没有now的时候
        if(!$(this).hasClass('now')){
            $(this).addClass('now').siblings().removeClass('now')
                .find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
        }else{ /*有now的时候*/
            if($(this).find('span').hasClass('fa-angle-down')){
                $(this).find('span').removeClass('fa-angle-down').addClass('fa-angle-up')
            }else{
                $(this).find('span').removeClass('fa-angle-up').addClass('fa-angle-down')
            }
        }

        // 排序的类型
        var order = $(this).attr('data-order');
        // 升序降序
        var orderVal = $(this).find('span').hasClass('fa-angle-down') ? 2 : 1;
        var key = $.trim($input.val());
        if (!key) {
            mui.toast('请输入关键字');
            return false
        }
        var params = {
            proName: key,
            page: 1,
            pageSize: 4
        };
        params[order] = orderVal;

        // 获取数据
        getSearchData(params,function(data){
            // console.log(data);
            $('.lt_product').html(template('list', data));
        })


    });
    // 用户下拉的时候 根据当前条件刷新 上拉加载重置 排序功能也重置
    mui.init({
        pullRefresh: {
            // 下拉容器
            container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                auto: true, //可选,默认false.首次加载自动上拉刷新一次
                //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                callback: function(){
                    // 组件对象
                    var that = this;
                    var key = $.trim($input.val());
                    if (!key) {
                        mui.toast('请输入关键字');
                        return false
                    }
                    // 排序功能重置
                    $('.lt_order a').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');

                    getSearchData({
                    proName: key,
                    page: 1,
                    pageSize: 4
                    }, function (data) {
                    // 渲染数据
                    $('.lt_product').html(template('list', data));
                    // 停止下拉刷新
                    that.endPulldownToRefresh();
                    /*上拉加载重置*/
                        that.refresh(true);
                    });
                }
            },
            /*上拉*/
            // 用户上拉的时候，加载下一页（没有数据不加载）
            up : {
                callback : function(){
                    window.page ++;
                    var that = this;
                    var key = $.trim($input.val());
                    if (!key) {
                        mui.toast('请输入关键字');
                        return false;
                    }
                    var order = $('.ct_order a.now').attr('data-order');
                    // 升序降序
                    var orderVal = $(this).find('span').hasClass('fa-angle-down') ? 2 : 1;

                    var params = {
                        proName: key,
                        page: window.page,
                        pageSize: 4
                    };
                    params[order] = orderVal;
                    getSearchData(params, function (data) {
                        // 渲染数据
                        $('.lt_product').append(template('list', data));
                        // 停止下拉刷新
                        if(data.data.length){
                            that.endPullupToRefresh();
                        }else{
                            that.endPullupToRefresh(true);
                        }

                    });
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });




});
var getSearchData = function (params, callback) {
    $.ajax({
        url: '/product/queryProduct',
        type: 'get',
        data: params,
        dataType: 'json',
        success: function (data) {
            // 存当前页码
            // console.log(data)
            window.page = data.page;
            callback && callback(data);
        }
    });
};