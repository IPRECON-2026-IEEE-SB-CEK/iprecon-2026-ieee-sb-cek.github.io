// Committee Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get all committee cards
    const committeeCards = document.querySelectorAll('.committee-card');
    
    // Add click event listeners to each card
    committeeCards.forEach(card => {
        // Make cards focusable for accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'View LinkedIn profile');
        
        // Click event for the entire card
        card.addEventListener('click', function(e) {
            e.preventDefault();
            handleCardClick(this);
        });
        
        // Keyboard accessibility
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick(this);
            }
        });
        
        // LinkedIn icon specific click handler
        const linkedinIcon = card.querySelector('.linkedin-icon');
        if (linkedinIcon) {
            linkedinIcon.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent card click
                handleCardClick(card);
            });
        }
        
        // Add hover effects for better UX
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
    
    // Function to handle card clicks
    function handleCardClick(card) {
        const linkedinUrl = card.getAttribute('data-linkedin');
        const memberName = card.querySelector('.member-name').textContent;
        
        if (linkedinUrl && linkedinUrl !== '#') {
            // Add visual feedback
            card.classList.add('clicked');
            
            // Remove the class after animation
            setTimeout(() => {
                card.classList.remove('clicked');
            }, 200);
            
            // Open LinkedIn profile in new tab
            window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
            
            // Analytics tracking (if you have analytics setup)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'committee_linkedin_click', {
                    'committee_member': memberName,
                    'linkedin_url': linkedinUrl
                });
            }
        } else {
            // Show a message if no LinkedIn URL is provided
            showToast(`LinkedIn profile not available for ${memberName}`);
        }
    }
    
    // Simple toast notification function
    function showToast(message) {
        // Check if toast container exists, if not create it
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            toastContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            background: #333;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            margin-bottom: 10px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            font-size: 14px;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        toastContainer.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    // Fixed Lazy loading for images
    function setupLazyLoading() {
        const images = document.querySelectorAll('.card-image img');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const cardImage = img.parentElement;
                        
                        // Show loading spinner
                        cardImage.classList.add('loading');
                        
                        // Create a new image to test loading
                        const newImg = new Image();
                        
                        newImg.onload = function() {
                            // Image loaded successfully
                            img.src = this.src;
                            cardImage.classList.remove('loading');
                            cardImage.classList.add('loaded');
                        };
                        
                        newImg.onerror = function() {
                            // Image failed to load
                            cardImage.classList.remove('loading');
                            cardImage.classList.add('error');
                            
                            // Set a placeholder image
                            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                        };
                        
                        // Start loading the image
                        newImg.src = img.getAttribute('src');
                        
                        // Stop observing this image
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px', // Start loading 50px before the image comes into view
                threshold: 0.1
            });
            
            images.forEach(img => {
                // Initially hide the image until it's loaded
                img.style.opacity = '0';
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            images.forEach(img => {
                const cardImage = img.parentElement;
                cardImage.classList.add('loading');
                
                img.onload = function() {
                    cardImage.classList.remove('loading');
                    cardImage.classList.add('loaded');
                    this.style.opacity = '1';
                };
                
                img.onerror = function() {
                    cardImage.classList.remove('loading');
                    cardImage.classList.add('error');
                    this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                };
            });
        }
    }
    
    // Initialize lazy loading
    setupLazyLoading();
    
    // Add CSS for loading states
    const style = document.createElement('style');
    style.textContent = `
        .card-image.loading::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 40px;
            height: 40px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #8e24aa;
            border-radius: 50%;
            animation: committee-spin 1s linear infinite;
            transform: translate(-50%, -50%);
            z-index: 2;
        }
        
        .card-image.loading::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(240, 240, 240, 0.8);
            z-index: 1;
        }
        
        @keyframes committee-spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .card-image.loaded img {
            opacity: 1 !important;
            transition: opacity 0.3s ease;
        }
        
        .card-image.error::after {
            content: 'Image not available';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #666;
            font-size: 14px;
            background: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 8px;
            max-width: 80%;
            z-index: 2;
        }
        
        .card-image.error::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #f0f0f0;
            z-index: 1;
        }
    `;
    document.head.appendChild(style);
    
    // Add keyboard navigation between cards
    function setupKeyboardNavigation() {
        const cards = Array.from(committeeCards);
        
        document.addEventListener('keydown', function(e) {
            if (e.target.classList.contains('committee-card')) {
                const currentIndex = cards.indexOf(e.target);
                
                switch(e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextIndex = (currentIndex + 1) % cards.length;
                        cards[nextIndex].focus();
                        break;
                        
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
                        cards[prevIndex].focus();
                        break;
                        
                    case 'Home':
                        e.preventDefault();
                        cards[0].focus();
                        break;
                        
                    case 'End':
                        e.preventDefault();
                        cards[cards.length - 1].focus();
                        break;
                }
            }
        });
    }
    
    setupKeyboardNavigation();
    
    console.log('Committee page initialized with', committeeCards.length, 'committee members');
});