$(document).ready(function () {
  AOS.init({
    once: true,
    offset: 50,
  });

  $(".mock-link").on("click", function (e) {
    e.preventDefault();
  });

  $("form").on("submit", function (e) {
    e.preventDefault();
    const toastEl = document.getElementById("successToast");
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
      toast.show();
    }
    this.reset();
  });

  function renderCatalog(items) {
    const $grid = $("#api-grid");
    const $gearCount = $(".gear-count");
    const visibleCount = Math.min(items.length, 8);
    $grid.empty();
    $gearCount.text(visibleCount);

    items.slice(0, visibleCount).forEach((item, index) => {
      const delay = (index % 4) * 100;

      let dataRows = "";
      if (item.data) {
        for (const [key, value] of Object.entries(item.data)) {
          dataRows += `
                            <div class="data-row">
                                <span class="data-key">${key}</span>
                                <span class="data-value" title="${value}">${value}</span>
                            </div>
                        `;
        }
      } else {
        dataRows = `<div class="data-row text-center text-secondary">No extra data</div>`;
      }

      const cardHtml = `
                    <div class="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="${delay}">
                        <div class="api-card">
                            <div class="api-id">ID #${item.id}</div>
                            <div class="api-name">${item.name}</div>
                            <div class="api-data mt-4">
                                ${dataRows}
                            </div>
                        </div>
                    </div>
                `;
      $grid.append(cardHtml);
    });
  }

  $.ajax({
    url: "https://api.restful-api.dev/objects",
    method: "GET",
    dataType: "json",
    success: function (data) {
      renderCatalog(data);
    },
    error: function (err) {
      console.error("Error fetching API data:", err);
      $("#api-grid").html(
        '<div class="col-12"><p class="text-danger mb-0">Failed to load catalog data.</p></div>',
      );
    },
  });

  const $dropZone = $("#drop-zone");
  const $fileInput = $("#file-input");
  const $status = $("#upload-status");
  $dropZone.on("click", function (e) {
    if (e.target !== $fileInput[0]) {
      $fileInput.click();
    }
  });

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    $dropZone.on(eventName, preventDefaults);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    $dropZone.on(eventName, function () {
      $dropZone.addClass("dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    $dropZone.on(eventName, function () {
      $dropZone.removeClass("dragover");
    });
  });

  $dropZone.on("drop", function (e) {
    const dt = e.originalEvent.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  });

  $fileInput.on("change", function () {
    handleFiles(this.files);
  });

  function handleFiles(files) {
    if (files.length === 0) return;

    const formData = new FormData();
    let valid = true;

    $.each(files, function (i, file) {
      if (!file.type.match("image.*")) {
        valid = false;
        return false; // break loop
      }
      formData.append("images", file);
    });

    if (!valid) {
      $status.html(
        '<div class="alert alert-danger">Please select only image files.</div>',
      );
      return;
    }

    $status.html('<div class="alert alert-info">Uploading...</div>');

    $.ajax({
      url: "/api/upload",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        $status.html(
          `<div class="alert alert-success">${response.message}</div>`,
        );
        $fileInput.val("");

        setTimeout(() => {
          $status.empty();
        }, 3000);
      },
      error: function (err) {
        console.error(err);
        $status.html(
          '<div class="alert alert-danger">Upload failed. Make sure the backend server is running.</div>',
        );
      },
    });
  }

  const scheduleData = {
    Monday: [
      {
        time: "06:00 AM",
        label: "STRENGTH",
        color: "#00f0ff",
        textColor: "#000",
        name: "Iron Start",
        desc: "Compound lifts and progressive overload. The week begins with raw power.",
        duration: "60 min",
        coach: "Coach Marcus",
      },
      {
        time: "09:00 AM",
        label: "YOGA",
        color: "#7c5cbf",
        textColor: "#fff",
        name: "Morning Flow",
        desc: "Start your week centred. Full-body stretching and breathwork for clarity.",
        duration: "50 min",
        coach: "Coach Carlos",
      },
      {
        time: "12:30 PM",
        label: "HIIT",
        color: "#ff6b35",
        textColor: "#fff",
        name: "Ignite",
        desc: "Short, brutal intervals to fire up your metabolism at midday.",
        duration: "45 min",
        coach: "Coach Mei Chen",
      },
      {
        time: "06:00 PM",
        label: "ENDURANCE",
        color: "#2ea8a0",
        textColor: "#fff",
        name: "Distance Run",
        desc: "Zone-2 conditioning and pacing drills. Run smarter, not just harder.",
        duration: "75 min",
        coach: "Coach Sarah",
      },
    ],
    Tuesday: [
      {
        time: "06:30 AM",
        label: "HIIT",
        color: "#ff6b35",
        textColor: "#fff",
        name: "Wake & Shake",
        desc: "High-rep, low-rest circuits to torch calories before breakfast.",
        duration: "45 min",
        coach: "Coach Mei Chen",
      },
      {
        time: "10:00 AM",
        label: "MOBILITY",
        color: "#7c5cbf",
        textColor: "#fff",
        name: "Joint Reset",
        desc: "Dedicated mobility and myofascial release. Your joints will thank you.",
        duration: "50 min",
        coach: "Coach Carlos",
      },
      {
        time: "01:00 PM",
        label: "STRENGTH",
        color: "#00f0ff",
        textColor: "#000",
        name: "Pull Day",
        desc: "Deadlifts, rows and pull-up variations. Build a back that commands respect.",
        duration: "60 min",
        coach: "Coach Marcus",
      },
      {
        time: "07:00 PM",
        label: "CROSSFIT",
        color: "#e63946",
        textColor: "#fff",
        name: "WOD",
        desc: "Workout of the Day. Expect the unexpected — and be ready for anything.",
        duration: "60 min",
        coach: "Coach Sarah",
      },
    ],
    Wednesday: [
      {
        time: "06:00 AM",
        label: "STRENGTH",
        color: "#00f0ff",
        textColor: "#000",
        name: "Iron Start",
        desc: "Build raw strength from the ground up. Compound lifts, progressive overload.",
        duration: "60 min",
        coach: "Coach Marcus",
      },
      {
        time: "09:30 AM",
        label: "HIIT",
        color: "#ff6b35",
        textColor: "#fff",
        name: "Burn Zone",
        desc: "High-output intervals to maximise caloric burn and cardiovascular endurance.",
        duration: "45 min",
        coach: "Coach Mei Chen",
      },
      {
        time: "12:00 PM",
        label: "MOBILITY",
        color: "#7c5cbf",
        textColor: "#fff",
        name: "Flex & Flow",
        desc: "Targeted stretching and joint mobility. Recover faster, move better.",
        duration: "50 min",
        coach: "Coach Carlos",
      },
      {
        time: "06:30 PM",
        label: "ENDURANCE",
        color: "#2ea8a0",
        textColor: "#fff",
        name: "Long Game",
        desc: "Sustained effort, zone-2 conditioning, and race-pace intervals.",
        duration: "75 min",
        coach: "Coach Sarah",
      },
    ],
    Thursday: [
      {
        time: "06:00 AM",
        label: "CROSSFIT",
        color: "#e63946",
        textColor: "#fff",
        name: "Morning WOD",
        desc: "Functional fitness at its finest. Expect mixed-modal challenges.",
        duration: "60 min",
        coach: "Coach Sarah",
      },
      {
        time: "09:00 AM",
        label: "STRENGTH",
        color: "#00f0ff",
        textColor: "#000",
        name: "Press Day",
        desc: "Overhead press, bench and shoulder work. Build the upper body of an athlete.",
        duration: "60 min",
        coach: "Coach Marcus",
      },
      {
        time: "12:30 PM",
        label: "YOGA",
        color: "#7c5cbf",
        textColor: "#fff",
        name: "Midweek Reset",
        desc: "Restorative yoga to release mid-week tension and recharge for Friday.",
        duration: "50 min",
        coach: "Coach Carlos",
      },
      {
        time: "06:00 PM",
        label: "HIIT",
        color: "#ff6b35",
        textColor: "#fff",
        name: "Afterburn",
        desc: "Peak intensity sessions designed to keep your metabolism elevated for 24 hours.",
        duration: "45 min",
        coach: "Coach Mei Chen",
      },
    ],
    Friday: [
      {
        time: "06:00 AM",
        label: "STRENGTH",
        color: "#00f0ff",
        textColor: "#000",
        name: "Max Effort",
        desc: "Test your one-rep max. End the week knowing exactly where you stand.",
        duration: "75 min",
        coach: "Coach Marcus",
      },
      {
        time: "10:00 AM",
        label: "HIIT",
        color: "#ff6b35",
        textColor: "#fff",
        name: "Friday Fire",
        desc: "Celebrate the week with an intense, music-fuelled interval session.",
        duration: "45 min",
        coach: "Coach Mei Chen",
      },
      {
        time: "01:00 PM",
        label: "MOBILITY",
        color: "#7c5cbf",
        textColor: "#fff",
        name: "Recovery Flow",
        desc: "Pre-weekend mobility and stretching. Arrive Monday feeling 100%.",
        duration: "50 min",
        coach: "Coach Carlos",
      },
      {
        time: "05:30 PM",
        label: "ENDURANCE",
        color: "#2ea8a0",
        textColor: "#fff",
        name: "Long Run Club",
        desc: "Community long run to close the week. All paces welcome.",
        duration: "90 min",
        coach: "Coach Sarah",
      },
    ],
    Saturday: [
      {
        time: "08:00 AM",
        label: "CROSSFIT",
        color: "#e63946",
        textColor: "#fff",
        name: "Saturday WOD",
        desc: "The week's biggest community class. High energy, team-based fun.",
        duration: "75 min",
        coach: "All Coaches",
      },
      {
        time: "10:00 AM",
        label: "STRENGTH",
        color: "#00f0ff",
        textColor: "#000",
        name: "Power Hour",
        desc: "An hour of pure strength work. Squat, deadlift, press — all the classics.",
        duration: "60 min",
        coach: "Coach Marcus",
      },
      {
        time: "12:00 PM",
        label: "YOGA",
        color: "#7c5cbf",
        textColor: "#fff",
        name: "Weekend Restore",
        desc: "Slow down, breathe deep, and restore. The perfect way to wind down.",
        duration: "60 min",
        coach: "Coach Carlos",
      },
      {
        time: "02:00 PM",
        label: "OPEN GYM",
        color: "#888",
        textColor: "#fff",
        name: "Open Floor",
        desc: "Supervised open gym. Work on your own goals with coach support on hand.",
        duration: "120 min",
        coach: "Staff",
      },
    ],
  };

  function renderSchedule(day) {
    var classes = scheduleData[day];
    if (!classes) return;
    var html = "";
    classes.forEach(function (c, i) {
      html += `
        <div class="schedule-row" style="border-left: 3px solid ${c.color}; animation-delay: ${i * 80}ms">
          <div class="schedule-row-inner">
            <div class="sch-time">${c.time}</div>
            <div class="sch-body">
              <span class="sch-tag" style="background:${c.color}; color:${c.textColor}">${c.label}</span>
              <span class="sch-name">${c.name}</span>
            </div>
            <div class="sch-meta">
              <span class="sch-duration">${c.duration}</span>
              <span class="sch-sep">|</span>
              <span class="sch-coach">${c.coach}</span>
            </div>
            <div class="sch-arrow"><i class="fa-solid fa-chevron-down"></i></div>
          </div>
          <div class="sch-desc">${c.desc}</div>
        </div>`;
    });
    var $grid = $("#schedule-grid");
    $grid.css("opacity", 0);
    $grid.html(html);
    $grid.animate({ opacity: 1 }, 280);
  }

  $(document).on("click", ".schedule-row", function () {
    $(this).toggleClass("sch-open");
  });

  $(".sch-day-btn").on("click", function () {
    var day = $(this).data("day");
    $(".sch-day-btn").removeClass("sch-day-active");
    $(this).addClass("sch-day-active");
    renderSchedule(day);
  });

  $(".sch-day-btn").on("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      $(this).trigger("click");
    }
  });

  renderSchedule("Wednesday");
});

