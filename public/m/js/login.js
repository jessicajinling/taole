$(function(){


    $('#submit').on('tap',function(){
        // 序列化表单 需要name属性
        var data = $('form').serialize()
        // console.log(data)

        var dataObject = lt.serialize2object(data);
        // console.log(dataObject);


        // 校验
        if(!dataObject.username){
            mui.toast('请输入用户名');
            return false;
        }
        if(!dataObject.password){
            mui.toast('请输入密码');
            return false;
        }

        $.ajax({
            type: 'post',
            url: '/user/login',
            data: dataObject,
            dataType: 'json',
            success: function(data){
                console.log(data);
                // 如果成功 根据地址跳转
                // 如果没有地址，跳转到个人中心
                if(data.success==true){
                    // 登录成功
                    var returnUrl = location.search.replace('?returnUrl=','');
                    if(returnUrl){
                        location.href = returnUrl;
                    }else{
                        location.href = lt.userUrl;
                    }
                }else{
                    mui.toast(data.message);
                }

            }
        })
    })



});