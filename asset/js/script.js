$(document).ready(function () {
  let currentIndex = 0;
  const slides = $(".slide-container");
  const allSlides = $(".slide");
  const totalSlides = allSlides.length;
  let isDragging = false;
  let startX, startY;
  let offsetX = 0,
    offsetY = 0;
  let scale = 1;
  let minWidth = 450;
  let imagePagesGrid = [];

  $(".slide").each(function (key) {
    let item = `
                <div class="col-6 mb-5 page_item_grid_comic" data-page="${key}">
                    <div class="text-center">
                        <img class="w-100 h-100 border rounded" src="${
                          $(this).attr('src')
                        }">
                        <span class="text-light">${key + 1}</span>
                    </div>
                </div>
            `;
    imagePagesGrid.push(item);
  });
  
  $("#page_list .row").html(imagePagesGrid.join(""));

  $("#total_page_comic").text(totalSlides);
  $("#current_page_comic").text(currentIndex + 1);
  allSlides.css("transition", "transform 0.3s ease-in-out");
  $("#main").css("transition", "width 0.3s ease-in-out");
  slides.css("transition", "transform 0.5s ease-in-out");

  $("#grid_page_comic").click(function () {
    if ($("#page_list").css("left") === "0px") {
      $("#page_list").css("left", "-100%");
    } else {
      $("#page_list").css("left", "0px"); 
    }

    $("#page_list").css("transition", "all 1s");
  });

  $(document).click(function (e) {
    if (!$(e.target).closest("#page_list, #grid_page_comic").length) {
        $("#page_list").css("left", "-100%");
        $("#page_list").css("transition", "all 1s");
    }
    if (!$(e.target).closest("#btn_brightness, #brightness_control").length) {
      $("#brightness_control").fadeOut(200);
    }
  });
  $("#close_grid_page_comic").click(function () {
    $("#page_list").css("left", "-100%"); 
        $("#page_list").css("transition", "all 1s");

  });

  $("#page_list").click(function (e) {
    e.stopPropagation();
  });


    $(".page_item_grid_comic").click(function(){
        currentIndex = $(this).data("page");
        updateSlide();
    });

    $("#btn_show_box_bottom_setting").click(function(){
        if ($("#setting_bottom_control").css("bottom") === "0px") {
          $("#setting_bottom_control").css("bottom", "-70px");
          $("#bottom").css("bottom", "0px");
          $(
            "#setting_bottom_control #btn_show_box_bottom_setting i"
          ).removeClass("bx-chevron-down");
          $("#setting_bottom_control #btn_show_box_bottom_setting i").addClass(
            "bx-chevron-up"
          );
        } else {
          $("#setting_bottom_control").css("bottom", "0px");
          $("#bottom").css("bottom", "70px");
          $(
            "#setting_bottom_control #btn_show_box_bottom_setting i"
          ).removeClass("bx-chevron-up");
          $("#setting_bottom_control #btn_show_box_bottom_setting i").addClass(
            "bx-chevron-down"
          );
        }
        $("#setting_bottom_control").css("transition", "all 1s");
        $("#bottom").css("transition", "all 1s");
    });
    $("#btn_brightness").click(function () {
      $("#brightness_control").fadeToggle(200);
    });

    $("#brightness_range").on("input", function () {
      let brightnessValue = $(this).val(); 
      slides.css("filter", `brightness(${brightnessValue}%)`); 
    });
        let dark_mode = false;

        function toggleDarkMode() {
          dark_mode = !dark_mode;          
          $("body").css("background-color", dark_mode ? "#131415" : "#f8f9fe");

          $("#btn_dark_mode i")
            .toggleClass("bx-moon", !dark_mode) 
            .toggleClass("bx-sun", dark_mode);
        }

        toggleDarkMode();

        $("#btn_dark_mode").click(toggleDarkMode);
        
    updateSlide();
  function updateSlide() {
    $(".page_item_grid_comic div").removeClass("active");

    let activeImage = $(".page_item_grid_comic div").eq(currentIndex); 
    
    activeImage.addClass("active rounded");

    slides.addClass("transition");

    allSlides.css("transform", "scale(1)").attr("data-zoom", 1);
    $("#main").animate({ width: minWidth + "px" }, 300);
    slides.css("transform", `translateX(-${currentIndex * 100}%)`);

    offsetX = 0;
    offsetY = 0;

    setTimeout(() => {
      slides.removeClass("transition");
    }, 400);
}

  $("#btn_reset").click(function () {
    updateSlide();
  });

  $(".btn-next").click(function () {
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    $("#current_page_comic").text(currentIndex + 1);
    updateSlide();
  });

  $(".btn-prev").click(function () {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = totalSlides - 1;
    }
    $("#current_page_comic").text(currentIndex + 1);
    updateSlide();
  });

  $(".zoom-in").click(function () {
    let $currentImage = allSlides.eq(currentIndex);
    let originalWidth = $currentImage[0].naturalWidth;
    if (scale < 2) {
      scale += 0.2;
      $currentImage.attr("data-zoom", scale);
      $currentImage.css(
        "transform",
        `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`
      );

      let newWidth = Math.min(originalWidth, $currentImage.width() * scale);
      $("#main").animate({ width: newWidth + "px" }, 300);
    }
  });

  $(".zoom-out").click(function () {
    let $currentImage = allSlides.eq(currentIndex);
    let originalWidth = $currentImage[0].naturalWidth;

    if (scale > 1) {
      scale -= 0.2;
      $currentImage.attr("data-zoom", scale);
      $currentImage.css(
        "transform",
        `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`
      );

      let newWidth = Math.max(minWidth, $currentImage.width() / scale);
      if (scale <= 1) {
        newWidth = minWidth;
      }
      $("#main").animate({ width: newWidth + "px" }, 300);
    }

    if (scale <= 1) {
      scale = 1;
      offsetX = 0;
      offsetY = 0;
      $currentImage.attr("data-zoom", scale);
      $currentImage.css("transform", `scale(${scale}) translate(0, 0)`);
      $("#main").animate({ width: minWidth + "px" }, 300);
    }
  });

  $(document).on("wheel", function (e) {
    if (e.originalEvent.ctrlKey) {
      e.preventDefault();
    }
  });

  $(document).keydown(function (e) {
    if (
      e.ctrlKey &&
      (e.which === 61 ||
        e.which === 107 ||
        e.which === 173 ||
        e.which === 109 ||
        e.which === 187 ||
        e.which === 189)
    ) {
      e.preventDefault();
    }
  });

  document.addEventListener("gesturestart", function (e) {
    e.preventDefault();
  });

  document.addEventListener("gesturechange", function (e) {
    e.preventDefault();
  });

  document.addEventListener("gestureend", function (e) {
    e.preventDefault();
  });
  $(document).on("touchmove", function (e) {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  });

  $("#fullscreen-btn").click(function () {
    let elem = document.documentElement;

    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
      $(this).html("<i class='bx bx-exit-fullscreen'></i>");
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      $(this).html("<i class='bx bx-fullscreen'></i>");
    }
  });

  slides.on("mousedown", function (e) {
    isDragging = true;
    startX = e.pageX - slides.offset().left - offsetX;
    startY = e.pageY - slides.offset().top - offsetY;
    slides.css("cursor", "grabbing");
    e.preventDefault();
  });

  slides.on("mousemove", function (e) {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - slides.offset().left;
    const y = e.pageY - slides.offset().top;

    offsetX = x - startX;
    offsetY = y - startY;

    allSlides
      .eq(currentIndex)
      .css(
        "transform",
        `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`
      );
  });

  slides.on("mouseup", function () {
    isDragging = false;
    slides.css("cursor", "grab");

    startX = offsetX;
    startY = offsetY;
  });

  slides.on("mouseleave", function () {
    isDragging = false;
    slides.css("cursor", "grab");

    startX = offsetX;
    startY = offsetY;
  });
});
