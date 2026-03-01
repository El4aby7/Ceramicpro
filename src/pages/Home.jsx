import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Home() {
    const [prices, setPrices] = useState({
        ppf: '15,000',
        nano: '8,000',
        correction: '4,500',
        detailing: '2,000',
        headlights: '800'
    });
    
    const [images, setImages] = useState({
        logo: 'https://image2url.com/r2/default/images/1772357315074-6c79bbf0-f81e-4143-9278-05ed53fe942d.jpg',
        hero: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop',
        ppf: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARbjdw0VQLFxPqsbetNok42_Lg9CoPzLn3qPlXNypICciUNpkh4SDkQ5uXOgE1wxXzFxIeWIYXD7koMZvE3eNCbBro2Dj6J7cZ0peDhPH2TumDwORgaB0JAqk4U8T5k0lqePg9uey_2beC1gGTrHDKdaMvPr2MEhqQEvYDydj8e1iI4_fS_CUvpfAg45bHqS6Y0jc_40_F2cvb2bcsnfVqTaomIVeXUshnFaZHMOUImo8_JB67YE-ZyFM697YrsCrYPgN0z9s6rFE',
        nano: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjYNOYyZc4tZoC0yUrPtOmb7_wzuYPQ3LFAQeaIR7DAsIUIRVGV_vp4DIOY6bCSF1WGLCjfGQ2v0VvLrhRhkB9pambNF-_v3LWNQcShzcAjC-EYPoPaBURrPJoIAW5CydOED8xZ8FzZkwS_OrCKVZAefJCSYpkY8X3DUfe6GqlFc3LWDzoSUKuIkbwJpnlIOoDOkl6OkK6lHp9JzlY71kKm8bwOa7AuRgLmyoFa89qYKgCQxL0JuukSCt4om7i-BOaoRe8YI7oDcI',
        correction: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX0p9WW8qS96VYFNgWQ7H_aQknkAPLR5zx1RRlQQHxehgnhwoJu_eh0Gj8RTr048TiJ1VyGzQq-P8rnc676E7k8kCtZeMjGdYFL64Iig_0eHw9r-zGvvAN27tZ3UpkJrQIGXZOeOt2iAUBBLeXQCSIzsFyv0rVHi5xS_C7SnSMUaZwCqoC3jEdrEKTIGJ6H_FaFVxB4MSGIunlsDGUhQ0REwtU_5UUXjIaxTq7hyVFJdCZvkc1tJ7aOlDoiLx30wjPHovqJ3XmnSs',
        detailing: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXwsoS1X13s7VCm8bMeh6KnjA_6A5-ahVti5VoYVKQFiEpBqhxJhe31uc_StaUmqPXKApwWX0i_wy0wekpKY45mhbLTf5MNSSSBnnHZFizUr5FKT-Cvq4x4ici9maFlTALjcmgGsxwxS1XuFsQPuQN1edPpcVZ8U41xFdVmv3lqEYwKtWJnLkQZs4D6r1qr1yQ3zkNQ286_QsYLCgWxqot8yEoI7Vd-LPlK0THeKx2zGNdtsc9hYkZI7dqnthGynBTiMS8TSHqvFY',
        headlights: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDusA7wrEn7HDkF4H2L80Mu4jb8f9TWkhCrmU0EbUvzO2YTJ-Leos261UxZDbpwLBXSB5KH-bAIfl75cNQD8odp8oMcWUvYnYnf0djpU3wQU7kGDF62EqxApV7nAm3yjq6Cb7ERfGK39c9G1XSvHVEG1zIifKRGty4gyq9K5zxKAIvXIDwKbtlUT6COPNnZ78GsJvvyQnpZ8CmLNKYlqGJY4ZNa-0I47UCw7N4hPGt90VNHOwbJ9pA7bRvgtfqMrbfMho14VW_DftY'
    });

    const [links, setLinks] = useState({
        facebook: '#',
        instagram: '#',
        whatsapp: '#',
        tiktok: '#',
        phone: '+20 100 123 4567',
        email: 'info@ceramicpro.eg'
    });

    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        const fetchContent = async () => {
            try {
                // Fetch prices
                let { data: priceData } = await supabase.from('prices').select('*');
                if (priceData && priceData.length > 0) {
                    const priceMap = {};
                    priceData.forEach(p => priceMap[p.id] = p.price);
                    setPrices(prev => ({ ...prev, ...priceMap }));
                }

                // Fetch images
                let { data: imgData } = await supabase.from('images').select('*');
                if (imgData && imgData.length > 0) {
                    const imgMap = {};
                    imgData.forEach(i => imgMap[i.id] = i.url);
                    setImages(prev => ({ ...prev, ...imgMap }));
                }

                // Fetch links
                let { data: linkData } = await supabase.from('links').select('*');
                if (linkData && linkData.length > 0) {
                    const linkMap = {};
                    linkData.forEach(l => linkMap[l.id] = l.url);
                    setLinks(prev => ({ ...prev, ...linkMap }));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
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

    return (
        <div className="bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-100 font-body transition-colors duration-300 min-h-screen">
            {/* Nav */}
            <nav className="sticky top-0 z-50 bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex-shrink-0 flex items-center gap-3">
                            <img alt="Ceramic Pro Logo" className="h-12 w-auto" src={images.logo} />
                            <span className="font-display font-bold text-xl tracking-wider hidden sm:block">CERAMIC PRO EGYPT</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <button onClick={() => { document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors font-medium cursor-pointer">About</button>
                            <button onClick={() => { document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors font-medium cursor-pointer">Services</button>
                            <Link className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors font-medium" to="/contact">Contact</Link>
                            <div className="flex items-center space-x-4 border-l border-gray-300 dark:border-gray-700 pl-6">
                                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={toggleTheme}>
                                    <span className="material-icons text-gray-600 dark:text-gray-300">
                                        {darkMode ? 'light_mode' : 'dark_mode'}
                                    </span>
                                </button>
                                <button className="flex items-center space-x-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                                    <span className="material-icons text-lg">language</span>
                                    <span>EN</span>
                                </button>
                            </div>
                            <Link className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-full font-bold transition-transform transform hover:scale-105 shadow-lg shadow-primary/30" to="/booking">
                                Book Now
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* About / Hero */}
            <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32" id="about">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                Premium Automotive Care
                            </div>
                            <h1 className="font-display text-5xl lg:text-7xl font-black leading-tight mb-6">
                                PROTECT YOUR <br />
                                <span className="bg-gradient-to-r from-primary to-purple-600 text-gradient text-transparent">INVESTMENT</span>
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg leading-relaxed">
                                At Ceramic Pro Egypt, we redefine automotive perfection. Using world-class nanotechnology, we provide superior protection for surfaces. We specialize in PPF, Ceramic Coatings, and high-end detailing to keep your vehicle looking pristine.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={() => { document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} className="bg-primary text-white px-8 py-4 rounded font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/40 flex items-center justify-center gap-2 cursor-pointer">
                                    Explore Services
                                    <span className="material-icons">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
                            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-30 dark:opacity-20 animate-pulse"></div>
                            <img alt="Ceramic Pro Big Logo" className="relative w-64 lg:w-96 drop-shadow-2xl animate-float" src={images.logo} />
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-gray-100 dark:bg-surface-dark rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                <div className="absolute top-0 left-0 -ml-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
            </section>

            {/* Services */}
            <section className="py-24 bg-gray-50 dark:bg-black/20" id="services">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-display text-4xl font-bold mb-4">Our Premium <span className="text-primary">Services</span></h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">World-class protection and restoration services tailored for luxury vehicles.</p>
                    </div>

                    <div className="space-y-24">
                        {/* PPF */}
                        <div className="group relative bg-white dark:bg-surface-dark rounded-2xl p-8 lg:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                                        <span className="material-icons text-3xl">shield</span>
                                    </div>
                                    <h3 className="font-display text-3xl font-bold mb-4">Paint Protection Film (PPF)</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        The ultimate armor for your vehicle. Our self-healing PPF protects against rock chips, scratches, and road debris while maintaining a high-gloss invisible finish.
                                    </p>
                                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100 dark:border-gray-700">
                                        <span className="text-2xl font-bold font-display text-gray-900 dark:text-white">From {prices.ppf} L.E.</span>
                                        <Link to="/booking" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">Book Now →</Link>
                                    </div>
                                </div>
                                <div className="relative h-64 lg:h-auto overflow-hidden rounded-lg">
                                    <img alt="PPF" className="w-full h-full object-cover rounded-lg shadow-2xl animate-float" src={images.ppf} />
                                </div>
                            </div>
                        </div>

                        {/* Nano Ceramic */}
                        <div className="group relative bg-white dark:bg-surface-dark rounded-2xl p-8 lg:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="order-2 lg:order-1 relative h-64 lg:h-auto overflow-hidden rounded-lg">
                                    <img alt="Nano Ceramic" className="w-full h-full object-cover rounded-lg shadow-2xl animate-float" src={images.nano} />
                                </div>
                                <div className="order-1 lg:order-2 relative z-10">
                                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                                        <span className="material-icons text-3xl">science</span>
                                    </div>
                                    <h3 className="font-display text-3xl font-bold mb-4">Nano Ceramic Protection</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        Permanent bond protection. Ceramic Pro 9H forms a permanent bond with the factory paint, which will not wash off or break down.
                                    </p>
                                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100 dark:border-gray-700">
                                        <span className="text-2xl font-bold font-display text-gray-900 dark:text-white">From {prices.nano} L.E.</span>
                                        <Link to="/booking" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">Book Now →</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Paint Correction */}
                        <div className="group relative bg-white dark:bg-surface-dark rounded-2xl p-8 lg:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                                        <span className="material-icons text-3xl">auto_fix_high</span>
                                    </div>
                                    <h3 className="font-display text-3xl font-bold mb-4">Paint Correction</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        Restoring your paintwork to better-than-new condition. We remove swirl marks, scratches, and oxidation to reveal the true depth of your color.
                                    </p>
                                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100 dark:border-gray-700">
                                        <span className="text-2xl font-bold font-display text-gray-900 dark:text-white">From {prices.correction} L.E.</span>
                                        <Link to="/booking" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">Book Now →</Link>
                                    </div>
                                </div>
                                <div className="relative h-64 lg:h-auto overflow-hidden rounded-lg">
                                    <img alt="Paint Correction" className="w-full h-full object-cover rounded-lg shadow-2xl animate-float" src={images.correction} />
                                </div>
                            </div>
                        </div>

                        {/* Smaller Services */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                                    <span className="material-icons text-2xl">cleaning_services</span>
                                </div>
                                <h3 className="font-display text-2xl font-bold mb-3">Interior Detailing</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">
                                    Deep cleaning and leather protection for your cabin. We sanitize and protect every inch of your interior.
                                </p>
                                <div className="relative h-48 mb-6 overflow-hidden rounded-lg">
                                    <img alt="Interior Detailing" className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500" src={images.detailing} />
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                                    <span className="font-bold font-display text-gray-900 dark:text-white">From {prices.detailing} L.E.</span>
                                    <Link to="/booking" className="text-sm font-semibold text-primary">Book Now</Link>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                                    <span className="material-icons text-2xl">light_mode</span>
                                </div>
                                <h3 className="font-display text-2xl font-bold mb-3">Headlights Polish</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">
                                    Restore clarity and brightness to foggy headlights for safety and aesthetics. UV protection included.
                                </p>
                                <div className="relative h-48 mb-6 overflow-hidden rounded-lg">
                                    <img alt="Headlights Polish" className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500" src={images.headlights} />
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                                    <span className="font-bold font-display text-gray-900 dark:text-white">From {prices.headlights} L.E.</span>
                                    <Link to="/booking" className="text-sm font-semibold text-primary">Book Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 relative overflow-hidden bg-primary/90 dark:bg-surface-dark dark:border-t dark:border-gray-800">
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="font-display text-4xl font-bold text-white mb-6">Ready to Transform Your Vehicle?</h2>
                    <p className="text-white/80 text-lg mb-8">Book your appointment today and experience the Ceramic Pro difference.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/booking" className="bg-white text-primary px-8 py-3 rounded font-bold hover:bg-gray-100 transition-colors shadow-lg">Book Appointment</Link>
                        <Link to="/contact" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded font-bold hover:bg-white/10 transition-colors">Contact Us</Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-surface-light dark:bg-black border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <img alt="Ceramic Pro Logo Small" className="h-10 w-auto mb-6 grayscale opacity-70" src={images.logo} />
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                Leading the industry in automotive protection technology. Ceramic Pro Egypt is your trusted partner for vehicle preservation.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-display font-bold text-lg mb-6">Services</h4>
                            <ul className="space-y-3 text-gray-500 dark:text-gray-400 text-sm">
                                <li><button onClick={() => { document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-primary transition-colors cursor-pointer text-left">Ceramic Coating</button></li>
                                <li><button onClick={() => { document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-primary transition-colors cursor-pointer text-left">Paint Protection Film</button></li>
                                <li><button onClick={() => { document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-primary transition-colors cursor-pointer text-left">Interior Protection</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-display font-bold text-lg mb-6">Company</h4>
                            <ul className="space-y-3 text-gray-500 dark:text-gray-400 text-sm">
                                <li><button onClick={() => { document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-primary transition-colors cursor-pointer text-left">About Us</button></li>
                                <li><Link className="hover:text-primary transition-colors" to="/contact">Contact</Link></li>
                                <li><Link className="hover:text-primary transition-colors" to="/admin">Admin</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-display font-bold text-lg mb-6">Contact</h4>
                            <ul className="space-y-3 text-gray-500 dark:text-gray-400 text-sm">
                                <li className="flex items-center gap-2">
                                    <span className="material-icons text-primary text-sm">location_on</span>
                                    Cairo, Egypt
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-icons text-primary text-sm">phone</span>
                                    {links.phone}
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-icons text-primary text-sm">email</span>
                                    {links.email}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-xs">© 2024 Ceramic Pro Egypt. All rights reserved.</p>
                        <div className="flex space-x-4">
                            <a className="text-gray-400 hover:text-primary" href={links.facebook}>FB</a>
                            <a className="text-gray-400 hover:text-primary" href={links.instagram}>IG</a>
                            <a className="text-gray-400 hover:text-primary" href={links.whatsapp}>WA</a>
                            <a className="text-gray-400 hover:text-primary" href={links.tiktok}>TK</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}