import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Admin() {
    const [prices, setPrices] = useState({
        ppf: '15000',
        nano: '8000',
        correction: '4500',
        detailing: '2000',
        headlights: '800'
    });

    const [links, setLinks] = useState({
        facebook: '',
        instagram: '',
        whatsapp: '',
        tiktok: '',
        email: '',
        phone: ''
    });

    const [images, setImages] = useState({
        logo: '',
        hero: '',
        ppf: '',
        nano: '',
        correction: '',
        detailing: '',
        headlights: ''
    });

    const [darkMode, setDarkMode] = useState(false);
    const [status, setStatus] = useState('');
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            setAuthLoading(false);
        };
        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        const fetchContent = async () => {
            let { data: priceData } = await supabase.from('prices').select('*');
            if (priceData && priceData.length > 0) {
                const priceMap = {};
                priceData.forEach(p => priceMap[p.id] = p.price);
                setPrices(prev => ({ ...prev, ...priceMap }));
            }

            let { data: linkData } = await supabase.from('links').select('*');
            if (linkData && linkData.length > 0) {
                const linkMap = {};
                linkData.forEach(l => linkMap[l.id] = l.url);
                setLinks(prev => ({ ...prev, ...linkMap }));
            }

            let { data: imgData } = await supabase.from('images').select('*');
            if (imgData && imgData.length > 0) {
                const imgMap = {};
                imgData.forEach(i => imgMap[i.id] = i.url);
                setImages(prev => ({ ...prev, ...imgMap }));
            }
        };

        fetchContent();

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setStatus('Logging in...');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setStatus('Login failed: ' + error.message);
        } else {
            setStatus('');
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (authLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body">Loading...</div>;
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body transition-colors duration-300">
                <div className="w-full max-w-md bg-surface-light dark:bg-surface-dark p-8 rounded-xl shadow-lg border border-border-light dark:border-border-dark">
                    <div className="flex flex-col items-center gap-2 mb-8">
                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold font-display text-2xl">C</div>
                        <h1 className="text-2xl font-display font-bold text-black dark:text-white tracking-wider text-center">CERAMIC<span className="text-primary">PRO</span></h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Admin Login</p>
                    </div>
                    {status && <p className="text-red-500 text-center text-sm mb-4">{status}</p>}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input 
                                type="email" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                            <input 
                                type="password" 
                                required 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors shadow-md shadow-primary/20 mt-4">
                            Log In
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <Link to="/" className="text-sm text-gray-500 hover:text-primary transition-colors">← Back to Website</Link>
                    </div>
                </div>
            </div>
        );
    }

    const toggleTheme = () => {
        const newDark = !darkMode;
        setDarkMode(newDark);
        if (newDark) {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
    };

    const handlePriceChange = (id, value) => {
        setPrices(prev => ({ ...prev, [id]: value }));
    };

    const handleLinkChange = (id, value) => {
        setLinks(prev => ({ ...prev, [id]: value }));
    };

    const handleImageChange = (id, value) => {
        setImages(prev => ({ ...prev, [id]: value }));
    };

    const savePrices = async () => {
        setStatus('Saving prices...');
        try {
            const updates = Object.keys(prices).map(id => ({
                id, 
                name: id.toUpperCase(), 
                price: prices[id] 
            }));
            const { error } = await supabase.from('prices').upsert(updates);
            if (error) throw error;
            setStatus('Prices saved successfully!');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            setStatus('Error saving prices.');
            console.error(error);
        }
    };

    const saveLinks = async () => {
        setStatus('Saving links...');
        try {
            const updates = Object.keys(links).map(id => ({
                id, 
                name: id.charAt(0).toUpperCase() + id.slice(1), 
                url: links[id] 
            }));
            const { error } = await supabase.from('links').upsert(updates);
            if (error) throw error;
            setStatus('Links saved successfully!');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            setStatus('Error saving links.');
            console.error(error);
        }
    };

    const saveImages = async () => {
        setStatus('Saving images...');
        try {
            const updates = Object.keys(images).map(id => ({
                id, 
                name: id.toUpperCase() + " Image", 
                url: images[id] 
            }));
            const { error } = await supabase.from('images').upsert(updates);
            if (error) throw error;
            setStatus('Images saved successfully!');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            setStatus('Error saving images.');
            console.error(error);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-body text-text-light dark:text-text-dark antialiased min-h-screen flex flex-col md:flex-row transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex-shrink-0 flex flex-col h-auto md:h-screen sticky top-0 z-50">
                <div className="p-6 flex items-center justify-center border-b border-border-light dark:border-border-dark">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-white font-bold font-display text-xl">C</div>
                        <h1 className="text-xl font-display font-bold text-black dark:text-white tracking-wider">CERAMIC<span className="text-primary">PRO</span></h1>
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    <span className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium">
                        <span className="material-icons">dashboard</span>
                        Dashboard
                    </span>
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <span className="material-icons">public</span>
                        Back to Site
                    </Link>
                </nav>
                <div className="p-4 border-t border-border-light dark:border-border-dark">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="material-icons text-gray-500 dark:text-gray-300">person</span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user.email}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border-light dark:border-border-dark rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors cursor-pointer">
                        <span className="material-icons text-sm">logout</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
                        <p className="text-gray-500 dark:text-gray-400">Manage your Ceramic Pro Egypt website content.</p>
                        {status && <p className="text-primary font-bold mt-2">{status}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors" onClick={toggleTheme}>
                            <span className="material-icons">{darkMode ? 'light_mode' : 'dark_mode'}</span>
                        </button>
                        <Link to="/" className="hidden md:flex items-center gap-2 text-primary font-medium hover:text-primary-hover transition-colors">
                            View Live Site
                            <span className="material-icons text-sm">open_in_new</span>
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Prices Editor */}
                    <div className="col-span-1 lg:col-span-2 xl:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="material-icons text-primary">local_offer</span>
                                Core Service Pricing
                            </h3>
                            <button onClick={savePrices} className="text-sm text-primary hover:text-primary-hover font-medium">Save All Changes</button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { id: 'ppf', label: 'PPF Protection', desc: 'High-gloss Paint Protection Film' },
                                { id: 'nano', label: 'Nano Ceramic', desc: '9H ceramic coating' },
                                { id: 'correction', label: 'Paint Correction', desc: 'Swirl mark & scratch removal' },
                                { id: 'detailing', label: 'Interior Detailing', desc: 'Deep clean & leather protection' },
                                { id: 'headlights', label: 'Headlights Polish', desc: 'Restoration of foggy headlights' }
                            ].map(item => (
                                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-border-light dark:border-border-dark group hover:border-primary/30 transition-colors">
                                    <div className="mb-2 sm:mb-0">
                                        <h4 className="font-semibold text-gray-800 dark:text-white">{item.label}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">L.E.</span>
                                        <input 
                                            type="number" 
                                            value={prices[item.id] || ''} 
                                            onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                            className="w-32 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm px-3 py-1.5 outline-none border" 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Links & Contact Editor */}
                    <div className="col-span-1 lg:col-span-1 xl:col-span-1 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
                        <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                            <span className="material-icons text-primary">share</span>
                            Social & Contact
                        </h3>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); saveLinks(); }}>
                            {[
                                { id: 'facebook', label: 'Facebook URL', placeholder: 'https://...', icon: 'public' },
                                { id: 'instagram', label: 'Instagram URL', placeholder: 'https://...', icon: 'public' },
                                { id: 'whatsapp', label: 'WhatsApp URL / Number', placeholder: '+20...', icon: 'chat' },
                                { id: 'tiktok', label: 'TikTok URL', placeholder: 'https://...', icon: 'public' },
                                { id: 'email', label: 'Email Address', placeholder: 'info@...', icon: 'email' },
                                { id: 'phone', label: 'Phone Number', placeholder: '+20...', icon: 'phone' }
                            ].map(item => (
                                <div key={item.id}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{item.label}</label>
                                    <div className="relative rounded-md shadow-sm flex items-center border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 overflow-hidden">
                                        <div className="pl-3 flex items-center pointer-events-none">
                                            <span className="material-icons text-gray-400 text-sm">{item.icon}</span>
                                        </div>
                                        <input 
                                            type="text" 
                                            value={links[item.id] || ''}
                                            onChange={(e) => handleLinkChange(item.id, e.target.value)}
                                            className="block w-full border-none bg-transparent text-gray-900 dark:text-white focus:ring-0 sm:text-sm px-3 py-2 outline-none" 
                                            placeholder={item.placeholder} 
                                        />
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4">
                                <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2 px-4 rounded-md transition-colors shadow-md shadow-primary/20">
                                    Update Links
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Images Editor */}
                    <div className="col-span-1 lg:col-span-2 xl:col-span-3 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                            <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="material-icons text-primary">collections</span>
                                Site Imagery (URLs)
                            </h3>
                            <button onClick={saveImages} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-medium py-2 px-4 rounded-md text-sm transition-colors flex items-center gap-2">
                                <span className="material-icons text-sm">save</span>
                                Save Images
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { id: 'logo', label: 'Main Logo' },
                                { id: 'hero', label: 'Hero Background' },
                                { id: 'ppf', label: 'PPF Image' },
                                { id: 'nano', label: 'Nano Ceramic Image' },
                                { id: 'correction', label: 'Paint Correction Image' },
                                { id: 'detailing', label: 'Detailing Image' },
                                { id: 'headlights', label: 'Headlights Image' }
                            ].map(item => (
                                <div key={item.id} className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</label>
                                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                                        {images[item.id] ? (
                                            <img src={images[item.id]} alt={item.label} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-gray-400 text-xs">No Image URL</span>
                                        )}
                                    </div>
                                    <input 
                                        type="text" 
                                        value={images[item.id] || ''}
                                        onChange={(e) => handleImageChange(item.id, e.target.value)}
                                        placeholder="Paste image URL here..."
                                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <footer className="mt-12 border-t border-border-light dark:border-border-dark pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>© 2023 Ceramic Pro Egypt. All rights reserved. <span className="block sm:inline">Designed for Admin Use Only.</span></p>
                </footer>
            </main>
        </div>
    );
}