(function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
    return;

  gsap.registerPlugin(ScrollTrigger);

  gsap.utils
    .toArray(".about-count, .reviews-count-value")
    .forEach(function (el) {
      var target = Number(el.getAttribute("data-count"));
      if (Number.isNaN(target)) return;
      var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      var obj = { val: 0 };

      function formatValue(value) {
        return (
          prefix +
          Number(value).toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }) +
          suffix
        );
      }

      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
        onUpdate: function () {
          el.textContent = formatValue(obj.val);
        },
        onComplete: function () {
          el.textContent = formatValue(target);
        },
      });
    });

  var heroAccent = document.querySelector(".hero-title .text-accent");
  if (heroAccent) {
    var originalText = heroAccent.textContent;
    var glitchChars = "X#@!%&?";
    var glitchCount = 0;
    var maxGlitch = 6;
    function runGlitch() {
      if (glitchCount >= maxGlitch) {
        heroAccent.textContent = originalText;
        return;
      }
      heroAccent.textContent = originalText
        .split("")
        .map(function (c) {
          return Math.random() > 0.5
            ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
            : c;
        })
        .join("");
      glitchCount++;
      setTimeout(runGlitch, 60);
    }
    setTimeout(runGlitch, 800);
  }

  var navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 60) {
          navbar.style.backdropFilter = "blur(20px) saturate(180%)";
          navbar.style.webkitBackdropFilter = "blur(20px) saturate(180%)";
          navbar.style.backgroundColor = "rgba(8,12,20,0.92)";
        } else {
          navbar.style.backdropFilter = "blur(10px)";
          navbar.style.webkitBackdropFilter = "blur(10px)";
          navbar.style.backgroundColor = "";
        }
      },
      { passive: true },
    );
  }

  var collage = document.querySelector(".upload-section .position-relative");
  if (collage) {
    var images = collage.querySelectorAll(
      "div[style*='position:absolute'], div[class*='position-absolute']",
    );
    var depths = [0.04, 0.02, 0.06, 0.03];
    document.addEventListener("mousemove", function (e) {
      var cx = window.innerWidth / 2;
      var cy = window.innerHeight / 2;
      var dx = (e.clientX - cx) / cx;
      var dy = (e.clientY - cy) / cy;
      images.forEach(function (img, i) {
        var d = depths[i] || 0.03;
        gsap.to(img, {
          x: dx * d * 30,
          y: dy * d * 20,
          duration: 0.8,
          ease: "power2.out",
        });
      });
    });
  }

  var pricingToggle = document.getElementById("pricingToggle");
  if (pricingToggle) {
    pricingToggle.addEventListener("change", function () {
      var isAnnual = this.checked;
      var labelMonthly = document.getElementById("label-monthly");
      var labelAnnual = document.getElementById("label-annual");
      if (labelMonthly)
        labelMonthly.style.color = isAnnual ? "#7a8899" : "var(--accent)";
      if (labelAnnual)
        labelAnnual.style.color = isAnnual ? "var(--accent)" : "#7a8899";

      document.querySelectorAll(".pricing-price").forEach(function (el) {
        var price = isAnnual
          ? el.getAttribute("data-annual")
          : el.getAttribute("data-monthly");
        gsap.to(el, {
          opacity: 0,
          y: -8,
          duration: 0.18,
          ease: "power2.in",
          onComplete: function () {
            el.textContent = "$" + price;
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.22,
              ease: "power2.out",
            });
          },
        });
      });
    });
  }

  gsap.utils.toArray(".pricing-card").forEach(function (card, i) {
    gsap.from(card, {
      y: 40,
      opacity: 0,
      duration: 0.7,
      delay: i * 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
        once: true,
      },
    });
  });

  gsap.utils.toArray(".about-stat").forEach(function (stat, i) {
    gsap.from(stat, {
      x: -30,
      opacity: 0,
      duration: 0.6,
      delay: i * 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: stat,
        start: "top 90%",
        once: true,
      },
    });
  });
})();
