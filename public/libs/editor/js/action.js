$(document).ready(function(){
    var $obj = $('#editor')
    var updateObj = {flag:false,article:null};
    $("#save_pre").click(function()
    {
        //get title from article html document
        var text = $('#editor').wysiwyg('shell').getHTML();
        var index = text.indexOf('<br');
        var fragment = text.slice(0,index);

        if (fragment.indexOf('<') == -1) title = fragment;
        else{ 
            index = fragment.indexOf('<\/')
            fragment = fragment.slice(0,index);
            fragment = fragment.replace(/[^\u4e00-\u9fa5]*/g, "");
        }
        var data = {};
        data.title = fragment;
        text = null;

        //check update or save
        if (updateObj.flag)
        {
            data.curBookId = updateObj._bookid;
        }


        //get book list from db
        $.ajax({
            type:"POST",
            dataType:"json",
            url:"book/get",
            success:function(result)
            {
                data.books = result;
                modelWindow(data);
            },

            error:function(result)
            {
             alert("eee"+result);
            }
        });
        //disaplay categery dropdown

    });
    $("#save").click(function()
    {
        //get title from article html document
        var data = {};
        if (updateObj.flag)
        {
            data._id = updateObj._id;
        }
        data.title = $("#title").text();
        var bookObj = $("#ofbook").find("li.selected");
        data.bookname = bookObj.text();
        data._bookid = bookObj.attr("id");
        data.text = $obj.wysiwyg('shell').getHTML();
        data.wxshared = true;
        //get book list from db
        $.ajax({
            type:"POST",
            dataType:"json",
            data:{article:data},
            url:"/admin/article/save",
            success:function(result)
            {
                 window.location.href="/admin";

            },

            error:function(result)
            {
             alert("保存失败");
            }
        });
        //disaplay categery dropdown

    });
    $("#article_update").click(function()
    {
        $obj.wysiwyg('shell').setHTML('This is the new text.');
        alert(text);

    });
    var articleUpdate = function(){
        $('#editor').wysiwyg('shell').setHTML('This is the new text.');
    }
    var articleSave = function()
    {
        var text = $('#editor').wysiwyg('shell').getHTML();
        alert(text);
    }
    var toWX = function()
    {
        
    }
    var modelWindow = function(data)
    {
        $("#title").text(data.title);
        var html = "";
        var books = data.books;
        for (i =0; i<books.length;i++)
        {
            str = '<li id="'+books[i]._id+'">'+books[i].name+'</li>';
            html += str;
        }
        $("#ofbook").append(html);
        html = book = null;
        $("#ofbook").find("li").unbind().bind("click",etDropdown);
        //if update action ,trigger to its own book 
        if(data.curBookId)
            $("#"+data.curBookId).click();
    }

    //dropdown click event callback
    var etDropdown= function()
        {
            var text = $(this).text();
            $("li.selected").removeClass("selected");
            $(this).addClass("selected")
            $("#ofbook").prev().text(text);
        }

    var isUpdate = function (){
        var id = $("type.update").attr("id");
        if(id)
        {
            $.ajax({
                type:"POST",
                url:"/article/get",
                data:{id:id},
                success:function(result)
                {
                    updateObj = eval("("+result+")").article;
                    updateObj.flag = true;
                    $('#editor').wysiwyg('shell').setHTML(updateObj.text);//set text
                    //set book category
                },

                error:function(result)
                {
                 alert("eee"+result);
                }
            });
        }
    }
    isUpdate();
});
