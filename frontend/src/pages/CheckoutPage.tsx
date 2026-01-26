import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CreditCard, DollarSign, ShieldCheck, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { bookingData, venue } = location.state || {};

    const [isProcessing, setIsProcessing] = useState(false);

    if (!bookingData) {
        return <div className="p-20 text-center">No booking data found.</div>;
    }

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate local UI delay before sending to backend
        setTimeout(() => {
            navigate(`/booking/${venue.id}`, { state: { confirmed: true, bookingData } });
        }, 2000);
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Payment Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <CreditCard className="text-letsplay-blue" /> Payment Method
                        </h2>

                        <div className="space-y-4">
                            <div className="p-4 border-2 border-letsplay-blue bg-blue-50/30 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-16 bg-slate-800 rounded-lg flex items-center justify-center text-white font-bold italic">VISA</div>
                                    <div>
                                        <p className="font-bold text-slate-900">Visa ending in 4242</p>
                                        <p className="text-xs text-slate-500 font-medium">Expires 12/26</p>
                                    </div>
                                </div>
                                <div className="h-5 w-5 rounded-full border-4 border-letsplay-blue bg-white"></div>
                            </div>

                            <button className="w-full p-4 border border-slate-200 rounded-2xl flex items-center gap-4 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
                                <div className="h-10 w-16 bg-slate-100 rounded-lg flex items-center justify-center text-xl">💳</div>
                                Add New Card
                            </button>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 italic text-sm text-slate-400 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-green-500" /> Secure SSL Encrypted Payment
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl">
                        <h3 className="font-black text-xl mb-6">Booking Summary</h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                                <span className="text-slate-400 text-sm">{venue.name}</span>
                                <span className="font-bold">₹{venue.price || venue.pricePerHour}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                                <span className="text-slate-400 text-sm">Service Fee</span>
                                <span className="font-bold">₹50</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-2xl font-black text-letsplay-yellow">₹{(venue.price || venue.pricePerHour) + 50}</span>
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 text-lg bg-letsplay-yellow text-slate-900 hover:bg-yellow-400"
                            onClick={handlePayment}
                            isLoading={isProcessing}
                        >
                            Pay & Confirm
                        </Button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center">
                        <p className="text-xs text-slate-400 font-medium">100% Refundable up to 24 hours before the slot</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
