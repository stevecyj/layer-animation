var isShowingAboutTab = false,
  currentTab;
var s;
var project_slider;
var kvSlider;
var slider_info = {
  currentSlide: 0,
  totalSlider: $("#home__projects .slider__item").length
};
var currentSection,
  currentSlide,
  inTransition = false,
  dir = '';

var isDesktop;

var timeoutResize = function () {};

var util = {
  initedFullpage: "undefined",
  initedSkrollr: "undefined",
  initedSlider: "undefined"
};

var helper = {
  _skrollr: {
    init: function () {
      if (util.initedSkrollr == true) {
        return;
      }
      $("body").imagesLoaded(function () {
        s = skrollr.init();
        util.initedSkrollr = true;
      });
    },
    destroy: function () {
      if (util.initedSkrollr == false) {
        return;
      }
      if (typeof s == "object") {
        s.destroy();
      }
      $("[data-anchor-target]").css({
        transform: "translate(0,0)",
        opacity: 1
      });
      util.initedSkrollr = false;
    }
  },
  _fullpage: {
    init: function () {
      if (util.initedFullpage == true) {
        return;
      }
      var _settings = {
        scrollBar: true,
        sectionSelector: ".home__section",
        verticalCentered: false,
        slideSelector: ".project-slide",
        controlArrows: false,
        slidesNavigation: true,
        loopHorizontal: false,
        responsiveWidth: 1024,
        normalScrollElements: '#mast-footer',
        //responsiveHeight: 720,
        onLeave: function (index, nextIndex, direction) {
          inTransition = true;
          dir = direction;
        },
        afterLoad: function (anchorLink, index) {
          currentSection = index;
          inTransition = false;
          if (currentSection >= 3 && currentSection <= 6) {
            showAboutTab(currentSection - 2, dir);
          }
        },
        afterSlideLoad: function (anchorLink, index, slideAnchor, slideIndex) {
          currentSlide = slideIndex;
          inTransition = false;
        },
        afterResize: function () {
          clearTimeout(timeoutResize);
          timeoutResize = setTimeout(function () {
            if (util.initedSkrollr == true) {
              s.refresh();
            }
          }, 500);
        }
      };
      $("#page-home").fullpage(_settings);
      $("#home__projects").bind("mousewheel", function (event) {
        event.preventDefault();
        if (inTransition == true) {
          return;
        }
        //console.log(event.originalEvent.wheelDelta);
        if (event.originalEvent.wheelDelta >= 0) {
          if (currentSection == 7) {
            if (currentSlide == 0) {
              //== first slide
              $.fn.fullpage.moveSectionUp();
            } else {
              $.fn.fullpage.moveSlideLeft();
            }
          } else {
            $.fn.fullpage.moveSectionUp();
          }
        } else {
          //console.log(currentSection);
          if (currentSection == 7) {
            if (currentSlide == $('.slider__item').length / 2 - 1) {
              //== last slide
              $.fn.fullpage.moveSectionDown();
            } else {
              $.fn.fullpage.moveSlideRight();
            }
            //            $.fn.fullpage.moveSlideRight();
          } else {
            $.fn.fullpage.moveSectionDown();
          }
        }
      });
      util.initedFullpage = true;
    },
    destroy: function () {
      if (util.initedFullpage == false) {
        return;
      }
      if (util.initedFullpage == true) {
        $.fn.fullpage.destroy("all");
      }
      util.initedFullpage = false;
    }
  },
  _slider: {
    init: function () {
      if (util.initedSlider == true) {
        return;
      }
      $("#desktop-slider").hide();
      $("#mobile-slider").show();
      project_slider = $("#home__projects .swiper-wrapper").slick({
        dots: true,
        arrows: true,
        infinite: false,
        speed: 800,
        fade: true,
      });
      $("#home__projects .swiper-wrapper").on("afterChange", function (
        event,
        slick,
        currentSlide,
        nextSlide
      ) {
        slider_info.currentSlide = currentSlide;
      });
      util.initedSlider = true;
    },
    destroy: function () {
      if (util.initedSlider == false) {
        return;
      }
      $("#desktop-slider").show();
      $("#mobile-slider").hide();
      if (util.initedSlider == true) {
        $("#home__projects .swiper-wrapper").slick("unslick");
      }
      util.initedSlider = false;
    }
  },
  _kvSlider: {
    init: function () {
      kvSlider = $(".home_kv_slider").slick({
        dots: false,
        arrows: false,
        infinite: false,
        speed: 1200,
        fade: true,
        autoplay: true,
        autoplaySpeed: 5000,
        mobileFirst: false,
        pauseOnHover: false
      });
    }
  }
};

function showAboutTab(index, direction) {
  /*if( currentTab == index ){
        hideAboutTab();
        return ;
    }*/
  if (window.innerWidth >= 1024) {
    $('#about-wrapper').css('position', 'fixed');
  }
  $(".layers__tips").hide();
  $(".layers").removeClass("active-1 active-2 active-3 active-4");
  $(".layers").addClass("active-" + index);
  $(".home__about .tab").hide();
  $(".layers__remarks .remarks").hide();
  if ((index == 1 && direction == "down") || (index == 4 && direction == "up")) {
    $(".home__about .tab-" + index).show();
    $(".layers__remarks .remarks-" + index).show();
  } else {
    $(".home__about .tab-" + index).fadeIn();
    $(".layers__remarks .remarks-" + index).fadeIn();
  }
  currentTab = index;
}

function hideAboutTab() {
  $(".layers").removeClass("active-1 active-2 active-3 active-4");
  $(".home__about .tab").hide();
  $(".home__about .tab-0").fadeIn(400, function () {
    $(".layers__tips").fadeIn();
  });
  $(".layers__remarks .remarks").hide();
  currentTab = 0;
}

$(document).ready(function () {
  init();

  function init() {
    $('#mast-footer').addClass('home__section fp-auto-height');
    $('#mast-footer').css('min-height', '100px');
    detectDevice();
    hideAboutTab();
    EvtHandler();
    handleSlider();
    handleKvSlider();
    handleParallax();
    handleFullpage();
    //    $('#mast-footer').css('height', '');
  }

  window.addEventListener("resize", function () {
    detectDevice();
    handleFullpage();
    handleParallax();
    handleSlider();
  });

  var swiper = new Swiper("#keyvisual-wrapper .swiper-container", {
    autoplay: true,
    effect: "fade"
  });

  function detectDevice() {
    if (!md.mobile() && window.innerWidth >= 1024) {
      isDesktop = true;
      $(".desktop").show();
      $(".mobile").hide();
    } else {
      isDesktop = false;
      $(".desktop").hide();
      $(".mobile").show();
    }
  }

  function handleFullpage() {
    if (isDesktop) {
      helper._fullpage.init();
    } else {
      helper._fullpage.destroy();
    }
  }

  function handleParallax() {
    if (isDesktop == true) {
      helper._skrollr.init();
    } else {
      helper._skrollr.destroy();
    }
  }

  function handleSlider() {
    if (isDesktop == true) {
      helper._slider.destroy();
    } else {
      helper._slider.init();
    }
  }

  function handleKvSlider() {
    helper._kvSlider.init();
  }

  function EvtHandler() {
    $(".home__about .layer").click(function () {
      $(".layers").removeClass("active-1 active-2 active-3 active-4");
      var index = $(this).attr("data-tab");
      showAboutTab(index, 'click');
    });
    window.addEventListener("scroll", function () {
      if ($(window).scrollTop() >= $("#home__projects").offset().top) {
        $(".scrolltips").fadeOut();
      } else {
        $(".scrolltips").fadeIn();
      }
    });
  }
});