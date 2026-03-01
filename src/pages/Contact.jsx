import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Contact() {
    const [links, setLinks] = useState({
        facebook: '#',
        instagram: '#',
        whatsapp: '#',
        tiktok: '#',
        phone: '+20 100 123 4567',
        email: 'info@ceramicpro.eg'
    });

    const [images, setImages] = useState({
        logo: 'https://image2url.com/r2/default/images/1772357315074-6c79bbf0-f81e-4143-9278-05ed53fe942d.jpg'
    });

    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const isDark = localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        const fetchContent = async () => {
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
    }, []);

    const toggleTheme = () => {
        const newDark = !darkMode;
        setDarkMode(newDark);
        if (newDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300 min-h-screen flex flex-col font-display">
            {/* Header */}
            <header className="w-full bg-surface-light dark:bg-surface-dark shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-black flex items-center justify-center rounded-lg overflow-hidden border-2 border-primary">
                            <img alt="Ceramic Pro Logo" className="w-full h-full object-cover" src={images.logo} />
                        </div>
                        <span className="text-xl font-bold tracking-tighter uppercase hidden sm:block">
                            Ceramic Pro <span className="text-primary">Egypt</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-4 sm:gap-6">
                        <nav className="hidden md:flex gap-6 text-sm font-semibold uppercase tracking-wide">
                            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                            <Link to="/booking" className="hover:text-primary transition-colors">Booking</Link>
                            <span className="text-primary cursor-default">Contact</span>
                        </nav>
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                            <button className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                                <span>EN</span>
                                <span className="material-icons text-base">expand_more</span>
                            </button>
                            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-primary">
                                <span className="material-icons">{darkMode ? 'light_mode' : 'dark_mode'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                {/* Hero Contact */}
                <section className="relative bg-black py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-10"></div>
                    <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                    <div className="container mx-auto px-4 relative z-20 flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-1/2 mb-8 md:mb-0">
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
                                GET IN <span className="text-primary">TOUCH</span>
                            </h1>
                            <p className="text-gray-300 text-lg max-w-md mb-8">
                                Experience the ultimate protection for your vehicle. Visit our studio or contact us for a consultation.
                            </p>
                            <div className="flex gap-4">
                                <Link to="/booking" className="bg-primary hover:bg-pink-600 text-white px-8 py-3 rounded font-bold uppercase tracking-wider transition-all transform hover:-translate-y-1 shadow-lg shadow-pink-500/30">
                                    Book Now
                                </Link>
                                <a href={`tel:${links.phone}`} className="border border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded font-bold uppercase tracking-wider transition-all">
                                    Call Us
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Info Cards */}
                <section className="py-16 bg-background-light dark:bg-background-dark">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-24 relative z-30">
                            <div className="bg-white dark:bg-surface-dark p-8 rounded-xl shadow-xl border-t-4 border-primary transform hover:-translate-y-2 transition-transform duration-300">
                                <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center mb-6 text-primary">
                                    <span className="material-icons text-3xl">location_on</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Visit Our Studio</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                    Plot 45, Industrial Zone,<br />
                                    New Cairo, Egypt
                                </p>
                                <button onClick={() => { document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-primary font-semibold flex items-center gap-2 hover:underline cursor-pointer">
                                    Get Directions <span className="material-icons text-sm">arrow_forward</span>
                                </button>
                            </div>

                            <div className="bg-white dark:bg-surface-dark p-8 rounded-xl shadow-xl border-t-4 border-black dark:border-gray-600 transform hover:-translate-y-2 transition-transform duration-300">
                                <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 text-black dark:text-white">
                                    <span className="material-icons text-3xl">phone_in_talk</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Contact Info</h3>
                                <div className="space-y-3">
                                    <a className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" href={`tel:${links.phone}`}>
                                        <span className="material-icons text-sm">call</span> {links.phone}
                                    </a>
                                    <a className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" href={`mailto:${links.email}`}>
                                        <span className="material-icons text-sm">email</span> {links.email}
                                    </a>
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <span className="material-icons text-sm">schedule</span> Sat - Thu: 10am - 8pm
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-surface-dark p-8 rounded-xl shadow-xl border-t-4 border-primary transform hover:-translate-y-2 transition-transform duration-300">
                                <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center mb-6 text-primary">
                                    <span className="material-icons text-3xl">share</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Follow Us</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Check out our latest work on social media.
                                </p>
                                <div className="flex gap-4">
                                    <a className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-primary transition-colors" href={links.facebook}>FB</a>
                                    <a className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-primary transition-colors" href={links.instagram}>IG</a>
                                    <a className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-primary transition-colors" href={links.whatsapp}>WA</a>
                                    <a className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-primary transition-colors" href={links.tiktok}>TK</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Form & Map */}
                <section className="py-16 bg-white dark:bg-surface-dark" id="contact-form">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row gap-12">
                            <div className="lg:w-1/2">
                                <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Inquiry</span>
                                <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-black dark:text-white">Send Us A Message</h2>
                                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Name</label>
                                            <input type="text" placeholder="John Doe" className="w-full bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Phone</label>
                                            <input type="tel" placeholder="+20 1xx xxx xxxx" className="w-full bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Email</label>
                                        <input type="email" placeholder="john@example.com" className="w-full bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Interest</label>
                                        <select className="w-full bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors">
                                            <option>Ceramic Coating</option>
                                            <option>Paint Protection Film (PPF)</option>
                                            <option>Window Tinting</option>
                                            <option>Full Detailing</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Message</label>
                                        <textarea rows="4" placeholder="Tell us about your car and what you need..." className="w-full bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" required></textarea>
                                    </div>
                                    <button type="submit" className="bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider py-4 px-10 rounded hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all w-full md:w-auto">
                                        Send Message
                                    </button>
                                </form>
                            </div>
                            <div className="lg:w-1/2 h-[500px] lg:h-auto rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 relative map-container" id="map">
                                <iframe allowFullScreen="" className="absolute inset-0 w-full h-full grayscale invert-0 dark:invert contrast-75" height="100%" loading="lazy" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55251.37709964616!2d31.428666!3d30.059483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583cb2b29c9a2f%3A0x82662283d0c266a0!2sNew%20Cairo%201%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1647867295841!5m2!1sen!2seg" style={{ border: 0 }} width="100%"></iframe>
                                <div className="absolute bottom-4 left-4 bg-white dark:bg-black p-4 rounded shadow-lg max-w-xs border-l-4 border-primary">
                                    <p className="text-sm font-bold text-black dark:text-white">Ceramic Pro Egypt</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Visit us for premium service.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-black text-white pt-16 pb-8 border-t-4 border-primary">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-10 h-10 bg-white/10 flex items-center justify-center rounded border border-primary">
                                    <span className="font-bold text-xl">CP</span>
                                </div>
                                <span className="text-xl font-bold tracking-tighter uppercase">Ceramic Pro</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                World leader in ceramic coatings based on nanotechnology. We offer permanent protection for all surfaces.
                            </p>
                            <div className="flex gap-4">
                                <a className="text-gray-400 hover:text-primary transition-colors" href={links.facebook}>FB</a>
                                <a className="text-gray-400 hover:text-primary transition-colors" href={links.instagram}>IG</a>
                                <a className="text-gray-400 hover:text-primary transition-colors" href={links.tiktok}>TK</a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-6 border-b border-gray-800 pb-2 inline-block">Quick Links</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><Link className="hover:text-primary transition-colors" to="/">Home</Link></li>
                                <li><Link className="hover:text-primary transition-colors" to="/booking">Booking</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-6 border-b border-gray-800 pb-2 inline-block">Our Services</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><Link className="hover:text-primary transition-colors" to="/">Ceramic Coating</Link></li>
                                <li><Link className="hover:text-primary transition-colors" to="/">Kavaca PPF</Link></li>
                                <li><Link className="hover:text-primary transition-colors" to="/">Interior Protection</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-6 border-b border-gray-800 pb-2 inline-block">Get In Touch</h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li className="flex items-start gap-3">
                                    <span className="material-icons text-primary text-base mt-1">location_on</span>
                                    <span>Plot 45, Industrial Zone, New Cairo, Egypt</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-icons text-primary text-base">phone</span>
                                    <span>{links.phone}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-icons text-primary text-base">email</span>
                                    <span>{links.email}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                        <p>© 2023 Ceramic Pro Egypt. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
                            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}