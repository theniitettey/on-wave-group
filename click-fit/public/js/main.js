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

  $.ajax({
    url: "https://api.restful-api.dev/objects",
    method: "GET",
    dataType: "json",
    success: function (data) {
      const $grid = $("#api-grid");

      const items = data.slice(0, 8);

      items.forEach((item, index) => {
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
    },
    error: function (err) {
      console.error("Error fetching API data:", err);
      $("#api-grid").html(
        '<div class="col-12"><p class="text-danger">Failed to load catalog data.</p></div>',
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
    classes.forEach(function (c) {
      html += `
                <div class="col-md-6 col-lg-3">
                    <div class="p-4 h-100" style="background-color: var(--bg-card); border: 1px solid var(--border); border-top: 3px solid ${c.color};">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <span class="text-accent fw-bold font-mono" style="font-size: 0.8rem; letter-spacing: 1px;">${c.time}</span>
                            <span class="fw-bold px-2 py-1 small" style="background-color: ${c.color}; color: ${c.textColor}; font-size: 0.65rem; letter-spacing: 1px;">${c.label}</span>
                        </div>
                        <h4 class="text-white fw-bolder text-uppercase mb-1" style="font-size: 1.1rem; letter-spacing: 1px;">${c.name}</h4>
                        <p class="text-secondary small mb-4">${c.desc}</p>
                        <div class="d-flex align-items-center gap-3 border-top border-dark pt-3">
                            <span class="text-secondary small font-mono">${c.duration}</span>
                            <span class="text-secondary" style="font-size: 0.7rem;">|</span>
                            <span class="text-white small fw-bold">${c.coach}</span>
                        </div>
                    </div>
                </div>`;
    });
    var $grid = $("#schedule-grid");
    $grid.css("opacity", 0);
    $grid.html(html);
    $grid.animate({ opacity: 1 }, 300);
  }

  $("#schedule [data-day]").on("click", function () {
    var day = $(this).data("day");
    $("#schedule [data-day]").each(function () {
      $(this).css({
        "background-color": "",
        color: "#7a8899",
        "border-color": "#1e2535",
      });
    });
    $(this).css({
      "background-color": "var(--accent)",
      color: "#000",
      "border-color": "var(--accent)",
    });
    renderSchedule(day);
  });

  $("#schedule [data-day]").on("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      $(this).trigger("click");
    }
  });

  renderSchedule("Wednesday");
});
