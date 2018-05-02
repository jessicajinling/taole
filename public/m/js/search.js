$(function(){
    $('.lt_search a').on('tap',function(){
        // 获取关键字
        var key = $.trim($('input').val());
        // 判断，没有关键字就提醒用户输入
        if(!key){
            mui.toast('请输入关键字');
            // return false
        }else{
            location.href = 'searchList.html?key='+key;
        }

    })
})