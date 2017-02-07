(function($){
    $.fn.extend({
        collapsibleCategories: function(options){
            var options = $.extend({
                // default options
                root: "",
                icon: {
                    collapsed: "+",
                    extended: "-"
                }
            }, options);
            
            // hide current form
            $(this).hide();
            
            // get tree array
            var categories = {};
            $(this).find("a").each(function(){
                
                // get key array
                var keyArr = $(this).attr("href").replace(options.root, "").split("/");                
                keyArr = jQuery.grep(keyArr, function(v, i) {
                    return v != "";
                });
                
                eval("\
                    var a = {\
                        href: \"" + $(this).attr("href") + "\",\
                        text: \"" + $(this).html() + "\",\
                        child: {}\
                    };\
                ");
                
                if(keyArr.length == 1){
                    categories[keyArr[keyArr.length - 1]] = a;
                } else {
                    var t = categories[keyArr[0]];
                    for(var i = 1; i < keyArr.length - 1; i++){
                        if(typeof(t.child[keyArr[i]]) == "undefined"){
                            eval("\
                                var c = {\
                                    href: \"#\",\
                                    text: \"---\",\
                                    child: {}\
                                };\
                            ");
                            
                            t.child[keyArr[i]] = c;
                        }
                        t = t.child[keyArr[i]];
                    }
                    
                    t.child[keyArr[keyArr.length - 1]] = a;
                }
                
            });
            console.log(categories);
            
            // reprint html
            var reprintCategories = function(c, level, nav){
                var html = "", navIndex = 0;
                
                for(var k in c){
                    navIndex++;
                                    
                    if(!$.isEmptyObject(c[k].child)){
                        html += "\
                            <li class=\"level" + level + " " + nav + navIndex + " parent\">\
                                <label class=\"tree-toggler nav-header closed\">\
                                    <a href=\"" + c[k].href + "\">" + c[k].text + "</a>\
                                    <span class=\"collapse_button\">" + options.icon.collapsed + "</span>\
                                </label>\
                                <ul class=\"nav nav-list tree\">\
                                    " + reprintCategories(c[k].child, level + 1, nav + navIndex + "-") + "\
                                </ul>\
                        ";
                    } else {
                         html += "\
                            <li class=\"level" + level + " " + nav + navIndex + "\">\
                                <label class=\"tree-toggler nav-header closed\">\
                                    <a href=\"" + c[k].href + "\">" + c[k].text + "</a>\
                                </label>\
                        ";
                    }
                    
                    html += "</li>";
                }
                
                return html;
            };
            
            $(this).html(reprintCategories(categories, 0, "nav-")).fadeIn(300);
            
            // active collapsible
            $(this).find(".collapse_button").click(function(){
                if($(this).html() == options.icon.extended){
                    $(this).html(options.icon.collapsed);
                    $(this).parent("label").next("ul").animate({opacity: "toggle", height: "toggle"}, 300, function(){                        
                        $(this).parent("li").removeClass("current");
                        $(this).find(".current").each(function(){
                            $(this).removeClass("current").children("ul").hide();
                            $(this).find("label > .collapse_button").html(options.icon.collapsed)
                        });
                    }).find("li > label > .collapse_button").animate({right: "80%"}, 300);
                            
                } else {
                    $(this).html(options.icon.extended);
                    $(this).parents("li").addClass("current");
                    $(this).parent("label").next("ul").animate({opacity: "toggle", height: "toggle"}, 300);
                    $(this).parent("label").next("ul").find("li > label > .collapse_button").css({right: "80%"}).animate({right: 0}, 300);
                }
            });
            
            ///
            return $(this);
        }
    });
})(jQuery);