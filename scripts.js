window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    
    setTimeout(() => {
        loader.style.opacity = '0';
        
        setTimeout(() => {
            loader.remove();
        }, 600);
    }, 2500);
});

class CardModal {
    constructor() {
        this.modal = document.getElementById('modal-overlay');
        this.modalContent = document.querySelector('.expanded-card');
        this.closeBtn = document.querySelector('.modal-close-btn');
        this.cards = document.querySelectorAll('.card');
        this.currentCard = null;
        this.imageInput = null;
        
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
        
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('click', (e) => {
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transform = '';
                    this.openModal(card);
                }, 150);
            });
            
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
        
        this.closeBtn.addEventListener('click', () => this.closeModal());
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
        
        this.setupImageUpload();
        this.setupContentEditing();
    }
    
    openModal(card) {
        const cardClasses = card.className.split(' ');
        const cardClass = cardClasses.find(c => c.startsWith('card-'));
        const cardId = cardClass;
        
        this.currentCard = cardId;
        
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
        
        this.loadCardContent(cardId);
        
        this.modal.classList.add('active');
        this.modalContent.classList.add('active');
        
        this.modal.setAttribute('aria-hidden', 'false');
        setTimeout(() => this.closeBtn.focus(), 100);
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        this.modalContent.classList.remove('active');
        
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
        
        this.modal.setAttribute('aria-hidden', 'true');
        
        const activeCard = document.querySelector(`.${this.currentCard}`);
        if (activeCard) {
            setTimeout(() => activeCard.focus(), 400);
        }
    }
    
    loadCardContent(cardId) {
        const data = this.contentData[cardId];
        const savedTitle = localStorage.getItem(`${cardId}-title`);
        const savedMessage = localStorage.getItem(`${cardId}-message`);
        const savedImage = localStorage.getItem(`${cardId}-image`);
        
        this.modalContent.dataset.cardId = cardId;
        this.modalContent.style.background = data.gradient;
        
        const titleEl = document.querySelector('.modal-title');
        const messageEl = document.querySelector('.modal-message');
        const imageEl = document.querySelector('.modal-image');
        const placeholder = document.querySelector('.image-placeholder');
        
        titleEl.textContent = savedTitle || data.title;
        messageEl.textContent = savedMessage || data.message;
        
        if (savedImage) {
            imageEl.src = savedImage;
            imageEl.style.display = 'block';
            placeholder.style.display = 'none';
        } else {
            imageEl.src = '';
            imageEl.style.display = 'none';
            placeholder.style.display = 'flex';
        }
    }
    
    setupImageUpload() {
        this.imageInput = document.createElement('input');
        this.imageInput.type = 'file';
        this.imageInput.accept = 'image/*';
        this.imageInput.style.display = 'none';
        document.body.appendChild(this.imageInput);
        
        const imageContainer = document.querySelector('.content-image-container');
        imageContainer.addEventListener('click', () => {
            this.imageInput.click();
        });
        
        this.imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = (event) => {
                    const imageEl = document.querySelector('.modal-image');
                    const placeholder = document.querySelector('.image-placeholder');
                    
                    imageEl.src = event.target.result;
                    imageEl.style.display = 'block';
                    placeholder.style.display = 'none';
                    
                    localStorage.setItem(`${this.currentCard}-image`, event.target.result);
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    setupContentEditing() {
        const editableElements = document.querySelectorAll('[contenteditable="true"]');
        
        editableElements.forEach(element => {
            element.addEventListener('blur', () => {
                const contentType = element.classList.contains('modal-title') ? 'title' : 'message';
                const key = `${this.currentCard}-${contentType}`;
                
                localStorage.setItem(key, element.textContent);
            });
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && element.classList.contains('modal-title')) {
                    e.preventDefault();
                    element.blur();
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const cardModal = new CardModal();
});
