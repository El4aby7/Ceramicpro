const SUPABASE_URL = 'https://jwdsrjaaawqmutjjeyan.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3ZHNyamFhYXdxbXV0ampleWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjM2MzEsImV4cCI6MjA4NzkzOTYzMX0.zi2PdeQmiPh-g5IZrh7WbypRVawHoACWz1p-fBxv6kw';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper function to update text content of multiple elements safely
function updateElementsText(ids, text) {
    if (!text) return;
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    });
}

// Helper function to update href of multiple elements safely
function updateElementsHref(ids, href, prefix = '') {
    if (!href) return;
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.href = prefix + href;
    });
}

// Helper function to update image source
function updateImageSrc(id, src) {
    if (!src) return;
    const el = document.getElementById(id);
    if (el) el.src = src;
}

// Load Content for public pages
async function loadPublicContent() {
    try {
        // Load Prices
        const { data: prices, error: priceError } = await supabase.from('prices').select('*');
        if (!priceError && prices) {
            prices.forEach(price => {
                updateElementsText([`price-${price.service_key}`], price.amount);
            });
        }

        // Load Links
        const { data: links, error: linkError } = await supabase.from('links').select('*');
        if (!linkError && links) {
            const facebook = links.find(l => l.platform === 'facebook')?.url;
            const instagram = links.find(l => l.platform === 'instagram')?.url;
            const phone = links.find(l => l.platform === 'phone')?.url;
            const email = links.find(l => l.platform === 'email')?.url;

            updateElementsHref(['link-facebook', 'footer-fb'], facebook);
            updateElementsHref(['link-instagram', 'footer-ig'], instagram);

            updateElementsText(['text-phone', 'footer-phone'], phone);
            updateElementsHref(['link-phone', 'hero-phone', 'contact-phone'], phone, 'tel:');

            updateElementsText(['text-email', 'footer-email'], email);
            updateElementsHref(['link-email', 'contact-email'], email, 'mailto:');
        }

        // Load Images
        const { data: images, error: imageError } = await supabase.from('images').select('*');
        if (!imageError && images) {
            images.forEach(img => {
                // If it's a URL in the DB, use it. Otherwise, default to local assets
                // Assuming URL starts with http
                if (img.url && img.url.startsWith('http')) {
                    if (img.image_key === 'logo') {
                        updateImageSrc('nav-logo', img.url);
                        updateImageSrc('hero-logo', img.url);
                        updateImageSrc('footer-logo', img.url);
                    } else {
                        updateImageSrc(`img-${img.image_key}`, img.url);
                    }
                }
            });
        }

    } catch (e) {
        console.error("Error loading Supabase content", e);
    }
}

// Execute on public pages (not admin/login)
if (!window.location.pathname.includes('admin') && !window.location.pathname.includes('login')) {
    document.addEventListener('DOMContentLoaded', loadPublicContent);
}