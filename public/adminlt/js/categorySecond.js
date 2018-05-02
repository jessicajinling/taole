$(function () {
    /*1.默认首页渲染*/
    window.page = 1;

    /*模版引擎内部无法访问外部变量的解决方案*/
    template.helper('getJquery',function(){
        return jQuery;
    });

    /*2.分页展示*/
    var render = function(){
        getCateSecondData(function (data) {
            /*模版渲染*/
            /*console.log(data);*/
            $('tbody').html(template('list',data))
            /*初始化分页组件 根据数据*/
            $('.pagination').bootstrapPaginator({
                /*对应的bootstrap版本*/
                bootstrapMajorVersion: 3,
                /*分页按钮的大小*/
                size: 'small',
                /*当前页码*/
                currentPage: data.page,
                /*一共多少页*/
                totalPages: Math.ceil(data.total / data.size),
                /*页码按钮默认的数量*/
                numberOfPages:3,
                /*点击页码渲染功能*/
                /*监听按钮的点击事件 获取点击时的页码*/
                onPageClicked: function (event, originalEvent, type, page) {
                    /*event:jquery的事件对象*/
                    /*originalEvent原生dom的事件对象*/
                    /*type 按钮的类型*/
                    /*page 对应按钮的页码*/
                    window.page = page;
                    render();
                }
            });
        });
    }
    render();

    /*3.点击添加分类弹窗*/
    getCateFirstData(function(data){
        $('.dropdown-menu').html(template('dropdown',data)).on('click','li',function(){
            var $currA = $(this).find('a');
            /*显示选中的分类名称*/
            $('.categoryName ').html($currA .html());
            /*给隐藏的id表单赋值*/
            $('[name=categoryId]').val($currA.attr('data-id'))
            /*改校验状态*/
            $('#form').data('bootstrapValidator').updateStatus('categoryId','VALID');
        })
    });
          /*jq22 fileupload*/
        initFileUpload();

    /*4.点击确认按钮，提交（一级分类id，二级分类名称，二级分类logo ）*/
   /* $('#save').on('click','.btn-primary',function(e){
        e.preventDefault()
        $('#save').modal('hide');
    });*/

    $('#save form').bootstrapValidator({
        /*默认不去校验的表单元素（即隐藏的表单元素）*/
        excluded:[],
        /*input状态样式图片*/
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            /*验证：规则*/
            categoryId: {//验证input项：验证规则
                validators: {
                    notEmpty: {//非空验证：提示消息
                        message: '请选择一级分类'
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: '请输入二级分类名称'
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: '请上传图片'
                    }
                }
            },

        }
    }).on('success.form.bv', function(e) {//点击提交之后
        /*校验成功时触发 */
        // Prevent form submission
        /*阻止表单的默认提交*/
        e.preventDefault();
        /*后台校验用户名和密码*/
        var $form = $(e.target);
        $.ajax({
            type: 'post',
            url: '/category/addSecondCategory',
            data: $form.serialize(),
            dataType: 'json',
            success: function(data){
                if(data.success == true){
                    window.page = 1;
                    render();
                    $('#save').modal('hide');

                }
            }
        });
    });

});
var getCateSecondData = function(callback){
    $.ajax({
        type: 'get',
        url: '/category/querySecondCategoryPaging',
        data: {
            page: window.page || 1,
            pageSize: 2
        },
        dataType: 'json',
        success: function(data){
            callback && callback(data);
        }
    })
};
/*获取一级数据*/
var getCateFirstData = function(callback){
    $.ajax({
        type: 'get',
        url: '/category/queryTopCategoryPaging',
        data: {
            page: 1,
            pageSize: 999
        },
        dataType: 'json',
        success: function(data){
            callback && callback(data);
        }
    })
};

/*初始化图片上传插件*/
var initFileUpload = function(){
    $('[name=pic1]').fileupload({
        /*上传地址*/
        url: '/category/addSecondCategoryPic',
        /*返回格式*/
        dataType: 'json',
        /*上传成功*/
        done: function (e, data) {
            $('#uploadImage').attr('src',data.result.picAddr);
            $('[name="brandLogo"]').val(data.result.picAddr);
            $('#form').data('bootstrapValidator').updateStatus('brandLogo','VALID');
        }
    });
};