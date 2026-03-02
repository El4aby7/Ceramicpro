document.addEventListener('DOMContentLoaded', async () => {
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');

    // Check if user is logged in
    const { data: { session } } = await supabaseClient.auth.getSession();

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

        const { data, error } = await supabaseClient.auth.signInWithPassword({
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
        await supabaseClient.auth.signOut();
        window.location.reload();
    });

    function showDashboard(user) {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('dashboard-container').classList.remove('hidden');
        document.getElementById('dashboard-container').classList.add('flex');

        document.getElementById('admin-user-email').innerText = user.email;
        loadAdminData();
    }


    // Navigation logic
    setupNavigation();

    // Attach event listeners to save buttons
    document.getElementById('save-prices-btn').addEventListener('click', savePrices);
    document.getElementById('links-form').addEventListener('submit', saveLinks);
    document.getElementById('save-images-btn').addEventListener('click', saveImages);
});

/**
 * Handles sidebar navigation
 */
function setupNavigation() {
    const navDashboard = document.getElementById('nav-dashboard');
    const navBookings = document.getElementById('nav-bookings');
    const navContacts = document.getElementById('nav-contacts');

    const viewDashboard = document.getElementById('view-dashboard');
    const viewBookings = document.getElementById('view-bookings');
    const viewContacts = document.getElementById('view-contacts');

    const title = document.getElementById('page-title');
    const desc = document.getElementById('page-desc');

    function resetNav() {
        [navDashboard, navBookings, navContacts].forEach(nav => {
            nav.classList.remove('bg-primary/10', 'text-primary');
            nav.classList.add('text-gray-600', 'dark:text-gray-400');
        });
        [viewDashboard, viewBookings, viewContacts].forEach(view => {
            view.classList.add('hidden');
            if (view.id !== 'view-dashboard') {
                view.classList.remove('flex');
            }
        });
    }

    navDashboard.addEventListener('click', (e) => {
        e.preventDefault();
        resetNav();
        navDashboard.classList.add('bg-primary/10', 'text-primary');
        navDashboard.classList.remove('text-gray-600', 'dark:text-gray-400');
        viewDashboard.classList.remove('hidden');

        title.innerText = 'Dashboard Overview';
        desc.innerText = 'Manage your Ceramic Pro Egypt website content.';
    });

    navBookings.addEventListener('click', (e) => {
        e.preventDefault();
        resetNav();
        navBookings.classList.add('bg-primary/10', 'text-primary');
        navBookings.classList.remove('text-gray-600', 'dark:text-gray-400');
        viewBookings.classList.remove('hidden');
        viewBookings.classList.add('flex');

        title.innerText = 'Customer Bookings';
        desc.innerText = 'View and manage service appointments.';
        loadBookings();
    });

    navContacts.addEventListener('click', (e) => {
        e.preventDefault();
        resetNav();
        navContacts.classList.add('bg-primary/10', 'text-primary');
        navContacts.classList.remove('text-gray-600', 'dark:text-gray-400');
        viewContacts.classList.remove('hidden');
        viewContacts.classList.add('flex');

        title.innerText = 'Contact Messages';
        desc.innerText = 'View inquiries from the contact form.';
        loadContacts();
    });
}

async function loadAdminData() {
    // Load Prices
    const { data: prices, error: priceError } = await supabaseClient.from('prices').select('*');
    if (!priceError && prices) {
        prices.forEach(p => {
            const input = document.getElementById(`input-price-${p.service_key}`);
            if (input) input.value = p.amount;
        });
    }

    // Load Links
    const { data: links, error: linkError } = await supabaseClient.from('links').select('*');
    if (!linkError && links) {
        links.forEach(l => {
            const input = document.getElementById(`input-link-${l.platform}`);
            if (input) input.value = l.url;
        });
    }

    // Load Images (and populate current links)
    const { data: images, error: imageError } = await supabaseClient.from('images').select('*');
    if (!imageError && images) {
        images.forEach(i => {
            if (i.url) {
                const currentP = document.getElementById(`current-img-${i.image_key}`);
                if (currentP) {
                    const link = currentP.querySelector('a');
                    link.href = i.url;
                    link.innerText = 'View Image';
                }
            }
        });
    }
}

