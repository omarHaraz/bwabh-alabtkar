/* ==========================================================
   DASHBOARD RESPONSIVE ADD-ON — sidenav toggle
   Load this AFTER your existing material-dashboard / soft-ui JS.
   Safe to include even if that JS already binds these buttons —
   it only adds/removes a class and won't throw if elements exist.
========================================================== */

(function () {
  var body = document.body;

  function openSidenav() {
    body.classList.add("g-sidenav-show");
  }

  function closeSidenav() {
    body.classList.remove("g-sidenav-show");
  }

  function toggleSidenav() {
    body.classList.toggle("g-sidenav-show");
  }

  // Event delegation on document instead of getElementById + addEventListener.
  // #iconNavbarSidenav and #iconSidenav live inside navbar.html / the sidenav,
  // which loadComponents.js injects via fetch() AFTER DOMContentLoaded has
  // already fired. Binding directly to those elements on DOMContentLoaded
  // means they don't exist yet, so the click listener never attaches.
  // Delegation works regardless of when those elements get injected.
  document.addEventListener("click", function (e) {
    var toggleBtn = e.target.closest("#iconNavbarSidenav");
    var openBtn = e.target.closest("#iconSidenav");

    if (toggleBtn) {
      e.preventDefault();
      toggleSidenav();
      return;
    }

    if (openBtn) {
      e.preventDefault();
      closeSidenav();
      return;
    }

    // click outside the sidenav while it's open -> close it
    if (body.classList.contains("g-sidenav-show")) {
      var sidenav = document.getElementById("sidenav-main");
      var clickedInsideSidenav = sidenav && sidenav.contains(e.target);
      var clickedToggle = e.target.closest("#iconNavbarSidenav");

      if (!clickedInsideSidenav && !clickedToggle) {
        closeSidenav();
      }
    }
  });

  // close automatically if the window is resized back up to desktop
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1200) {
      closeSidenav();
    }
  });

  // close on Escape for keyboard users
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSidenav();
  });
})();