document.addEventListener('DOMContentLoaded', function() {
    // Get all necessary elements
    const navbar = document.getElementById('navbar');
    const desktopMarquee = document.querySelector('.non-mob.marquee-container');
    const mobileMarquee = document.querySelector('.mob-marq.marquee-container');
    const navItems = document.querySelectorAll('.nav-item');
    const brandLogo = document.getElementById('brandLogo');
    const mobileMenuBtn = document.createElement('button');
    
    // Get all carousel slides and log the count (debugging)
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    console.log('Total slides found:', totalSlides); // Should show 4
    
    // Store original position of the desktop marquee
    let desktopMarqueeOriginalTop = 0;
    if (desktopMarquee) {
        desktopMarqueeOriginalTop = desktopMarquee.getBoundingClientRect().top + window.pageYOffset;
    }
    
    // Setup mobile menu button
    mobileMenuBtn.classList.add('mobile-menu-btn');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');
    
    // Store navbar height
    let navbarHeight = navbar ? navbar.offsetHeight : 0;
    
    // Create placeholder for marquee when it becomes fixed
    const marqueeHeight = desktopMarquee ? desktopMarquee.offsetHeight : 0;
    const marqueePlaceholder = document.getElementById('marquee-placeholder') || document.createElement('div');
    marqueePlaceholder.id = 'marquee-placeholder';
    marqueePlaceholder.style.height = marqueeHeight + 'px';
    marqueePlaceholder.style.display = 'none';
    
    // Insert placeholder after marquee if it doesn't exist
    if (!document.getElementById('marquee-placeholder') && desktopMarquee) {
        desktopMarquee.parentNode.insertBefore(marqueePlaceholder, desktopMarquee.nextSibling);
    }
    
    // Setup mobile menu functionality
    function setupMobileMenu() {
        const navContainer = document.querySelector('.nav-container');
        const navItemsList = document.querySelector('.nav-items');
        
        // Remove any existing mobile menu button first
        const existingBtn = document.querySelector('.mobile-menu-btn');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        if (window.innerWidth <= 1024) {
            // Create overlay background if it doesn't exist
            let menuOverlay = document.querySelector('.menu-overlay');
            if (!menuOverlay) {
                menuOverlay = document.createElement('div');
                menuOverlay.className = 'menu-overlay';
                document.body.appendChild(menuOverlay);
            }
            
            // Create close button if it doesn't exist
            let menuClose = navItemsList.querySelector('.menu-close');
            if (!menuClose) {
                menuClose = document.createElement('div');
                menuClose.className = 'menu-close';
                menuClose.innerHTML = '<i class="fas fa-times"></i>';
                navItemsList.prepend(menuClose);
            }
            
            // Add button to the nav container
            if (navContainer) {
                navContainer.prepend(mobileMenuBtn);
            }
            
            // Add click event to toggle menu
            mobileMenuBtn.addEventListener('click', function() {
                if (navItemsList) {
                    navItemsList.classList.toggle('show');
                    menuOverlay.classList.toggle('show');
                    
                    // Toggle icon
                    const icon = this.querySelector('i');
                    if (navItemsList.classList.contains('show')) {
                        icon.className = 'fas fa-times';
                        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
                    } else {
                        icon.className = 'fas fa-bars';
                        document.body.style.overflow = ''; // Allow scrolling again
                    }
                }
            });
            
            // Close menu on close button click
            menuClose.addEventListener('click', function() {
                navItemsList.classList.remove('show');
                menuOverlay.classList.remove('show');
                document.body.style.overflow = ''; // Allow scrolling again
                
                // Reset menu button icon
                const menuBtnIcon = mobileMenuBtn.querySelector('i');
                if (menuBtnIcon) {
                    menuBtnIcon.className = 'fas fa-bars';
                }
            });
            
            // Close menu when clicking on overlay
            menuOverlay.addEventListener('click', function() {
                navItemsList.classList.remove('show');
                menuOverlay.classList.remove('show');
                document.body.style.overflow = ''; // Allow scrolling again
                
                // Reset menu button icon
                const menuBtnIcon = mobileMenuBtn.querySelector('i');
                if (menuBtnIcon) {
                    menuBtnIcon.className = 'fas fa-bars';
                }
            });
            
            // Setup dropdown toggles for mobile
            navItems.forEach(item => {
                // Check if this item has a dropdown
                const hasDropdown = item.querySelector('.dropdown-content') !== null;
                
                if (hasDropdown) {
                    // Create toggle indicator if it doesn't exist
                    let toggleIndicator = item.querySelector('.dropdown-toggle');
                    if (!toggleIndicator) {
                        toggleIndicator = document.createElement('span');
                        toggleIndicator.classList.add('dropdown-toggle');
                        toggleIndicator.innerHTML = ' <i class="fas fa-chevron-down"></i>';
                        toggleIndicator.style.marginLeft = '8px';
                        item.appendChild(toggleIndicator);
                    }
                    
                    // Remove any existing click event
                    item.removeEventListener('click', toggleDropdown);
                    
                    // Add click event for mobile dropdown toggle
                    item.addEventListener('click', toggleDropdown);
                }
            });
        } else {
            // Remove mobile-specific classes on larger screens
            if (navItemsList) {
                navItemsList.classList.remove('show');
                
                // Remove close button if exists
                const menuClose = navItemsList.querySelector('.menu-close');
                if (menuClose) {
                    menuClose.remove();
                }
            }
            
            // Remove overlay if exists
            const menuOverlay = document.querySelector('.menu-overlay');
            if (menuOverlay) {
                menuOverlay.classList.remove('show');
            }
            
            // Enable scrolling
            document.body.style.overflow = '';
            
            // Remove active class from all nav items
            navItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    }
    
    // Function to toggle dropdown on mobile
    function toggleDropdown(e) {
        if (window.innerWidth <= 1024) {
            // Toggle active class which shows/hides dropdown
            this.classList.toggle('active');
            
            // Update the icon direction
            const icon = this.querySelector('.dropdown-toggle i');
            if (icon) {
                if (this.classList.contains('active')) {
                    icon.className = 'fas fa-chevron-up';
                } else {
                    icon.className = 'fas fa-chevron-down';
                }
            }
            
            // Prevent the click from triggering parent elements
            e.stopPropagation();
            
            // Get all dropdown items within this nav item
            const dropdownItems = this.querySelectorAll('.dropdown-item');
            
            // Add click stopPropagation to dropdown items
            dropdownItems.forEach(dropItem => {
                dropItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            });
        }
    }
    
    // Handle scroll behavior with throttling
    let isScrolling = false;
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            isScrolling = true;
            window.requestAnimationFrame(function() {
                handleScroll();
                isScrolling = false;
            });
        }
    });
    
    function handleScroll() {
        // Update navbar height for accuracy
        navbarHeight = navbar ? navbar.offsetHeight : 0;
        
        // Handle navbar stickiness
        if (window.pageYOffset > 90) {
            if (navbar) {
                navbar.classList.add('sticky');
                if (brandLogo) {
                    brandLogo.style.display = 'block';
                }
            }
        } else {
            if (navbar) {
                navbar.classList.remove('sticky');
                if (brandLogo && window.innerWidth <= 1024) {
                    // Keep logo visible on mobile even when not sticky
                    brandLogo.style.display = 'block';
                } else if (brandLogo) {
                    brandLogo.style.display = 'none';
                }
            }
        }
        
        // Handle desktop marquee - make it sticky ONLY when it's about to pass the navbar
        if (desktopMarquee && window.innerWidth > 1024) {
            // If scroll position + navbar height is greater than or equal to the marquee's original position
            if (window.pageYOffset + navbarHeight >= desktopMarqueeOriginalTop) {
                // Make the marquee sticky
                desktopMarquee.style.position = 'fixed';
                desktopMarquee.style.top = navbarHeight + 'px';
                desktopMarquee.style.left = '0';
                desktopMarquee.style.width = '100%';
                desktopMarquee.style.zIndex = '1000';
                
                // Show placeholder to prevent content jump
                marqueePlaceholder.style.display = 'block';
            } else {
                // Return to normal position
                desktopMarquee.style.position = '';
                desktopMarquee.style.top = '';
                desktopMarquee.style.left = '';
                desktopMarquee.style.width = '';
                
                // Hide placeholder
                marqueePlaceholder.style.display = 'none';
            }
        }
        
        // Handle mobile marquee behavior
        if (mobileMarquee && window.innerWidth <= 1024) {
            if (window.pageYOffset > 90) {
                // When scrolled down, change to light background with dark text
                mobileMarquee.style.backgroundColor = '#f5f5f5';
                
                const notifications = mobileMarquee.querySelectorAll('.notification');
                notifications.forEach(notification => {
                    notification.style.color = '#333';
                });
                
                // Make sticky
                mobileMarquee.style.position = 'fixed';
                mobileMarquee.style.top = navbarHeight + 'px';
                mobileMarquee.style.left = '0';
                mobileMarquee.style.width = '100%';
                mobileMarquee.style.zIndex = '1000';
            } else {
                // At the top - keep dark background with white text
                mobileMarquee.style.backgroundColor = '#211021';
                
                const notifications = mobileMarquee.querySelectorAll('.notification');
                notifications.forEach(notification => {
                    notification.style.color = 'white';
                });
                
                // Reset position when at the top
                mobileMarquee.style.position = '';
                mobileMarquee.style.top = '';
                mobileMarquee.style.left = '';
                mobileMarquee.style.width = '';
            }
        }
    }
    
    // Carousel functions
    let currentSlide = 0;
    
    function showSlide(n) {
        // Make sure n is within bounds
        if (n >= totalSlides) {
            n = 0;
        }
        if (n < 0) {
            n = totalSlides - 1;
        }
        
        // Remove active class from all slides
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Add active class to the current slide
        slides[n].classList.add('active');
        
        // Update current slide index
        currentSlide = n;
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        // Debounce resize event
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Update marquee original position on resize
            if (desktopMarquee) {
                // Reset position first to get true position
                desktopMarquee.style.position = '';
                desktopMarquee.style.top = '';
                desktopMarquee.style.left = '';
                desktopMarquee.style.width = '';
                
                // Then measure its position
                desktopMarqueeOriginalTop = desktopMarquee.getBoundingClientRect().top + window.pageYOffset;
                
                // Update placeholder height
                const marqueeHeight = desktopMarquee.offsetHeight;
                marqueePlaceholder.style.height = marqueeHeight + 'px';
            }
            
            // Update navbar height
            navbarHeight = navbar ? navbar.offsetHeight : 0;
            
            // Update mobile menu
            setupMobileMenu();
            
            // Update scroll state
            handleScroll();
        }, 250);
    });
    
    // Initialize
    setupMobileMenu();
    handleScroll();
    
    // Initialize carousel - ensure all 4 slides work
    if (slides.length > 0) {
        // Set first slide as active
        showSlide(0);
        
        // Change slides every 5 seconds
        setInterval(nextSlide, 5000);
    }
    
    // Initialize Carousel Buttons link behavior
    const carouselButtons = document.querySelectorAll('.carousel-btn');
    carouselButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                // Smooth scroll to relevant section if href is just a placeholder
                const targetSection = this.getAttribute('data-target');
                if (targetSection) {
                    const section = document.getElementById(targetSection);
                    if (section) {
                        section.scrollIntoView({behavior: 'smooth'});
                    }
                }
            }
        });
    });

    function adjustMarqueeSpeed() {
        // Get all marquee elements
        const marquees = document.querySelectorAll('.marquee');
        
        marquees.forEach(marquee => {
          // Get the total width of the marquee content
          const contentWidth = marquee.scrollWidth;
          
          // Get viewport width to calculate how far the marquee needs to travel
          const viewportWidth = window.innerWidth;
          
          // Total distance to travel = content width + viewport width
          const totalDistance = contentWidth + viewportWidth;
          
          // Calculate a base speed (px per second) - adjust this value to change overall speed
          const baseSpeed = 220; // pixels per second
          
          // Calculate duration based on distance and speed (in seconds)
          const duration = totalDistance / baseSpeed;
          
          // Apply the calculated duration
          marquee.style.animationDuration = duration + 's';
          
          // For debugging
          console.log('Marquee width:', contentWidth, 'px');
          console.log('Animation duration:', duration, 's');
        });
      }
      
      // Call this function on page load
      adjustMarqueeSpeed();
      
      // Also call it on window resize in case content reflows
      window.addEventListener('resize', adjustMarqueeSpeed);
});