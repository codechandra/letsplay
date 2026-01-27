import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-6">Our Categories</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><a href="#" className="hover:text-white hover:underline transition-colors">Men</a></li>
                            <li><a href="#" className="hover:text-white hover:underline transition-colors">Women</a></li>
                            <li><a href="#" className="hover:text-white hover:underline transition-colors">Kids</a></li>
                            <li><a href="#" className="hover:text-white hover:underline transition-colors">Accessories</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-6">Company</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><a href="#" className="hover:text-white hover:underline transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white hover:underline transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white hover:underline transition-colors">Press Room</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-6">Support</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><a href="#" className="hover:text-white hover:underline transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white hover:underline transition-colors">Warranty</a></li>
                            <li><a href="#" className="hover:text-white hover:underline transition-colors">Returns</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-6">Follow Us</h4>
                        <div className="flex gap-4">
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-letsplay-blue hover:text-white transition-all"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-letsplay-blue hover:text-white transition-all"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-letsplay-blue hover:text-white transition-all"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-letsplay-blue hover:text-white transition-all"><Youtube className="h-5 w-5" /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-medium text-slate-500">
                    <p>&copy; 2026 letsplay Sports India Pvt Ltd. All rights reserved. | Built by Chandramouli</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Terms of Supply</a>
                        <a href="#" className="hover:text-white">Terms of Use</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
