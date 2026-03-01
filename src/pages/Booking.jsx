import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Booking() {
    const [prices, setPrices] = useState({
        ppf: '15,000',
        nano: '8,000',
        correction: '4,500',
        detailing: '2,000',
        headlights: '800'
    });

    const [links, setLinks] = useState({
        facebook: '#',
        instagram: '#',
        whatsapp: '#',
        tiktok: '#',
        email: 'info@ceramicpro.eg',
        phone: '+20 100 123 4567'
    });

    const [darkMode, setDarkMode] = useState(false);
    const [selectedService, setSelectedService] = useState({ id: 'nano', name: 'Nano Ceramic', price: '8,000' });

    useEffect(() => {
        const isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        const fetchContent = async () => {
            let { data: priceData } = await supabase.from('prices').select('*');
            if (priceData && priceData.length > 0) {
                const priceMap = {};
                priceData.forEach(p => priceMap[p.id] = p.price);
                setPrices(prev => ({ ...prev, ...priceMap }));
                setSelectedService({ id: 'nano', name: 'Nano Ceramic', price: priceMap['nano'] || '8,000' });
            }

            let { data: linkData } = await supabase.from('links').select('*');
            if (linkData && linkData.length > 0) {
                const linkMap = {};
                linkData.forEach(l => linkMap[l.id] = l.url);
                setLinks(prev => ({ ...prev, ...linkMap }));
            }
        };

        fetchContent();
    }, []);

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

    const handleServiceSelect = (id, name, priceKey) => {
        setSelectedService({ id, name, price: prices[priceKey] });
    };

    const services = [
        { id: 'ppf', name: 'PPF Protection', priceKey: 'ppf', desc: 'High-gloss Paint Protection Film to prevent scratches and chips.', time: '2-3 Days' },
        { id: 'nano', name: 'Nano Ceramic', priceKey: 'nano', desc: '9H ceramic coating for extreme gloss and hydrophobic effect.', time: '1-2 Days' },
        { id: 'correction', name: 'Paint Correction', priceKey: 'correction', desc: 'Multi-stage polishing to remove swirls and oxidation.', time: '1 Day' },
        { id: 'detailing', name: 'Full Detailing', priceKey: 'detailing', desc: 'Deep interior cleaning and exterior wash with premium wax.', time: '6-8 Hours' }
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-gray-100 font-body antialiased min-h-screen flex flex-col transition-colors duration-300">
            {/* Nav */}
            <nav className="sticky top-0 z-50 bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-border-light dark:border-border-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-3">
                            <div className="w-10 h-10 bg-black flex items-center justify-center rounded overflow-hidden">
                                <span className="font-display font-bold text-primary text-xl tracking-tighter">CP</span>
                            </div>
                            <span className="font-display font-bold text-xl uppercase tracking-wider hidden sm:block">Ceramic Pro <span className="text-primary">Egypt</span></span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors hidden md:block">Home</Link>
                            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors hidden md:block mr-4">Contact</Link>
                            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1 text-sm font-medium">
                                <span className="material-icons text-lg">language</span>
                                <span>EN</span>
                            </button>
                            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-primary" onClick={toggleTheme}>
                                <span className="material-icons">{darkMode ? 'light_mode' : 'dark_mode'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="text-center mb-12">
                    <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 uppercase tracking-tight">Book An <span className="text-primary">Appointment</span></h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        Select your premium service, choose a convenient time, and let us restore your vehicle to perfection.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (Forms) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* 1. Select Service */}
                        <section className="bg-surface-light dark:bg-surface-dark p-6 md:p-8 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">1</div>
                                <h2 className="text-xl font-display font-bold uppercase tracking-wide">Select Service</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {services.map((s) => (
                                    <label key={s.id} className="cursor-pointer relative group">
                                        <input 
                                            type="radio" 
                                            name="service" 
                                            value={s.id} 
                                            className="sr-only" 
                                            checked={selectedService.id === s.id}
                                            onChange={() => handleServiceSelect(s.id, s.name, s.priceKey)}
                                        />
                                        <div className={`p-5 rounded-lg border-2 transition-all h-full flex flex-col justify-between ${selectedService.id === s.id ? 'border-primary bg-primary/5' : 'border-border-light dark:border-border-dark hover:border-primary/50'}`}>
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-lg">{s.name}</h3>
                                                    <span className="text-primary font-bold">{prices[s.priceKey]} L.E.</span>
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{s.desc}</p>
                                            </div>
                                            <div className="flex items-center text-xs font-medium text-gray-500 gap-1">
                                                <span className="material-icons text-sm">schedule</span> {s.time}
                                            </div>
                                            <span className={`material-icons text-primary absolute top-5 right-5 transition-all duration-300 ${selectedService.id === s.id ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>check_circle</span>
                                        </div>
                                    </label>
                                ))}

                                {/* Special full-width option */}
                                <label className="cursor-pointer relative group md:col-span-2">
                                    <input 
                                        type="radio" 
                                        name="service" 
                                        value="headlights" 
                                        className="sr-only"
                                        checked={selectedService.id === 'headlights'}
                                        onChange={() => handleServiceSelect('headlights', 'Headlights Polish', 'headlights')}
                                    />
                                    <div className={`p-5 rounded-lg border-2 transition-all flex flex-col sm:flex-row justify-between sm:items-center ${selectedService.id === 'headlights' ? 'border-primary bg-primary/5' : 'border-border-light dark:border-border-dark hover:border-primary/50'}`}>
                                        <div>
                                            <h3 className="font-bold text-lg">Headlights Polish</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Restoration of foggy headlights for clarity and safety.</p>
                                        </div>
                                        <div className="mt-2 sm:mt-0 flex flex-col sm:items-end">
                                            <span className="text-primary font-bold text-lg">{prices.headlights} L.E.</span>
                                            <div className="flex items-center text-xs font-medium text-gray-500 gap-1">
                                                <span className="material-icons text-sm">schedule</span> 1-2 Hours
                                            </div>
                                        </div>
                                        <span className={`material-icons text-primary absolute top-1/2 -translate-y-1/2 right-5 transition-all duration-300 ${selectedService.id === 'headlights' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>check_circle</span>
                                    </div>
                                </label>
                            </div>
                        </section>

                        {/* 2. Select Date & Time (Static mock for design) */}
                        <section className="bg-surface-light dark:bg-surface-dark p-6 md:p-8 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">2</div>
                                <h2 className="text-xl font-display font-bold uppercase tracking-wide">Select Date & Time</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Date</label>
                                    <div className="border border-border-light dark:border-border-dark rounded-lg p-4 bg-background-light dark:bg-background-dark">
                                        <div className="flex justify-between items-center mb-4">
                                            <button className="text-gray-500 hover:text-primary"><span className="material-icons">chevron_left</span></button>
                                            <span className="font-bold">October 2023</span>
                                            <button className="text-gray-500 hover:text-primary"><span className="material-icons">chevron_right</span></button>
                                        </div>
                                        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
                                            <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                                        </div>
                                        <div className="grid grid-cols-7 gap-1 text-sm text-center">
                                            <div className="text-gray-300 dark:text-gray-700 p-2">29</div>
                                            <div className="text-gray-300 dark:text-gray-700 p-2">30</div>
                                            <div className="hover:bg-primary/20 dark:hover:bg-primary/20 cursor-pointer rounded-md p-2">1</div>
                                            <div className="hover:bg-primary/20 dark:hover:bg-primary/20 cursor-pointer rounded-md p-2">2</div>
                                            <div className="hover:bg-primary/20 dark:hover:bg-primary/20 cursor-pointer rounded-md p-2">3</div>
                                            <div className="bg-primary text-white rounded-md p-2 font-bold shadow-md shadow-primary/30">4</div>
                                            <div className="hover:bg-primary/20 dark:hover:bg-primary/20 cursor-pointer rounded-md p-2">5</div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Available Slots</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button className="py-2 px-4 rounded border border-border-light dark:border-border-dark text-sm hover:border-primary hover:text-primary transition-colors">09:00 AM</button>
                                        <button className="py-2 px-4 rounded border border-border-light dark:border-border-dark text-sm bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed line-through">10:00 AM</button>
                                        <button className="py-2 px-4 rounded border border-primary text-primary bg-primary/10 text-sm font-bold shadow-sm ring-1 ring-primary">11:00 AM</button>
                                        <button className="py-2 px-4 rounded border border-border-light dark:border-border-dark text-sm hover:border-primary hover:text-primary transition-colors">01:00 PM</button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Vehicle Details */}
                        <section className="bg-surface-light dark:bg-surface-dark p-6 md:p-8 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">3</div>
                                <h2 className="text-xl font-display font-bold uppercase tracking-wide">Vehicle Details</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Car Make</label>
                                    <input type="text" placeholder="e.g. BMW" className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400 text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Car Model</label>
                                    <input type="text" placeholder="e.g. X5" className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400 text-sm" />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column (Summary) */}
                    <div className="lg:col-span-1">
                        <div className="bg-surface-light dark:bg-surface-dark p-6 md:p-8 rounded-xl border border-border-light dark:border-border-dark shadow-lg sticky top-24">
                            <h3 className="text-lg font-display font-bold uppercase mb-6 pb-4 border-b border-border-light dark:border-border-dark">Order Summary</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Service</span>
                                    <span className="font-medium">{selectedService.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Date</span>
                                    <span className="font-medium">Oct 4, 2023</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Time</span>
                                    <span className="font-medium">11:00 AM</span>
                                </div>
                                <div className="pt-4 border-t border-border-light dark:border-border-dark flex justify-between items-center">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-2xl text-primary">{selectedService.price} L.E.</span>
                                </div>
                            </div>

                            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Booking submitted!"); }}>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                                    <input type="text" className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800 text-gray-500 text-sm">
                                            +20
                                        </span>
                                        <input type="tel" className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-r-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" required />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/30 transition-all transform active:scale-95 flex items-center justify-center gap-2 mt-6">
                                    <span>Confirm Booking</span>
                                    <span className="material-icons text-sm">arrow_forward</span>
                                </button>
                                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                                    You will pay at the center after service completion.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark mt-20">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex justify-center md:order-2 space-x-6">
                            <a href={links.facebook} className="text-gray-400 hover:text-primary"><span className="sr-only">Facebook</span>FB</a>
                            <a href={links.instagram} className="text-gray-400 hover:text-primary"><span className="sr-only">Instagram</span>IG</a>
                            <a href={links.whatsapp} className="text-gray-400 hover:text-primary"><span className="sr-only">WhatsApp</span>WA</a>
                            <a href={links.tiktok} className="text-gray-400 hover:text-primary"><span className="sr-only">TikTok</span>TK</a>
                        </div>
                        <div className="mt-8 md:mt-0 md:order-1">
                            <p className="text-center text-sm text-gray-500 font-display">
                                © 2023 Ceramic Pro Egypt. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}