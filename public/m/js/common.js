var lt = {};
lt.getParamsByUrl = function () {
    var params = {};
    var search = location.search;
    if (search) {
         search = search.replace("?","");
        var arr = search.split('&');
        arr.forEach(function(item,i){
            var itemArr = item.split('=');
            params[itemArr[0]] = itemArr[1];
        });
    };
    // console.log(params);
    return params;
};
// json 不支持IE 6.7 办法 json2.js 解决json不兼容的问题
lt.serialize2object = function(serializeStr){
    var obj = {};
    if(serializeStr){
        var arr = serializeStr.split('&');
        arr.forEach(function(item,i){
            var itemArr = item.split('=');
            obj[itemArr[0]] = itemArr[1];
        })
    }
    return obj;
};

// 需要登录的ajax请求
lt.loginUrl = '/m/user/login.html';
lt.cartUrl = '/m/user/cart.html';
lt.userUrl = '/m/user/index.html';

lt.getItemById = function (arr,id){
    var obj = null;
    arr.forEach(function(item,i){
        if(item.id == id){
            obj = item;
        }
    });
    return obj;
}

lt.loginAjax = function(params){
    $.ajax({
        type: params.type || 'get',
        url: params.url || '#',
        data: params.data || '',
        dataType: params.dataType || 'json',
        success: function(data){
            // 未登录的处理{error: 400, message: "未登录！"}
            // 所有需要登录的接口，没有登录返回这个数据
            if(data.error==400) {
                // 跳到登录页，把当前地址传给登录页面，当登陆成功按照这个页面跳转回来
                location.href = lt.loginUrl + '?returnUrl=' + location.href;
                return false;
            }else{
                 params.success && params.success(data);
            }
        },
        error: function(){
            mui.toast('服务器忙')
        }
    });
};

