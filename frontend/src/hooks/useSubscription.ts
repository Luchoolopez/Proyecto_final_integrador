// src/hooks/useSubscription.ts
import { useState } from 'react';
import { subscriptionService } from '../api/subscriptionService';
import type { SendNewsletterDto } from '../types/subscription';

export const useSubscription = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const subscribe = async (email: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await subscriptionService.subscribe(email);
            return { success: true, data };
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Error al suscribirse';
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    const sendNewsletter = async (data: SendNewsletterDto) => {
        setLoading(true);
        setError(null);
        try {
            const response = await subscriptionService.sendNewsletter(data);
            return { success: true, data: response };
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Error al enviar el newsletter';
            if (err.response?.data?.errors) {
                setError(err.response.data.errors[0].message);
            } else {
                setError(msg);
            }
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    return {
        subscribe,
        sendNewsletter,
        loading,
        error,
        setError 
    };
};