// Apple-style hover preview - Universal for all pages
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    const navPreview = document.getElementById('nav-preview');
    const previewContent = document.getElementById('preview-content');
    
    if (!navPreview || !previewContent) {
        console.error('Preview elements not found');
        return;
    }
    
    // Calculate base path to pages/ directory from current location
    function getBasePath() {
        const path = window.location.pathname;
        // Use full path including filename to accurately determine depth
        const fullPathParts = path.split('/').filter(p => p);
        
        // Find the index of 'pages' in the path
        const pagesIndex = fullPathParts.indexOf('pages');
        
        if (pagesIndex === -1) {
            // Not in pages/ directory (e.g., root index.html)
            return 'pages/';
        } else {
            // We're in pages/ directory
            // Count how many parts are after 'pages' (including the HTML file)
            // pages/introduction.html -> depth = 1 -> return ''
            // pages/philosophy/creative.html -> depth = 2 -> return '../'
            // pages/introduction/background.html -> depth = 2 -> return '../'
            const depthFromPages = fullPathParts.length - pagesIndex - 1;
            
            if (depthFromPages === 1) {
                // pages/ level (e.g., pages/introduction.html)
                // We're already in pages/, so relative paths are direct
                return '';
            } else {
                // Subdirectory level (e.g., pages/philosophy/creative.html or pages/introduction/background.html)
                // depthFromPages === 2 means we're one level deep
                // Need to go back one level to pages/
                return '../';
            }
        }
    }
    
    const basePath = getBasePath();
    
    // Section data with links - all sections now have clickable sub-items
    const sectionData = {
        introduction: [
            { text: 'Background', href: basePath + 'introduction/background.html' },
            { text: 'Achievement', href: basePath + 'introduction/achievement.html' }
        ],
        products: [
            { text: 'TapEat', href: basePath + 'products/tapeat.html' },
            { text: 'TapMeet', href: basePath + 'products/tapmeet.html' }
        ],
        philosophy: [
            { text: 'Creative', href: basePath + 'philosophy/creative.html' },
            { text: 'Algorithmic', href: basePath + 'philosophy/algorithmic.html' },
            { text: 'Logic', href: basePath + 'philosophy/logic.html' },
            { text: 'Aesthetic', href: basePath + 'philosophy/aesthetic.html' }
        ],
        services: [
            { text: 'management', href: basePath + 'services/management.html' },
            { text: 'design', href: basePath + 'services/design.html' }
        ],
        contact: [
            { text: 'email', href: basePath + 'contact.html#email' },
            { text: 'address', href: basePath + 'contact.html#address' }
        ]
    };

    let currentSection = null;
    let hideTimeout = null;

    function showPreview(sectionId, navItem) {
        if (currentSection === sectionId) return;
        
        currentSection = sectionId;
        const items = sectionData[sectionId] || [];
        
        if (items.length === 0) return;
        
        // Position preview relative to the hovered nav item
        if (navItem) {
            const navRect = navItem.getBoundingClientRect();
            const navParent = navItem.closest('.section-nav');
            const parentRect = navParent.getBoundingClientRect();
            
            // Calculate left position relative to nav parent
            const leftOffset = navRect.left - parentRect.left;
            navPreview.style.left = leftOffset + 'px';
        }
        
        // Update content with fade effect
        previewContent.style.opacity = '0';
        setTimeout(() => {
            previewContent.innerHTML = items.map(item => {
                // Check if item is an object with href (for sections with sub-pages)
                if (typeof item === 'object' && item.href) {
                    return `
                        <a href="${item.href}" class="preview-list-item">
                            <div class="preview-item-text">${item.text}</div>
                        </a>
                    `;
                } else {
                    return `
                        <div class="preview-list-item">
                            <div class="preview-item-text">${item}</div>
                        </div>
                    `;
                }
            }).join('');
            previewContent.style.opacity = '1';
        }, 90);
        
        // Show preview block
        navPreview.classList.add('active');
        
        // Clear any pending hide
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
    }

    function hidePreview() {
        hideTimeout = setTimeout(() => {
            // Double check if mouse is still over nav or preview
            const isOverNav = Array.from(navItems).some(item => 
                item.matches(':hover')
            );
            const isOverPreview = navPreview.matches(':hover');
            
            if (!isOverNav && !isOverPreview) {
                navPreview.classList.remove('active');
                currentSection = null;
            }
        }, 200);
    }

    // Add hover events to nav items
    navItems.forEach(item => {
        const sectionId = item.getAttribute('data-section');
        
        if (!sectionId) {
            return; // Skip items without data-section
        }
        
        item.addEventListener('mouseenter', (e) => {
            // Don't prevent default - allow normal link behavior
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            showPreview(sectionId, item);
        });
        
        item.addEventListener('mouseleave', () => {
            hidePreview();
        });
    });

    // Keep preview visible when hovering over it
    navPreview.addEventListener('mouseenter', () => {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
    });

    navPreview.addEventListener('mouseleave', () => {
        hidePreview();
    });
});
