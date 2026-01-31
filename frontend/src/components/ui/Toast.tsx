import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
    message: string;
    type?: ToastType;
    isVisible: boolean;
    onClose: () => void;
}

const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
};

const styles = {
    success: 'bg-white border-green-100',
    error: 'bg-white border-red-100',
    warning: 'bg-white border-yellow-100',
    info: 'bg-white border-blue-100'
};

export function Toast({ message, type = 'info', isVisible, onClose }: ToastProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className="fixed top-24 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border border-slate-100 min-w-[300px] bg-white"
                >
                    <div className={cn("p-2 rounded-full bg-opacity-10", styles[type])}>
                        {icons[type]}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">{message}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XCircle className="w-4 h-4" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
