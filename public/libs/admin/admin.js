$(document).ready(function(){
    var $savebookObj = $('#savebook');
    var $addbooklineObj = $('#addbook');


    var bookitemEventFunc = function()
        {
            var id = $(this).attr("id");
            $(".bselected").removeClass("bselected");
            $(this).addClass("bselected");
            $.ajax({
                type:"POST",
                dataType:"json",
                url:"/article/list/get",
                data:{bookid:id},
                success:function(result)
                {
                    var data = result.json;
                    articleListCreate(data);
                    data = null;
                },

                error:function(result)
                {
                 alert("eee"+result);
                }
            });

    }
    var articleListCreate = function(articleitems)
    {
        var items = articleitems;
        var $headerObj = $("tbody.list");
        $headerObj.empty();
        var html = null;
        re=/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/i;
        for (i=0; i<items.length;i++)
        {
            html+='<tr><td class="article_item" id="'+items[i]._id+'">'+items[i].title+'</td>'+
             '<td bookid="'+items[i]._bookid+'">'+items[i].bookname+'</td>'+
             '<td ">'+re.exec(items[i].meta.createAt)[0]+'</td>'+
             '<td id="wxshared">'+items[i].wxshared+'</td>'+
             '<td id="wbshared">'+items[i].wbshared+'</td>'+
             '<td class="article_update"><a href="/admin/edit?id='+items[i]._id+'">更新</a></td>'+
             '<td class="article_delete">删除</td>'+
              '<td class="article_shared">分享</td></tr>'
        }
        $headerObj.append(html);
        articleListEvent();

    }
    var articleDeleteFunc = function(){
        //ajax.delete admin/article/delete
        var _id = $(this).parent().find(".article_item").attr("id");
        var $trObj = $(this).parent();
        if(!_id) return;

         $.ajax({
            type: 'DELETE',
            url: '/admin/article/delete?id=' + _id
        }).done(function (results) {//删除之后希望服务器返回状态
            if (results.success) {
                $trObj.remove();
            }
        })
    }
    var articleListEvent = function(){
        //$(".article_item").unbind().bind("click",function(){});//enter article view mode,  to be completed!
        //$(".article_update").unbind().bind("click",articleUpdateFunc);
        $(".article_delete").unbind().bind("click",articleDeleteFunc);
    }
    
    var addBookEventFunc = function()
        {
            if($(this).attr("editable") != "true")
            {
                $addbooklineObj.before('<li class="list-group-item nb" contenteditable="true"></li>')
                $savebookObj.fadeIn();
                $("#cancleadd").fadeIn();
                $(this).attr("editable","true");
            }
        }

    var booklist_back= function (){
            $savebookObj.hide();
            $("#cancleadd").hide();
            if($(".nb")) $(".nb").removeAttr("contenteditable").removeClass("nb");
            $addbooklineObj.attr("editable","false");
    }

    var saveBookEventFunc = function()
    {
        var text = $(".nb").text();
        if(!text){alert("没有项目"); return;}
        $.ajax({
                type:"POST",
                dataType:"json",
                data:{name:text},
                url:"/admin/book/add",
                success:function(result){
                if(result) alert("保存成功");
            }});
        booklist_back();
//        };  
    } 
    var cancleEventFunc = function(){
        $(".nb").remove()
        booklist_back();
    }
    function init(){
        $("#cancleadd").unbind().bind("click",cancleEventFunc);
        $(".bookitem").unbind().bind("click",bookitemEventFunc);
        $savebookObj.unbind().bind("click",saveBookEventFunc);
        $addbooklineObj.unbind().bind("click",addBookEventFunc);
        $(".bookitem").first().click();
    }
    init();
    //adminInit();
});
