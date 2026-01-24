// app/utils/toast.ts
import { toast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
};

export const showToast = {
    // Success toast
    success: (message: string, options?: ToastOptions) => {
        toast.success(message, { ...defaultOptions, ...options });
    },

    // Error toast
    error: (message: string, options?: ToastOptions) => {
        toast.error(message, { ...defaultOptions, ...options });
    },

    // Warning toast
    warning: (message: string, options?: ToastOptions) => {
        toast.warn(message, { ...defaultOptions, ...options });
    },

    // Info toast
    info: (message: string, options?: ToastOptions) => {
        toast.info(message, { ...defaultOptions, ...options });
    },

    // Default toast
    default: (message: string, options?: ToastOptions) => {
        toast(message, { ...defaultOptions, ...options });
    },

    // Promise toast (for async operations)
    promise: (
        promise: Promise<any>,
        messages: {
            pending: string;
            success: string;
            error: string;
        },
        options?: ToastOptions
    ) => {
        return toast.promise(promise, messages, { ...defaultOptions, ...options });
    },
};