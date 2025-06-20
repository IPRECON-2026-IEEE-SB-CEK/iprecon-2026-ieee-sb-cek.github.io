/**
 * IPRECON 2026 - Common JavaScript
 * Contains only shared functionality used across all pages
 * - Mobile navigation menu
 * - Sticky navbar behavior
 * - Marquee animations and sticky behavior
 * - Responsive handling
 * - Auto copyright year update
 */

document.addEventListener("DOMContentLoaded", function () {
  // Get all necessary common elements
  const navbar = document.getElementById("navbar");
  const desktopMarquee = document.querySelector(".non-mob.marquee-container");
  const mobileMarquee = document.querySelector(".mob-marq.marquee-container");
  const navItems = document.querySelectorAll(".nav-item");
  const brandLogo = document.getElementById("brandLogo");

  /**
   * Update copyright year automatically
   */
  function updateCopyrightYear() {
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.querySelector('.copyright');
    
    if (copyrightElement) {
      copyrightElement.innerHTML = `Built with <i class="fas fa-heart"></i> | IEEE SB CEK © ${currentYear}`;
    }
  }

  // Update copyright year immediately
  updateCopyrightYear();

  // Create mobile menu button once
  const mobileMenuBtn = document.createElement("button");
  mobileMenuBtn.classList.add("mobile-menu-btn");
  mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
  mobileMenuBtn.setAttribute("aria-label", "Toggle navigation menu");

  // Mobile menu state variables
  let mobileMenuInitialized = false;
  let menuOverlay = null;
  let menuClose = null;

  // Store original position of the desktop marquee
  let desktopMarqueeOriginalTop = 0;
  if (desktopMarquee) {
    desktopMarqueeOriginalTop =
      desktopMarquee.getBoundingClientRect().top + window.pageYOffset;
  }

  // Store navbar height
  let navbarHeight = navbar ? navbar.offsetHeight : 0;

  // Create placeholder for marquee when it becomes fixed
  const marqueeHeight = desktopMarquee ? desktopMarquee.offsetHeight : 0;
  const marqueePlaceholder =
    document.getElementById("marquee-placeholder") ||
    document.createElement("div");
  marqueePlaceholder.id = "marquee-placeholder";
  marqueePlaceholder.style.height = marqueeHeight + "px";
  marqueePlaceholder.style.display = "none";

  // Insert placeholder after marquee if it doesn't exist
  if (!document.getElementById("marquee-placeholder") && desktopMarquee) {
    desktopMarquee.parentNode.insertBefore(
      marqueePlaceholder,
      desktopMarquee.nextSibling
    );
  }

  /**
   * Close mobile menu and reset states
   */
  function closeMobileMenu() {
    const navItemsList = document.querySelector(".nav-items");
    if (navItemsList && menuOverlay) {
      navItemsList.classList.remove("show");
      menuOverlay.classList.remove("show");
      document.body.style.overflow = "";

      // Reset menu button icon
      const menuBtnIcon = mobileMenuBtn.querySelector("i");
      if (menuBtnIcon) {
        menuBtnIcon.className = "fas fa-bars";
      }

      // Reset all dropdown states
      navItems.forEach((item) => {
        item.classList.remove("active");
        const icon = item.querySelector(".dropdown-toggle i");
        if (icon) {
          icon.className = "fas fa-chevron-down";
        }
        item.setAttribute("aria-expanded", "false");
      });
    }
  }

  /**
   * Initialize mobile menu functionality
   */
  function initializeMobileMenu() {
    if (mobileMenuInitialized) return;

    const navContainer = document.querySelector(".nav-container");
    const navItemsList = document.querySelector(".nav-items");

    if (window.innerWidth <= 1024) {
      // Create overlay background if it doesn't exist
      if (!menuOverlay) {
        menuOverlay = document.createElement("div");
        menuOverlay.className = "menu-overlay";
        document.body.appendChild(menuOverlay);
      }

      // Create close button if it doesn't exist
      if (!menuClose) {
        menuClose = document.createElement("div");
        menuClose.className = "menu-close";
        menuClose.innerHTML = '<i class="fas fa-times"></i>';
        navItemsList.prepend(menuClose);
      }

      // Add button to the nav container if not already there
      if (navContainer && !navContainer.contains(mobileMenuBtn)) {
        navContainer.prepend(mobileMenuBtn);
      }

      // Mobile menu button click handler
      mobileMenuBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (navItemsList) {
          const isOpen = navItemsList.classList.contains("show");

          if (isOpen) {
            closeMobileMenu();
          } else {
            navItemsList.classList.add("show");
            menuOverlay.classList.add("show");
            document.body.style.overflow = "hidden";

            const icon = this.querySelector("i");
            if (icon) {
              icon.className = "fas fa-times";
            }
          }
        }
      });

      // Menu close button click handler
      menuClose.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeMobileMenu();
      });

      // Overlay click handler
      menuOverlay.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeMobileMenu();
      });

      // Setup navigation items with dropdown functionality
      navItems.forEach((item) => {
        const hasDropdown = item.querySelector(".dropdown-content") !== null;
        const mainLink = item.querySelector("a, .nav-link");

        if (hasDropdown) {
          // Create wrapper div if it doesn't exist
          let navLinkWrapper = item.querySelector(".nav-link-with-toggle");
          if (!navLinkWrapper) {
            navLinkWrapper = document.createElement("div");
            navLinkWrapper.classList.add("nav-link-with-toggle");

            // Move the main link into the wrapper
            navLinkWrapper.appendChild(mainLink);

            // Add chevron toggle indicator
            let toggleIndicator = document.createElement("span");
            toggleIndicator.classList.add("dropdown-toggle");
            toggleIndicator.innerHTML = '<i class="fas fa-chevron-down"></i>';
            navLinkWrapper.appendChild(toggleIndicator);

            // Insert wrapper at top of .nav-item
            item.prepend(navLinkWrapper);
          }

          // Add accessibility attributes
          item.setAttribute("aria-expanded", "false");
          item.setAttribute("aria-haspopup", "true");

          // Handle wrapper click for dropdown toggle
          navLinkWrapper.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            // If clicking on mainLink and it has a real URL, navigate and close menu
            if (e.target === mainLink) {
              if (
                mainLink.tagName === "A" &&
                mainLink.getAttribute("href") &&
                mainLink.getAttribute("href") !== "#"
              ) {
                closeMobileMenu();
                return;
              }
            }

            // Close other dropdowns
            navItems.forEach((otherItem) => {
              if (
                otherItem !== item &&
                otherItem.classList.contains("active")
              ) {
                otherItem.classList.remove("active");
                const otherIcon = otherItem.querySelector(".dropdown-toggle i");
                if (otherIcon) {
                  otherIcon.className = "fas fa-chevron-down";
                }
                otherItem.setAttribute("aria-expanded", "false");
              }
            });

            // Toggle current dropdown
            const isActive = item.classList.contains("active");

            if (isActive) {
              item.classList.remove("active");
              item.setAttribute("aria-expanded", "false");
            } else {
              item.classList.add("active");
              item.setAttribute("aria-expanded", "true");
            }

            // Update chevron icon
            const icon = item.querySelector(".dropdown-toggle i");
            if (icon) {
              icon.className = item.classList.contains("active")
                ? "fas fa-chevron-up"
                : "fas fa-chevron-down";
            }
          });

          // Handle dropdown item clicks
          const dropdownItems = item.querySelectorAll(".dropdown-item");
          dropdownItems.forEach((dropdownItem) => {
            dropdownItem.addEventListener("click", function (e) {
              closeMobileMenu();
            });
          });
        } else {
          // For items without dropdown, handle navigation
          if (mainLink) {
            mainLink.addEventListener("click", function (e) {
              closeMobileMenu();
            });
          }
        }
      });

      mobileMenuInitialized = true;
    }
  }

  /**
   * Handle responsive behavior changes
   */
  function handleResponsive() {
    const navItemsList = document.querySelector(".nav-items");

    if (window.innerWidth <= 1024) {
      // Initialize mobile menu if not already done
      initializeMobileMenu();
    } else {
      // Clean up mobile behavior on larger screens
      if (navItemsList) {
        navItemsList.classList.remove("show");
      }

      // Remove overlay if exists
      if (menuOverlay) {
        menuOverlay.classList.remove("show");
      }

      // Enable scrolling
      document.body.style.overflow = "";

      // Reset all nav item states
      navItems.forEach((item) => {
        item.classList.remove("active");

        // Reset chevron icons
        const icon = item.querySelector(".dropdown-toggle i");
        if (icon) {
          icon.className = "fas fa-chevron-down";
        }

        // Reset aria attributes
        item.setAttribute("aria-expanded", "false");
      });

      // Reset menu button icon
      const menuBtnIcon = mobileMenuBtn.querySelector("i");
      if (menuBtnIcon) {
        menuBtnIcon.className = "fas fa-bars";
      }
    }
  }

  /**
   * Handle scroll behavior for sticky navbar and marquee
   */
  function handleScroll() {
    // Update navbar height for accuracy
    navbarHeight = navbar ? navbar.offsetHeight : 0;

    // Handle navbar stickiness
    if (window.pageYOffset > 90) {
      if (navbar) {
        navbar.classList.add("sticky");
        if (brandLogo) {
          brandLogo.style.display = "block";
        }
      }
    } else {
      if (navbar) {
        navbar.classList.remove("sticky");
        if (brandLogo && window.innerWidth <= 1024) {
          // Keep logo visible on mobile even when not sticky
          brandLogo.style.display = "block";
        } else if (brandLogo) {
          brandLogo.style.display = "none";
        }
      }
    }

    // Handle desktop marquee - make it sticky when it reaches navbar
    if (desktopMarquee && window.innerWidth > 1024) {
      if (window.pageYOffset + navbarHeight >= desktopMarqueeOriginalTop) {
        // Make the marquee sticky
        desktopMarquee.style.position = "fixed";
        desktopMarquee.style.top = navbarHeight + "px";
        desktopMarquee.style.left = "0";
        desktopMarquee.style.width = "100%";
        desktopMarquee.style.zIndex = "1000";

        // Show placeholder to prevent content jump
        marqueePlaceholder.style.display = "block";
      } else {
        // Return to normal position
        desktopMarquee.style.position = "";
        desktopMarquee.style.top = "";
        desktopMarquee.style.left = "";
        desktopMarquee.style.width = "";

        // Hide placeholder
        marqueePlaceholder.style.display = "none";
      }
    }

    // Handle mobile marquee behavior
    if (mobileMarquee && window.innerWidth <= 1024) {
      if (window.pageYOffset > 90) {
        // When scrolled down, change to light background with dark text
        mobileMarquee.style.backgroundColor = "#f5f5f5";

        const notifications = mobileMarquee.querySelectorAll(".notification");
        notifications.forEach((notification) => {
          notification.style.color = "#333";
        });

        // Make sticky
        mobileMarquee.style.position = "fixed";
        mobileMarquee.style.top = navbarHeight + "px";
        mobileMarquee.style.left = "0";
        mobileMarquee.style.width = "100%";
        mobileMarquee.style.zIndex = "1000";
      } else {
        // At the top - keep dark background with white text
        mobileMarquee.style.backgroundColor = "#211021";

        const notifications = mobileMarquee.querySelectorAll(".notification");
        notifications.forEach((notification) => {
          notification.style.color = "white";
        });

        // Reset position when at the top
        mobileMarquee.style.position = "";
        mobileMarquee.style.top = "";
        mobileMarquee.style.left = "";
        mobileMarquee.style.width = "";
      }
    }
  }

  /**
   * Optimize marquee animation speed based on content width
   */
  function adjustMarqueeSpeed() {
    const marquees = document.querySelectorAll(".marquee");

    marquees.forEach((marquee) => {
      // Get the total width of the marquee content
      const contentWidth = marquee.scrollWidth;

      // Get viewport width to calculate travel distance
      const viewportWidth = window.innerWidth;

      // Total distance to travel = content width + viewport width
      const totalDistance = contentWidth + viewportWidth;

      // Calculate speed (pixels per second) - adjust this value to change overall speed
      const baseSpeed = 170; // pixels per second

      // Calculate duration based on distance and speed (in seconds)
      const duration = totalDistance / baseSpeed;

      // Apply the calculated duration
      marquee.style.animationDuration = duration + "s";

      // Debug logging for development environments
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        console.log("Marquee width:", contentWidth, "px");
        console.log("Animation duration:", duration, "s");
      }
    });
  }

  // Handle scroll behavior with throttling for performance
  let isScrolling = false;
  window.addEventListener("scroll", function () {
    if (!isScrolling) {
      isScrolling = true;
      window.requestAnimationFrame(function () {
        handleScroll();
        isScrolling = false;
      });
    }
  });

  // Handle window resize with proper cleanup and debouncing
  let resizeTimeout;
  window.addEventListener("resize", function () {
    // Debounce resize event
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      // Update marquee original position on resize
      if (desktopMarquee) {
        // Reset position first to get true position
        desktopMarquee.style.position = "";
        desktopMarquee.style.top = "";
        desktopMarquee.style.left = "";
        desktopMarquee.style.width = "";

        // Then measure its position
        desktopMarqueeOriginalTop =
          desktopMarquee.getBoundingClientRect().top + window.pageYOffset;

        // Update placeholder height
        const marqueeHeight = desktopMarquee.offsetHeight;
        marqueePlaceholder.style.height = marqueeHeight + "px";
      }

      // Update navbar height
      navbarHeight = navbar ? navbar.offsetHeight : 0;

      // Handle responsive behavior
      handleResponsive();

      // Update scroll state
      handleScroll();

      // Adjust marquee speed for new viewport
      adjustMarqueeSpeed();
    }, 250);
  });

  // Initialize everything
  handleResponsive();
  handleScroll();
  adjustMarqueeSpeed();

  // Also call marquee speed adjustment on content reflow
  window.addEventListener("load", adjustMarqueeSpeed);

  // Debug logging for development environments
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    console.log("IPRECON 2026 Common Script Initialized");
    console.log("Mobile menu initialized:", mobileMenuInitialized);
    console.log("Navbar height:", navbarHeight);
    console.log("Desktop marquee found:", !!desktopMarquee);
    console.log("Mobile marquee found:", !!mobileMarquee);
    console.log("Copyright year updated to:", new Date().getFullYear());
  }
});