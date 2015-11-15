$(document).ready(function(){

    var foldEvnetFunc = function(){
        var listObj = $(this).parent("div").find(".panel-list");
        if(listObj.attr("visualble") == "true")
        {
            listObj.attr("visualble","false");
            listObj.hide();
        }
        else
        {
            listObj.attr("visualble","true");
            listObj.fadeIn();
        }
        return false;
    }
    var init = function(){
        //left bar init(book list)
        var articleIds = [];
        var panelObj =  $(".panel-title").find("span");
        $(".panel-title").each(function(){
            var bookid = $(this).attr("id");
            $.ajax({
                type:"POST",
                url:"/article/list/get",
                data:{bookid:bookid},
                success:function(result)
                {
                    dt = eval("("+result+")");
                    leftbarHtml(bookid,dt.json);
                },

                error:function(result)
                {
                 alert("eee"+result);
                }
            });
        });

        $(".panel-text").unbind().bind("click",foldEvnetFunc);
        $(".panel-text").first().click();
        
        panelObj = null;

    }
    var articleReadFunc = function(e){
        var id = $(this).attr("id");
        if(!id) return;
        $.ajax({
                type:"POST",
                url:"/article/get",
                data:{id: id},
                success:function(result)
                {  
                    var article = eval("("+result+")").article;
                    $.test = article;
                    readbarHtml($("#read"),article);
                },
                error:function(result)
                {
                 alert("eee"+result);
                }

        });
        e.stopPropagation();
        return false;

    }

    var leftbarHtml = function(bookid,articles)
    {
        var $obj = $("#"+bookid);
        var html ='<ul class="panel-list " style="display:none;">';
        re=/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/i;
        for (i=0;i<articles.length;i++){
            html += '<li class=" article_list" id="'+articles[i]._id+'">'+articles[i].title+' -  '+re.exec(articles[i].meta.createAt)[0]+'</li>';
        }
        html+='</ul>';
        $obj.append(html);
        var list = $(".article_list");
        $(".article_list").unbind().bind("click",articleReadFunc);
        list[0].click();

    };

    var readbarHtml = function(obj,article)
    {
        obj.empty();
        obj.append(article.text).fadeIn();
    };
    init();


});
