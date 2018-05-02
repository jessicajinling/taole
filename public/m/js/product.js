$(function() {
    var id = lt.getParamsByUrl().productId;
    getProductData(id,function(data){
    // 清除加载状态
        $('.loading').remove();
        // 渲染商品详情页
        $('.mui-scroll').html(template('detail',data));
        // 初始化轮播图
        mui('.mui-slider').slider({
            interval:2000
        });
        // 初始化滑动组件
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            indicators:false
        });

        // 尺码的选择
        $('.btn_size').on('tap',function(){
            $(this).addClass('now').siblings().removeClass('now');
        });
        // 数量的选择
        $('.p_number span').on('tap',function(){
            var currNum = $(this).siblings('input').val();
            var maxNum = parseInt($(this).siblings('input').attr('data-max'));  /*要把字符串转成数字*/
            if($(this).hasClass('jian')){
                if(currNum==0){
                    mui.toast('不能再减啦');
                    return false;
                }
                currNum --;
            }else{
                if(currNum>=maxNum){
                    mui.toast('库存不足');
                    return false;
                }
                currNum ++;
            }
            // console.log(maxNum);
            $(this).siblings('input').val(currNum);
        })

        // 加入购物车
        $('.btn_addCart').on('tap',function(){
            // 数据校验
            var $changeBtn = $('.btn_size.now');
            if(!$changeBtn.length) {
                setTimeout(mui.toast('请选择尺码'), 2000)
                return false;
            };

            var  num = $('.p_number input').val();
            if(num <= 0){
                mui.toast('请选择数量');
                return false;
            }

            // 提交数据
            lt.loginAjax({
                url:'/cart/addCart',
                type: 'post',
                data: {
                    productId: id,
                    num: num,
                    size: $changeBtn.html()
                },
                dataType:'json',
                success: function(data){
                    // console.log(data)
                    if(data.success == true){
                        mui.confirm('添加成功，去购物车看看？','温馨提示',['是','否'],function(e){
                            if(e.index == 0){
                                location.href = lt.cartUrl;
                            }else{
                                // 什么都不做
                            }
                        })
                    }
                }
            });
        });
    });
});

var getProductData = function(productId,callback){
    $.ajax({
        url: '/product/queryProductDetail',
        type: 'get',
        data: {
            id:productId
        },
        dataType: 'json',
        success : function(data){
            // console.log(data);
            callback && callback(data);
        }
    })
};