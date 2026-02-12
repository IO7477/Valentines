/**
 * Valentine's Day Card Gallery - Interactive JavaScript
 * Features: Loading screen, modal expansion, image upload, content editing
 */

// ===================================
// LOADING SCREEN CONTROLLER
// ===================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    
    // Display loading screen for 2.5 seconds, then fade out
    setTimeout(() => {
        loader.style.opacity = '0';
        
        // Remove loader from DOM after fade-out animation completes
        setTimeout(() => {
            loader.remove();
        }, 600);
    }, 2500);
});

// ===================================
// CARD MODAL CLASS
// Main controller for card interactions and modal behavior
// ===================================
class CardModal {
    constructor() {
        // DOM element references
        this.modal = document.getElementById('modal-overlay');
        this.modalContent = document.querySelector('.expanded-card');
        this.closeBtn = document.querySelector('.modal-close-btn');
        this.cards = document.querySelectorAll('.card');
        this.currentCard = null;
        this.imageInput = null;
        
        // Default content data for each card
        this.contentData = {
            'card-1': {
                title: 'My Love',
                message: 'You fill my heart with joy and happiness every single day. Thank you for being my Valentine!',
                gradient: 'linear-gradient(135deg, #FF3B5C 0%, #E63946 100%)'
            },
            'card-2': {
                title: 'Key to My Heart',
                message: 'You unlock the best parts of me and make every moment special. You are my happiness!',
                gradient: 'linear-gradient(135deg, #7DB8C5 0%, #88C0D0 100%)'
            },
            'card-3': {
                title: "Happy Valentine's Day",
                message: 'To the love of my life - thank you for making every day an adventure filled with love and laughter.',
                gradient: 'linear-gradient(135deg, #FF3B5C 0%, #DC2F45 100%)'
            },
            'card-4': {
                title: 'Be Mine',
                message: 'Forever and always, you are the one I choose. Will you be my Valentine today and every day?',
                gradient: 'linear-gradient(135deg, #B8D4E0 0%, #A8D8EA 100%)'
            }
        };
        
        // Initialize all event listeners
        this.init();
    }
    
    /**
     * Initialize all event listeners and setup
     */
    init() {
        // Setup click handlers for all cards
        this.cards.forEach(card => {
            // Mouse click event
            card.addEventListener('click', (e) => {
                // Animate card click
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transform = '';
                    this.openModal(card);
                }, 150);
            });
            
            // Keyboard accessibility (Enter or Space key)
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
        
        // Close button handler
        this.closeBtn.addEventListener('click', () => this.closeModal());
        
        // Click outside modal to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
        
        // Setup image upload functionality
        this.setupImageUpload();
        
        // Setup content editing functionality
        this.setupContentEditing();
    }
    
    /**
     * Open modal with card content
     * @param {HTMLElement} card - The clicked card element
     */
    openModal(card) {
        // Extract card ID from class name
        const cardClasses = card.className.split(' ');
        const cardClass = cardClasses.find(c => c.startsWith('card-'));
        const cardId = cardClass;
        
        // Store current card reference
        this.currentCard = cardId;
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
        
        // Load card-specific content
        this.loadCardContent(cardId);
        
        // Activate modal with animation
        this.modal.classList.add('active');
        this.modalContent.classList.add('active');
        
        // Accessibility: Update ARIA attributes
        this.modal.setAttribute('aria-hidden', 'false');
        
        // Focus on close button for keyboard navigation
        setTimeout(() => this.closeBtn.focus(), 100);
    }
    
    /**
     * Close modal and reset state
     */
    closeModal() {
        // Deactivate modal
        this.modal.classList.remove('active');
        this.modalContent.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
        
        // Accessibility: Update ARIA attributes
        this.modal.setAttribute('aria-hidden', 'true');
        
        // Return focus to the card that was clicked
        const activeCard = document.querySelector(`.${this.currentCard}`);
        if (activeCard) {
            setTimeout(() => activeCard.focus(), 400);
        }
    }
    
    /**
     * Load content for specific card
     * @param {string} cardId - The ID of the card to load content for
     */
    loadCardContent(cardId) {
        // Get default content data
        const data = this.contentData[cardId];
        
        // Check for saved content in localStorage
        const savedTitle = localStorage.getItem(`${cardId}-title`);
        const savedMessage = localStorage.getItem(`${cardId}-message`);
        const savedImage = localStorage.getItem(`${cardId}-image`);
        
        // Set card ID on modal
        this.modalContent.dataset.cardId = cardId;
        
        // Apply card-specific gradient background
        this.modalContent.style.background = data.gradient;
        
        // Get DOM elements
        const titleEl = document.querySelector('.modal-title');
        const messageEl = document.querySelector('.modal-message');
        const imageEl = document.querySelector('.modal-image');
        const placeholder = document.querySelector('.image-placeholder');
        
        // Set title and message (use saved or default)
        titleEl.textContent = savedTitle || data.title;
        messageEl.textContent = savedMessage || data.message;
        
        // Handle image display
        if (savedImage) {
            // Show saved image
            imageEl.src = savedImage;
            imageEl.style.display = 'block';
            placeholder.style.display = 'none';
        } else {
            // Show placeholder
            imageEl.src = '';
            imageEl.style.display = 'none';
            placeholder.style.display = 'flex';
        }
    }
    
    /**
     * Setup image upload functionality
     */
    setupImageUpload() {
        // Create hidden file input element
        this.imageInput = document.createElement('input');
        this.imageInput.type = 'file';
        this.imageInput.accept = 'image/*';
        this.imageInput.style.display = 'none';
        document.body.appendChild(this.imageInput);
        
        // Click on image container triggers file selection
        const imageContainer = document.querySelector('.content-image-container');
        imageContainer.addEventListener('click', () => {
            this.imageInput.click();
        });
        
        // Handle file selection
        this.imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            
            // Validate file is an image
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                // When file is loaded
                reader.onload = (event) => {
                    const imageEl = document.querySelector('.modal-image');
                    const placeholder = document.querySelector('.image-placeholder');
                    
                    // Display uploaded image
                    imageEl.src = event.target.result;
                    imageEl.style.display = 'block';
                    placeholder.style.display = 'none';
                    
                    // Save image to localStorage for persistence
                    localStorage.setItem(`${this.currentCard}-image`, event.target.result);
                };
                
                // Read file as data URL (base64)
                reader.readAsDataURL(file);
            }
        });
    }
    
    /**
     * Setup content editing functionality
     * Enables inline editing and saves to localStorage
     */
    setupContentEditing() {
        // Get all editable elements
        const editableElements = document.querySelectorAll('[contenteditable="true"]');
        
        editableElements.forEach(element => {
            // Save content when element loses focus
            element.addEventListener('blur', () => {
                const contentType = element.classList.contains('modal-title') ? 'title' : 'message';
                const key = `${this.currentCard}-${contentType}`;
                
                // Save to localStorage
                localStorage.setItem(key, element.textContent);
            });
            
            // Prevent Enter key from creating new lines in title
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && element.classList.contains('modal-title')) {
                    e.preventDefault();
                    element.blur();
                }
            });
        });
    }
}

// ===================================
// INITIALIZE APPLICATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Create instance of CardModal
    const cardModal = new CardModal();
});
