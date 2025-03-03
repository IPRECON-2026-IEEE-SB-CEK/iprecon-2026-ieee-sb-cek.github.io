// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[n].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// Change slides every 5 seconds
setInterval(nextSlide, 5000);

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const marqueeContainer = document.querySelector('.marquee-container');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Store the original offset of the marquee and navbar heights
    let marqueeOffset = 0;
    let navbarHeight = 0;
    
    // Calculate heights and positions once the DOM is fully loaded
    if (navbar && marqueeContainer) {
        navbarHeight = navbar.offsetHeight;
        marqueeOffset = marqueeContainer.offsetTop;
        
        // Create a placeholder div for the marquee
        const placeholder = document.createElement('div');
        placeholder.id = 'marquee-placeholder';
        placeholder.style.height = marqueeContainer.offsetHeight + 'px';
        placeholder.style.display = 'none';
        
        // Insert placeholder after marquee
        marqueeContainer.parentNode.insertBefore(placeholder, marqueeContainer.nextSibling);
    }
    
    // Enhanced mobile navigation - handle dropdown toggling
    navItems.forEach(item => {
        // Check if this item has a dropdown
        const hasDropdown = item.querySelector('.dropdown-content') !== null;
        
        if (hasDropdown && window.innerWidth <= 768) {
            // Create a toggle indicator for mobile
            const toggleIndicator = document.createElement('span');
            toggleIndicator.classList.add('dropdown-toggle');
            toggleIndicator.innerHTML = ' <i class="fas fa-chevron-down"></i>';
            toggleIndicator.style.marginLeft = '8px';
            
            // Append the indicator to nav items with dropdowns
            item.appendChild(toggleIndicator);
            
            // Add click event for mobile dropdown toggle
            item.addEventListener('click', function(e) {
                // Only toggle if we're in mobile view
                if (window.innerWidth <= 768) {
                    // Toggle active class which shows/hides dropdown
                    this.classList.toggle('active');
                    
                    // Update the icon direction
                    const icon = this.querySelector('.dropdown-toggle i');
                    if (this.classList.contains('active')) {
                        icon.className = 'fas fa-chevron-up';
                    } else {
                        icon.className = 'fas fa-chevron-down';
                    }
                    
                    // Prevent the click from triggering parent elements
                    e.stopPropagation();
                }
            });
            
            // Prevent dropdown items from toggling the parent
            const dropdownItems = item.querySelectorAll('.dropdown-item');
            dropdownItems.forEach(dropItem => {
                dropItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            });
        }
    });
    
    // Scroll handler with throttling for better performance
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
        // Update navbar height to ensure it's accurate
        if (navbar) {
            navbarHeight = navbar.offsetHeight;
        }
        
        // Handle navbar
        if (window.pageYOffset > 100) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
        
        // Handle marquee
        if (marqueeContainer) {
            const placeholder = document.getElementById('marquee-placeholder');
            
            if (window.pageYOffset >= marqueeOffset) {
                // Position the marquee below the navbar
                marqueeContainer.style.position = 'fixed';
                marqueeContainer.style.top = navbarHeight + 'px';
                marqueeContainer.style.left = '0';
                marqueeContainer.style.width = '100%';
                
                // Show placeholder
                placeholder.style.display = 'block';
            } else {
                // Reset properties
                marqueeContainer.style.position = '';
                marqueeContainer.style.top = '';
                marqueeContainer.style.left = '';
                marqueeContainer.style.width = '';
                
                // Hide placeholder
                placeholder.style.display = 'none';
            }
        }
    }
    
    // Mobile menu toggle functionality
    function setupMobileMenu() {
        const navContainer = document.querySelector('.nav-container');
        const navItemsList = document.querySelector('.nav-items');
        
        // Remove any existing mobile menu button first
        const existingBtn = document.querySelector('.mobile-menu-btn');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        if (window.innerWidth <= 768) {
            // Create mobile menu button with hamburger icon
            const mobileMenuBtn = document.createElement('button');
            mobileMenuBtn.classList.add('mobile-menu-btn');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');
            
            // Add button to the nav container
            navContainer.prepend(mobileMenuBtn);
            
            // Add click event to toggle menu
            mobileMenuBtn.addEventListener('click', function() {
                navItemsList.classList.toggle('show');
                
                // Toggle icon between bars and X
                const icon = this.querySelector('i');
                if (navItemsList.classList.contains('show')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!navContainer.contains(e.target) && navItemsList.classList.contains('show')) {
                    navItemsList.classList.remove('show');
                    mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
                }
            });
        } else {
            // Remove mobile-specific classes on larger screens
            navItemsList.classList.remove('show');
            
            // Remove active class from all nav items
            navItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    }
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        // Debounce resize event
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Update mobile menu
            setupMobileMenu();
            
            // Update measurements on resize
            if (navbar && marqueeContainer) {
                // Get the current state
                const wasSticky = marqueeContainer.style.position === 'fixed';
                
                // Reset positions for accurate measurement
                if (wasSticky) {
                    marqueeContainer.style.position = '';
                    marqueeContainer.style.top = '';
                }
                
                // Update values
                navbarHeight = navbar.offsetHeight;
                marqueeOffset = marqueeContainer.offsetTop;
                
                // Update placeholder height
                const placeholder = document.getElementById('marquee-placeholder');
                if (placeholder) {
                    placeholder.style.height = marqueeContainer.offsetHeight + 'px';
                }
                
                // Restore sticky state if needed
                if (wasSticky && window.pageYOffset >= marqueeOffset) {
                    marqueeContainer.style.position = 'fixed';
                    marqueeContainer.style.top = navbarHeight + 'px';
                    marqueeContainer.style.left = '0';
                    marqueeContainer.style.width = '100%';
                }
            }
        }, 250);
    });
    
    // Initialize mobile menu
    setupMobileMenu();
    
    // Initialize scroll state
    handleScroll();
    
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
});