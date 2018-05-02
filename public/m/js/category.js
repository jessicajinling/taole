$(function () {
// 一级分类默认渲染，同时实现第一个一级分类对应的二级分类的渲染
    getFirstCategoryData(function (data) {

        $('.cate_left ul').html(template('firstTemplate',data));
        // initSecondTapHandle();

        var categoryId = $('.cate_left ul li:first-child').find('a').attr('data-id');
        render(categoryId )

    })

// 二级分类
//     一级分类对应的二级分类
//     var initSecondTapHandle = function(){
//         $('.cate_left ul li').on('tap',function(e){
//             console.log(e)
//         })
//     }

    $('.cate_left').on('tap','a',function(e){
        // 当前选中不去加载
        // if($(this).parent.hasClass('now')) return false;
        // 样式选中功能
        $('.cate_left li').removeClass('now');
        $(this).parent().addClass('now');
        // 二级分类渲染
        var categoryId = $(this).attr('data-id');
        render(categoryId);


    });
});


// 获取一级分类数据
var getFirstCategoryData = function(callback){
    $.ajax({
        url:"/category/queryTopCategory",
        type:'get',
        data:'',
        dataType:'json',
        success: function(data){
            // console.log(data)
            callback && callback(data);
        }
    });
};
// 获取二级分类的数据
var getSecondCategoryData = function (params,callback) {
    $.ajax({
        url:"/category/querySecondCategory",
        type:'get',
        data:params,
        dataType:'json',
        success: function(data){
            // console.log(data);
            callback && callback(data);
        }
    });
};

// 二级分类渲染
var render = function (categoryId) {
    getSecondCategoryData({
        id:categoryId
    },function(data){
        // 二级分类渲染
        // console.log(data)
        $('.cate_right ul').html(template('secondTemplate',data))
    });
}