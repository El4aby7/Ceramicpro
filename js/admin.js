document.addEventListener('DOMContentLoaded', async () => {
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');

    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        showDashboard(session.user);
    } else {
        loginContainer.classList.remove('hidden');
    }

    // Handle Login
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');

        errorEl.classList.add('hidden');

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            errorEl.innerText = error.message;
            errorEl.classList.remove('hidden');
        } else {
            showDashboard(data.user);
        }
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.reload();
    });

    function showDashboard(user) {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('dashboard-container').classList.remove('hidden');
        document.getElementById('dashboard-container').classList.add('flex');

        document.getElementById('admin-user-email').innerText = user.email;
        loadAdminData();
    }


    // Attach event listeners to save buttons
    document.getElementById('save-prices-btn').addEventListener('click', savePrices);
    document.getElementById('links-form').addEventListener('submit', saveLinks);
    document.getElementById('save-images-btn').addEventListener('click', saveImages);
});

async function loadAdminData() {
    // Load Prices
    const { data: prices, error: priceError } = await supabase.from('prices').select('*');
    if (!priceError && prices) {
        prices.forEach(p => {
            const input = document.getElementById(`input-price-${p.service_key}`);
            if (input) input.value = p.amount;
        });
    }

    // Load Links
    const { data: links, error: linkError } = await supabase.from('links').select('*');
    if (!linkError && links) {
        links.forEach(l => {
            const input = document.getElementById(`input-link-${l.platform}`);
            if (input) input.value = l.url;
        });
    }

    // Load Images
    const { data: images, error: imageError } = await supabase.from('images').select('*');
    if (!imageError && images) {
        images.forEach(i => {
            const input = document.getElementById(`input-img-${i.image_key}`);
            if (input) input.value = i.url || '';
        });
    }
}

async function savePrices() {
    const keys = ['ppf', 'nano', 'correction', 'interior', 'headlights'];
    let hasError = false;

    for (const key of keys) {
        const val = document.getElementById(`input-price-${key}`).value;
        const { error } = await supabase
            .from('prices')
            .update({ amount: val })
            .eq('service_key', key);

        if (error) {
            console.error('Error saving price for', key, error);
            hasError = true;
        }
    }

    if (!hasError) alert('Prices updated successfully!');
}

async function saveLinks(e) {
    e.preventDefault();
    const keys = ['facebook', 'instagram', 'phone', 'email'];
    let hasError = false;

    for (const key of keys) {
        const val = document.getElementById(`input-link-${key}`).value;
        const { error } = await supabase
            .from('links')
            .update({ url: val })
            .eq('platform', key);

        if (error) {
            console.error('Error saving link for', key, error);
            hasError = true;
        }
    }

    if (!hasError) alert('Links updated successfully!');
}

async function saveImages() {
    const keys = ['logo', 'ppf', 'nano', 'correction', 'interior', 'headlights'];
    let hasError = false;

    for (const key of keys) {
        const val = document.getElementById(`input-img-${key}`).value;
        const { error } = await supabase
            .from('images')
            .update({ url: val })
            .eq('image_key', key);

        if (error) {
            console.error('Error saving image for', key, error);
            hasError = true;
        }
    }

    if (!hasError) alert('Images updated successfully!');
}