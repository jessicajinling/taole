$(function(){

    getUserIndexData(function(data){
        var mobile = data.mobile||'暂无';
        $('.mui-media-body').html(data.username+'<p class="mui-ellipsis">绑定手机:'+data.mobile+'</p>');
    });

    $('body').on('tap','.btn_outLogin',function(){
        getLoginOutData(function(data){
            if(data.success){
                location.href = lt.loginUrl;
            }
        });
    });
});
var getUserIndexData = function(callback){
    $.ajax({
        type:'get',
        url:'/user/queryUserMessage',
        data:'',
        dataType:'json',
        success:function(data){
            callback && callback(data);
            console.log(data);
        }
    });
};
var getLoginOutData = function(callback){
    $.ajax({
        type:'get',
        url:'/user/logout',
        data:'',
        dataType:'json',
        success:function(data){
            console.log(data);
            callback && callback(data);
        }
    });
};