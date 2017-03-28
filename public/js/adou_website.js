$(function () {
    $(".animate_css").css("opacity","0");//每次刷新的时候，初始化动画的开始样式，否则上一次滚动监听追加的效果，没有办法消除
    $(".animate_css_leftIn").css("opacity","0");
    $(".animate_css").css("animation-name","none");
    $(".animate_css_leftIn").css("animation-name","none");
    setTimeout(function(){

    },1000);
    
    //一进入页面的时候，动画效果区块在可视区域内的 即时函数
    (function () {
        $(window).scrollTop(0);
        $(".animate_css").css("opacity","1");
        var section_list = $(".section_animate");
        var wh = $(window).height();
        var compare = wh * 0.8;
        section_list.each(function(){
            var top = $(this).offset().top;
            if(top< compare){
                if($(this).hasClass("bounceInLeft")){
                    $(this).find(".animate_css").addClass("animated").css({"animation-name":"bounceInLeft","opacity":"1"}); 
                }
                if($(this).hasClass("bounceInRight")){
                    $(this).find(".animate_css").addClass("animated").css({"animation-name":"bounceInRight","opacity":"1"}); 
                }
                if($(this).hasClass("fadeInUp")){
                    $(this).find(".animate_css").addClass("animated").css({"animation-name":"fadeInUp","opacity":"1"}); 
                }
                if($(this).hasClass("wobble")){
                    $(this).find(".animate_css").addClass("animated").css({"animation-name":"wobble","opacity":"1"}); 
                }
                if($(this).hasClass("rotateInDownLeft")){
                    $(this).find(".animate_css").addClass("animated").css({"animation-name":"rotateInDownLeft","opacity":"1"}); 
                }
                if($(this).hasClass("rotateInDownRight")){
                    $(this).find(".animate_css").addClass("animated").css({"animation-name":"rotateInDownRight","opacity":"1"}); 
                }
            }
        })
    })();

    //关于图片和文字的动态效果 滚轮监听的函数
    document.getElementById("wrap").addEventListener("wheel", myFunction);  
    $(window).scroll(myFunction);
    function myFunction() {
        var st = $(window).scrollTop();
        var wh = $(window).height();
        var section_list = $(".section_animate");
        var compare = wh * 0.95;      
        section_list.each(function(){
            var top = $(this).offset().top;
            if(top < compare + st){
                if($(this).hasClass("bounceInLeft")){
                    $(this).find(".animate_css").addClass("animated").css({"animation-name":"bounceInLeft","opacity":"1"}); 
                }
                if($(this).hasClass("bounceInRight")){
                    $(this).find(".animate_css").addClass("animated").css({"animation-name":"bounceInRight","opacity":"1"}); 
                }
                if($(this).hasClass("fadeInUp")){
                    $(this).find(".animate_css").addClass("animated").css({"animation-name":"fadeInUp","opacity":"1"}); 
                }
                if($(this).hasClass("wobble")){
                    $(this).find(".animate_css").addClass("animated").css({"animation-name":"wobble","opacity":"1"}); 
                }
                if($(this).hasClass("rotateInDownLeft")){
                    $(this).find(".animate_css").addClass("animated").css({"animation-name":"rotateInDownLeft","opacity":"1"}); 
                }
                if($(this).hasClass("rotateInDownRight")){
                    $(this).find(".animate_css").addClass("animated").css({"animation-name":"rotateInDownRight","opacity":"1"}); 
                }
            }
        })
    }
})
