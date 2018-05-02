/*后台管理系统公共文件*/
/*进度显示*/
/*了解jquery相关的ajax方法*/
/*当ajax发生请求，显示进度条*/
/*ajax完成，进度条走完*/
/*禁用进度环*/
NProgress.configure({ showSpinner: false });
$(window).ajaxStart(function(){
    NProgress.start();
});
$(window).ajaxComplete(function(){
    NProgress.done();
});

/*侧边栏的显示隐藏 二级菜单显示隐藏*/
$('[data-menu]').on('click',function(){
    $('.ad_aside').toggle();
    $('.ad_section').toggleClass('menu');
});

$('.menu [href="javascript:;"]').on('click',function(){
    $(this).siblings('.child').slideToggle();
})
/*退出功能*/
/*把html格式的字符串转成js字符串，http://www.css88.com/tool/html2js/ */
var modalHtml = '<div class="modal fade" id="logoutModal">'+
            '    <div class="modal-dialog modal-sm">'+
            '        <div class="modal-content">'+
            '            <div class="modal-header">'+
            '                <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>'+
            '                <h4 class="modal-title">温馨提示</h4>'+
            '            </div>'+
            '            <div class="modal-body">'+
            '                <p class="text-danger"><span class="glyphicon glyphicon-info-sign"></span> 您确定要退出后台管理系统吗？</p>'+
            '            </div>'+
            '            <div class="modal-footer">'+
            '                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'+
            '                <button type="button" class="btn btn-primary">确定</button>'+
            '            </div>'+
            '        </div>'+
            '    </div> '+
            '</div>';
$('body').append(modalHtml);
$('[data-logout]').on('click',function(){
    $('#logoutModal').modal('show').find('.btn-primary').on('click',function(){
        /*退出业务*/
        $.ajax({
            type: 'get',
            url: '/employee/employeeLogout',
            data: '',
            dataType: 'json',
            success: function(data){
                if(data.success == true){
                    $('#logoutModal').modal('hide');
                    /*跳转登录页*/
                    location.href = '/adminlt/login.html'
                }
            }
        })

    });
    /*需要一个模态框，每个页面都需要*/

})

