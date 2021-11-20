var md = new MobileDetect(window.navigator.userAgent);

var MobileMenu = function(){
    var self = {};
    var isShowingMenu = false;
    self.evt = function(){
        $("#btn-top-navicon").click(function(e){
            e.preventDefault();
            if(isShowingMenu == false){
                MobileMenu.showMenu();
            }else{
                MobileMenu.closeMenu();
            }
        })
        $("#global-aside-mobile .nav__heading").click(function(e){
            if($(this).siblings('.nav__subnav').length > 0){
                e.preventDefault();
                $(this).parents('li').toggleClass('active');
                $(this).siblings('.nav__subnav').slideToggle('fast');
            }else{
            }
        })
        $("#global-aside-mobile .nav__subnav a").click(function(e){
            e.preventDefault();
            window.location.href = $(this).attr('href');
            window.onhashchange = function() {
                window.location.reload()
            }
        })
        $(".page-navigation a").click(function(e){
            e.preventDefault();
            window.location.href = $(this).attr('href');
            window.onhashchange = function() {
                window.location.reload()
            }
        })
        $("#global-aside-mobile .has-subpages").click(function(e){
            e.preventDefault();
            $(this).toggleClass('expanding');
            $(this).find('.subpages').slideToggle('fast')
        })
    }
    self.showMenu = function(){
        MobileMenu.resetMenu();
        $("#global-aside-mobile").fadeIn();
        $("#btn-top-navicon").addClass('active');
        isShowingMenu = true;
    }
    self.closeMenu = function(){
        $("#global-aside-mobile").fadeOut();
        $("#btn-top-navicon").removeClass('active');
        isShowingMenu = false;
    }
    self.resetMenu = function(){
        $("#global-aside-mobile .nav-main .active").removeClass('active');
    }
    self.init = function(){
        MobileMenu.evt();
    }

    return self;
}();

var Ctab = function(){

    var self = {};

    self.evt = function(){
        $(".tab-control").click(function(e){
            e.preventDefault();
            var id = $(this).attr('data-id');
            var cate = $(this).closest('.tabs-control').attr('data-category');
            //$(this).addClass('active').siblings('.tab-control').removeClass('active');
            Ctab.showContent(cate,id);
        })
    }
    self.showContent = function(category, id){

        var target = $(".tabs-content[data-category="+category+"]").find(".tab-content[data-id="+id+"]");
        target.fadeIn().siblings('.tab-content').hide();

//        location.hash = id;

        if(id == 'shareholders'){
            $('[data-id="shareholders"] .charts .block .bg').width(0);
            var numAnim1 = new CountUp("value-founder", 0, 49.8, 1, 2);
            var numAnim2 = new CountUp("value-shareholders", 0, 50.2, 1, 2);
            numAnim1.start();
            numAnim2.start();
            $('[data-id="shareholders"] .charts .block .bg').animate({
                width: '100%',
            }, 2000)
        }
        var control_btn = $("[data-category='"+category+"']").find('.tab-control[data-id='+id+']');
        control_btn.parents('.tabs-control').find('.tab-control').removeClass('active');
        control_btn.addClass('active')


        Ctab.callback(category, id)
    }
    self.callback = function(category, id){
    }
    self.landing = function(){
        var _hash = location.hash.replace('#', '');
        if( _hash == ''){
            $(".tab-control").each(function(){
                if($(this).index() == 0){
                    $(this).trigger('click');
                }
            })
        }else{
            if( $(".tab-control[data-id='"+_hash+"']").length > 0 ){
                $(".tab-control[data-id='"+_hash+"']").trigger('click');
            }else{
                $(".tab-control").each(function(){
                    if($(this).index() == 0){
                        $(this).trigger('click');
                    }
                })
            }
        }
        
    }
    self.init = function(){
        self.evt();
        if( $("#page-properties-list").length <= 0 ){
            self.landing();
        }
    }
    return self;
}();
function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
function insertParam(key, value){
    key = encodeURI(key); value = encodeURI(value);

    var kvp = document.location.search.substr(1).split('&');

    var i=kvp.length; var x; while(i--) 
    {
        x = kvp[i].split('=');

        if (x[0]==key)
        {
            x[1] = value;
            kvp[i] = x.join('=');
            break;
        }
    }

    if(i<0) {kvp[kvp.length] = [key,value].join('=');}

    //this will reload the page, it's likely better to store this until finished
    document.location.search = kvp.join('&'); 
}

$(document).ready(function(){

    MobileMenu.init();
    Ctab.init();

    $("[data-lang]").click(function(e){
        e.preventDefault();
        var lang ;
        switch ($(this).attr('data-lang')) {
            case 'tc':
                lang = 'zh-hk'
                break;
            case 'sc':
                lang = 'zh-cn'
                break;
            case 'en':
                lang = 'en'
                break;
        }
//        insertParam("lang", lang)
        var arr = window.location.href.split("/");
        arr[3] = lang;
        var newUrl = arr.join("/");
        var lastChar = newUrl.substr(newUrl.length - 1);
        if(lastChar != '/'){
            newUrl += '/';
        }
        window.location.href = newUrl;
    })

    $(".tabs-control nav .item .text").on('click', function(e){
        if( $(this).siblings('.submenu').length > 0 ){
            var submenu = $(this).siblings('.submenu');
            submenu.slideToggle('fast');
            $(this).parents('.item').toggleClass('expanded');
        }
    })
    
    $(".pagination-btn").click(function(){
        var id = $(this).attr('id').split('-').pop();
        $(this).parent().children(".pagination-btn").removeClass('active');
        $(this).parent().parent().parent().children(".page-container").removeClass('active');
        $(this).parent().children("#pagination-btn-"+id).addClass('active');
        $(this).parent().parent().parent().children("#page-container-"+id).addClass('active');
    });

    if(!md.mobile()){
        window.sr = ScrollReveal({ reset: true });
        sr.reveal('[data-reveal="slide-in"]', { 
            duration: 800,
            scale: 1,
            easing: "ease-out",
            reset: true,
        });
        sr.reveal('[data-reset="false"]', { 
            reset: false,
        });
        sr.reveal('[data-reveal-delay="normal"]', { 
        },100);
        
        //----------home specific
        sr.reveal('#home__about .layer-container', {  
            duration: 800,
            scale: 1,
            easing: "ease-out",
            reset: false,
        }, 200);
        sr.reveal('#home__landing-1 .keyvisual .visual img', { 
            duration: 1000,
            scale: 1,
            easing: "ease-out",
            reset: false,
        }, 400);
        //----------about specific
        if( $("#page-about").length > 0 ){
            sr.reveal('#page-about [data-id="csi_investment_properties"] .circle .ball .visual', { 
                duration: 400,
                scale: 0.6,
                easing: "ease-out",
                reset: true,
            }, 100);
            sr.reveal('#page-about [data-id="csi_investment_properties"] [data-reveal="slide-in"]', {
                reset: false,
            });
            sr.reveal('#page-about [data-id="couture_homes"] .content-group ', { 
                duration: 800,
                scale: 1,
                easing: "ease-out",
                reset: false,
            }, 200);
        }
        
    }

    
    
})