$(function(){
    // 初始化校验插件
    /*是form表单结构。并且有一个提交按钮 */
/*就是JQ插件 样式和bootstrap一致*/
    $('#login').bootstrapValidator({
            feedbackIcons: {/*input状态样式图片*/
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                /*验证：规则*/
                username: {//验证input项：验证规则
                    validators: {
                        notEmpty: {//非空验证：提示消息
                            message: '用户名不能为空'
                        },
                        /*验证后台数据*/
                        callback: {
                            message: '用户名错误'
                        }

                    }
                },
                password: {
                    validators: {
                        notEmpty: {
                            message: '密码不能为空'
                        },
                        stringLength: {
                            min: 6,
                            max: 30,
                            message: '用户名长度必须在6到30之间'
                        },
                        callback: {
                            message: '密码错误'
                        }

                    }
                },



            }
    }).on('success.form.bv', function(e) {//点击提交之后
        /*校验成功时触发 */
            // Prevent form submission
        /*阻止表单的默认提交*/
            e.preventDefault();
            console.log(e.target);
            /*后台校验用户名和密码*/
        var $form = $(e.target);
        $.ajax({
            type: 'post',
            url: '/employee/employeeLogin',
            data: $form.serialize(),
            dataType: 'json',
            success: function(data){
                /*业务成功*/
                if(data.success == true){
                    /*跳转后台的首页*/
                    location.href = '/adminlt/index.html';
                }
                /*业务失败*/
                else{
                    if(data.error == 1000){
                        /*用户名错误*/
                        /*设置用户名这个表单元素的校验状态为失败 */
                        /*获取校验组件*/
                        /*调用更改状态的函数*/
                        /*三个参数，改成什么状态，使用哪个校验规则*/
                        $form .data('bootstrapValidator').updateStatus('username','INVALID','callback')

                    }else if(data.error == 1001){
                        /*密码错误*/
                        $form .data('bootstrapValidator').updateStatus('password','INVALID','callback')
                    }
                }
            }

        });
        });
});