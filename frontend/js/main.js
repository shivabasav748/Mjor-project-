/* =========================================================
   VENTUREIQ MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   PAGE LOADER
   ========================================================= */

window.addEventListener("load", function () {

  const loader = document.getElementById("pageLoader");

  setTimeout(function () {

    loader.classList.add("hide");

  }, 700);

});



/* =========================================================
   THEME TOGGLE
   ========================================================= */

const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("ventureiq-theme");


if (savedTheme === "light") {

  document.body.classList.add("light-theme");

}


function updateThemeIcon() {

  if (!themeToggle) return;

  if (document.body.classList.contains("light-theme")) {

    themeToggle.innerHTML =
      '<i class="fa-solid fa-moon"></i>';

  } else {

    themeToggle.innerHTML =
      '<i class="fa-solid fa-sun"></i>';

  }

}


updateThemeIcon();


if (themeToggle) {

  themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("light-theme");

    const isLight =
      document.body.classList.contains("light-theme");


    localStorage.setItem(
      "ventureiq-theme",
      isLight ? "light" : "dark"
    );


    updateThemeIcon();

  });

}



/* =========================================================
   MOBILE MENU
   ========================================================= */

const mobileButton =
  document.getElementById("mobileMenuButton");

const mobileNav =
  document.getElementById("mobileNav");


if (mobileButton) {

  mobileButton.addEventListener("click", function () {

    mobileNav.classList.toggle("open");

  });

}


document.querySelectorAll(".mobile-nav a").forEach(function (link) {

  link.addEventListener("click", function () {

    mobileNav.classList.remove("open");

  });

});



/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealElements =
  document.querySelectorAll(".reveal");


const revealObserver =
  new IntersectionObserver(

    function (entries) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

          revealObserver.unobserve(entry.target);

        }

      });

    },

    {
      threshold: 0.12
    }

  );


revealElements.forEach(function (element) {

  revealObserver.observe(element);

});



/* =========================================================
   PROCESS DATA
   ========================================================= */

const processData = {

  1: {

    number: "01",

    icon: "fa-lightbulb",

    label: "INPUT",

    title: "Describe your startup idea",

    text:
      "Start with what you know. Explain the problem, your proposed solution, who it helps and why you believe it matters.",

    preview:
      '"An AI-powered financial coach that helps gig workers manage irregular income..."'

  },


  2: {

    number: "02",

    icon: "fa-brain",

    label: "UNDERSTAND",

    title: "AI understands the concept",

    text:
      "VentureIQ structures your idea into a clear startup hypothesis so the intelligence engine can evaluate the important dimensions.",

    preview:
      '"AI is structuring the problem, solution, audience and value proposition..."'

  },


  3: {

    number: "03",

    icon: "fa-chart-line",

    label: "ANALYSIS",

    title: "Intelligence layers activate",

    text:
      "Market, competition, viability and strategic intelligence layers work together to build a complete view of your opportunity.",

    preview:
      '"Market + Competition + Viability + Strategy analysis activated..."'

  },


  4: {

    number: "04",

    icon: "fa-file-lines",

    label: "REPORT",

    title: "Review your intelligence report",

    text:
      "Explore the structured findings and understand where your startup idea is strong and where risks or opportunities exist.",

    preview:
      '"Your VentureIQ intelligence report is ready for review..."'

  },


  5: {

    number: "05",

    icon: "fa-route",

    label: "ACTION",

    title: "Build your execution roadmap",

    text:
      "Turn your intelligence into practical next steps, from validation and prototyping to testing and launch.",

    preview:
      '"Validate → Prototype → Test → Launch..."'

  }

};



/* =========================================================
   PROCESS BUTTONS
   ========================================================= */

const processButtons =
  document.querySelectorAll(".process-item");


const processNumber =
  document.querySelector(".process-big-number");

const processIcon =
  document.querySelector(".process-display-icon i");

const processLabel =
  document.querySelector(".process-display-label");

const processTitle =
  document.querySelector(".process-display h3");

const processText =
  document.querySelector(".process-display-content > p");

const processPreview =
  document.querySelector(".process-input-preview p");


processButtons.forEach(function (button) {

  button.addEventListener("click", function () {

    const id = button.dataset.process;

    const data = processData[id];

    if (!data) return;


    processButtons.forEach(function (item) {

      item.classList.remove("active");

    });


    button.classList.add("active");


    processNumber.textContent =
      data.number;


    processIcon.className =
      "fa-solid " + data.icon;


    processLabel.textContent =
      data.label;


    processTitle.textContent =
      data.title;


    processText.textContent =
      data.text;


    processPreview.textContent =
      data.preview;

  });

});



/* =========================================================
   DASHBOARD NAV
   ========================================================= */

const dashboardItems =
  document.querySelectorAll(".dashboard-nav-item");


dashboardItems.forEach(function (item) {

  item.addEventListener("click", function (event) {

    event.preventDefault();


    dashboardItems.forEach(function (nav) {

      nav.classList.remove("active");

    });


    item.classList.add("active");

  });

});



/* =========================================================
   ACTIVE NAVIGATION ON SCROLL
   ========================================================= */

const sections =
  document.querySelectorAll("main section[id]");


const navLinks =
  document.querySelectorAll(".desktop-nav .nav-link");


window.addEventListener("scroll", function () {

  let current = "";


  sections.forEach(function (section) {

    const sectionTop =
      section.offsetTop - 150;


    if (window.scrollY >= sectionTop) {

      current = section.getAttribute("id");

    }

  });


  navLinks.forEach(function (link) {

    link.classList.remove("active");


    if (
      link.getAttribute("href") === "#" + current
    ) {

      link.classList.add("active");

    }

  });

});



/* =========================================================
   FOOTER YEAR
   ========================================================= */

const footerYear =
  document.getElementById("footerYear");


if (footerYear) {

  footerYear.textContent =
    new Date().getFullYear();

}