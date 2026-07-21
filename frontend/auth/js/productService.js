const API_URL = 'http://localhost:8080/api/products';

async function fetchProducts() {
    try {
        console.log("Attempting to connect to backend at:", API_URL);
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const products = await response.json();
        console.log("Successfully fetched products:", products);
        return products;
        
    } catch (error) {
        console.error("Could not fetch products:", error);
        return null; 
    }
}

/**
 * Dynamically injects Cloudinary transformation parameters using forward-slashes.
 * This prevents your carousel script's comma-splitting logic from breaking the URLs!
 */
function optimizeCloudinaryUrl(url, width = 500) {
    if (!url || !url.includes("cloudinary.com")) {
        return url; // Return local or fallback images as-is
    }
    // FIXED: Switched commas "," to forward slashes "/" to prevent carousel splits
    return url.replace("/upload/", `/upload/f_auto/q_auto/w_${width}/c_limit/`);
}

function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = ''; 

    if (products.length === 0) {
        grid.innerHTML = '<p>No products available at the moment.</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        const isAvailable = product.stockQuantity > 0;
        
        const actionElement = isAvailable 
            ? `<a href="#" class="add-to-cart-btn" data-id="${product.id}">ADD TO CART</a>`
            : `<div class="sold-out-label">SOLD OUT</div>`;

        const imageUrls = product.imageUrls || [];
        
        // Dynamic image resolution optimization & browser-level lazy loading fallback
        const fallbackImage = '../assets/img/logo-clothify-dark.png';
        const firstImageRaw = imageUrls.length > 0 ? imageUrls[0] : fallbackImage;
        const optimizedFirstImage = optimizeCloudinaryUrl(firstImageRaw, 500);

        // Apply optimization to all dynamic carousel images
        const optimizedCarouselUrls = imageUrls.map(url => optimizeCloudinaryUrl(url, 500));

        const displayCategory = product.categoryName || product.category || "General";

        card.innerHTML = `
            <div class="carousel-container" data-images="${optimizedCarouselUrls.join(',')}">
                <img class="carousel-image" src="${optimizedFirstImage}" alt="${product.name}" loading="lazy">
                <button class="carousel-btn prev-btn"><i class="ph ph-arrow-left"></i></button>
                <button class="carousel-btn next-btn"><i class="ph ph-arrow-right"></i></button>
            </div>
            <div class="product-name">${product.name}</div>
            <div class="product-category">${displayCategory}</div>
            <div class="product-price">${product.price.toFixed(2)} EGP</div>
            ${actionElement}
        `;

        grid.appendChild(card);
    });

    initializeCarousels();
}

let allProducts = [];

async function initStore() {
    allProducts  = await fetchProducts();

    if (allProducts) {
        renderProducts(allProducts); 
        setupFilterListeners();
    }

    if (typeof initializeCarousels === 'function') {
        initializeCarousels();
    }
}

function setupFilterListeners() {
    const checkboxes = document.querySelectorAll('.filter-checkbox');
    
    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const showInStock = document.querySelector('input[value="in-stock"]').checked;
            const showOutOfStock = document.querySelector('input[value="out-of-stock"]').checked;

            const filtered = allProducts.filter(p => {
                if (!showInStock && !showOutOfStock) return true; 
                if (showInStock && p.stockQuantity > 0) return true;
                if (showOutOfStock && p.stockQuantity === 0) return true;
                return false;
            });

            renderProducts(filtered);
        });
    });
}

// Run the script when the page is fully loaded
document.addEventListener('DOMContentLoaded', initStore);