$(function(){
    // 初始化滑动组件
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators:false
    });
    /*初始化上拉下拉*/
    // 用户下拉的时候 根据当前条件刷新 上拉加载重置 排序功能也重置
    mui.init({
        pullRefresh: {
            // 下拉容器
            container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                auto:true,
                callback: function(){
                     // 初始化页面。自动下拉刷新
                    var that = this;
                    /*定义一个全局的下拉组件对象 使用里面的方法*/

                    // window.down = this;
                    setTimeout(function(){
                        getCartData(function(data){
                            // 渲染页面
                            $('.mui-table-view').html(template('cart',data));
                            // console.log(data);

                                // 加载状态隐藏
                            that.endPulldownToRefresh()
                            setAmount();
                        });
                        /*注册刷新时间，防止多次绑定，先解绑再次绑定*/
                        // 点击刷新按钮 刷新
                        $('.fa-refresh').off('click').on('tap',function(){
                            that.pulldownLoading();
                            // setAmount();
                        });

                    },1000);

                }
            },

        }
    });

// 初始化页面。即自动下拉刷新
// 侧滑点击编辑，弹出对话框（尺码，数量）
    $('.mui-table-view').on('tap','.mui-icon-compose',function(){
            // 弹窗的内容
        // 默认的子字符串 转成html格式的字符串

        /*获取当前按钮对应的商品数据 */
        // 根据ID缓存获取
        var id = $(this).parent().attr('data-id');
        var item = lt.getItemById(window.cartData.data,id)
        console.log(item);
        var html = template('edit',item);

/*confirm在使用字符串作为内容的时候，/n 等于加上br /t 等于默认空格 使用 正则替换 */
        mui.confirm(html.replace(/\n/g,''), '商品编辑',['确认','取消'],function(e) {
            if(e.index == 0) {
                var size = $('.btn_size.now').html();
                var num = $('.p_number input').val();
                lt.loginAjax({
                    type: 'post',
                    url: '/cart/updateCart',
                    data: {
                        id: id,
                        size: size,
                        num: num
                    },
                    dataType: 'json',
                    success: function(data){
                        if(data.success == true){
                           /* 窗口关闭
                            列表更新*/
                           item.num = num;
                           item.size = size;
                           /*缓存的数据 window.cartData.data 已修改 指向同一个数据，保存在栈中*/
                            /*渲染页面*/
                            $('.mui-table-view').html(template('cart',window.cartData));
                            // 整个列表重新渲染
                        }
                    }

                })
            }else{

            }

        });
    });


    $('body').on('tap','.btn_size', function(){
        $(this).addClass('now').siblings().removeClass('now');
    });
    $('body').on('tap','span',function(){
        var $input = $(this).siblings('input');
        var currNum = $input.val();
        var maxNum = parseInt($input.attr('data-max'));  /*要把字符串转成数字*/
        if($(this).hasClass('jian')){
            if(currNum<=1){
                mui.toast('至少需要一件商品');
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
//     侧滑点击删除，弹出确认框
    $('.mui-table-view').on('tap','.mui-icon-trash',function(){
        var $this = $(this);
        var id = $this.parent().attr('data-id');
        mui.confirm('您确认是否删除该商品', '商品删除',['确认','取消'],function(e) {
            if(e.index == 0) {
                lt.loginAjax({
                    type: 'get',
                    url: '/cart/deleteCart',
                    data: {
                        id: id
                    },
                    dataType: 'json',
                    success: function(data){
                        if(data.success == true){
                            /* 窗口关闭
                             列表更新*/
                         $this.parent().parent().remove();
                            setAmount();
                        }
                    }

                })

            }else{

            }

        });

    });


    /*$('.fa-refresh').on('tap',function(){
        // 刷新 触发下拉操作
        mui('#refreshContainer').pullRefresh().pulldownLoading();
    })*/
//     点击复选框，计算总金额
$('.mui-table-view').on('change','[type=checkbox]',function(){
/*总金额= 每个商品的数量*单价的总和*/
    setAmount();

});

});
var setAmount = function(){
    /*所有选中的复选框*/
    var $checkedBox = $('[type=checkbox]:checked');
    /*获取选中商品的ID*/
    var amountSum = 0;
    $checkedBox.each(function(i,item){
        var id = $(this).attr('data-id');
        var item = lt.getItemById(window.cartData.data,id);
        var num = item.num;
        var price = item.price;
        var amount = num*price;
        amountSum += amount;
    });
   /* amountSum= Math.floor(amountSum*100)/100;*/

    if(Math.floor(amountSum*100)%10){
        amountSum= Math.floor(amountSum*100)/100;
    }else{
        amountSum= Math.floor(amountSum*100)/100;
       amountSum = amountSum.toString()+'0';
    }
        console.log(amountSum);
    $('#cartAmount').html(amountSum);
};

var getCartData = function(callback){
    lt.loginAjax({
        type: 'get',
        url: '/cart/queryCartPaging',
        data: {
            // 不产生分页
            page: 1,
            pageSize: 100,
        },
        dataType: 'json',
        success: function(data){
            /*缓存的数据*/
            window.cartData = data;
            console.log(data);
            callback && callback(data);
        }
    });
}