async function savePrices() {
    const keys = ['ppf', 'nano', 'correction', 'interior', 'headlights'];
    let hasError = false;

    for (const key of keys) {
        const val = document.getElementById(`input-price-${key}`).value;
        const { error } = await supabaseClient
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
        const { error } = await supabaseClient
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

/**
 * Saves uploaded images to Supabase Storage and updates the database records
 */
async function saveImages() {
    const keys = ['logo', 'ppf', 'nano', 'correction', 'interior', 'headlights'];
    let hasError = false;
    let uploadedCount = 0;

    const btn = document.getElementById('save-images-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="material-icons text-sm animate-spin">refresh</span> Saving...';
    btn.disabled = true;

    for (const key of keys) {
        const fileInput = document.getElementById(`input-img-${key}`);
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${key}_${Date.now()}.${fileExt}`;

            // 1. Upload to Supabase Storage ('images' bucket)
            const { data: uploadData, error: uploadError } = await supabaseClient
                .storage
                .from('images')
                .upload(fileName, file, { upsert: true });

            if (uploadError) {
                console.error('Error uploading image for', key, uploadError);
                hasError = true;
                continue;
            }

            // 2. Get the public URL for the uploaded image
            const { data: publicUrlData } = supabaseClient
                .storage
                .from('images')
                .getPublicUrl(fileName);

            const publicUrl = publicUrlData.publicUrl;

            // 3. Update the 'images' table with the new URL
            const { error: dbError } = await supabaseClient
                .from('images')
                .update({ url: publicUrl })
                .eq('image_key', key);

            if (dbError) {
                console.error('Error updating image record for', key, dbError);
                hasError = true;
            } else {
                uploadedCount++;
                // Update the visual link
                const currentP = document.getElementById(`current-img-${key}`);
                if (currentP) {
                    const link = currentP.querySelector('a');
                    link.href = publicUrl;
                    link.innerText = 'View Image';
                }
                // Clear the file input
                fileInput.value = '';
            }
        }
    }

    btn.innerHTML = originalText;
    btn.disabled = false;

    if (!hasError) {
        if (uploadedCount > 0) {
            alert(`Successfully updated ${uploadedCount} image(s)!`);
        } else {
            alert('No new images selected to upload.');
        }
    } else {
        alert('There were some errors uploading images. Check the console.');
    }
}

/**
 * Fetch and display bookings
 */
async function loadBookings() {
    const tbody = document.getElementById('bookings-table-body');
    tbody.innerHTML = '<tr><td colspan="6" class="py-4 text-center text-gray-500">Loading bookings...</td></tr>';

    const { data, error } = await supabaseClient
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        tbody.innerHTML = '<tr><td colspan="6" class="py-4 text-center text-red-500">Error loading bookings.</td></tr>';
        return;
    }

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="py-4 text-center text-gray-500">No bookings found.</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    data.forEach(booking => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors';

        const statusColor = booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';

        tr.innerHTML = `
            <td class="py-3 px-4">
                <div class="font-medium">${booking.booking_date}</div>
                <div class="text-xs text-gray-500">${booking.booking_time}</div>
            </td>
            <td class="py-3 px-4">
                <div class="font-medium">${booking.full_name}</div>
                <div class="text-xs text-gray-500"><a href="tel:${booking.phone_number}" class="text-primary hover:underline">${booking.phone_number}</a></div>
            </td>
            <td class="py-3 px-4 font-medium">${booking.service_name}</td>
            <td class="py-3 px-4">
                <div>${booking.car_make} ${booking.car_model}</div>
                <div class="text-xs text-gray-500">${booking.license_plate || 'N/A'}</div>
            </td>
            <td class="py-3 px-4 font-bold text-primary">${booking.total_price}</td>
            <td class="py-3 px-4">
                <span class="px-2 py-1 rounded text-xs font-semibold capitalize ${statusColor}">${booking.status}</span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Fetch and display contact messages
 */
async function loadContacts() {
    const tbody = document.getElementById('contacts-table-body');
    tbody.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-gray-500">Loading messages...</td></tr>';

    const { data, error } = await supabaseClient
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        tbody.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-red-500">Error loading messages.</td></tr>';
        return;
    }

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-gray-500">No messages found.</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    data.forEach(contact => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors';

        const dateObj = new Date(contact.created_at);
        const dateStr = dateObj.toLocaleDateString();

        tr.innerHTML = `
            <td class="py-3 px-4 whitespace-nowrap text-gray-500">${dateStr}</td>
            <td class="py-3 px-4 font-medium">${contact.full_name}</td>
            <td class="py-3 px-4">
                <div class="text-xs"><a href="tel:${contact.phone_number}" class="text-primary hover:underline">${contact.phone_number}</a></div>
                <div class="text-xs"><a href="mailto:${contact.email_address}" class="text-primary hover:underline">${contact.email_address || 'N/A'}</a></div>
            </td>
            <td class="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">${contact.interest}</td>
            <td class="py-3 px-4 text-gray-600 dark:text-gray-400 max-w-xs truncate" title="${contact.message}">
                ${contact.message}
            </td>
        `;
        tbody.appendChild(tr);
    });
}