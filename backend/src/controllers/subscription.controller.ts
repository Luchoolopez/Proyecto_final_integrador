import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscription.service';
import { SUBSCRIPTION_MESSAGES } from '../utils/subscription/subscription.constants'; // Ajusta la ruta si es necesario
import { createSubscriptionSchema, sendNewsletterSchema } from '../validations/subscription.schema';

export const SubscriptionController = {

    subscribe: async (req: Request, res: Response) => {
        const validation = createSubscriptionSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: 'Datos inválidos',
                errors: validation.error.issues.map(e => ({
                    field: e.path[0],
                    message: e.message
                }))
            });
        }

        try {
            const subscription = await SubscriptionService.subscribe(validation.data);

            return res.status(201).json({
                success: true,
                message: SUBSCRIPTION_MESSAGES.SUBSCRIBE_SUCCESS,
                data: subscription
            });

        } catch (error: any) {
            if (error.message === SUBSCRIPTION_MESSAGES.EMAIL_ALREADY_REGISTERED) {
                return res.status(409).json({ success: false, message: error.message });
            }

            console.error('Error en subscribe:', error);
            return res.status(500).json({ success: false, message: SUBSCRIPTION_MESSAGES.SUBSCRIBE_ERROR });
        }
    },

    unsubscribe: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ success: false, message: 'El email es requerido.' });
            }

            await SubscriptionService.unsubscribe(email);

            return res.status(200).json({
                success: true,
                message: SUBSCRIPTION_MESSAGES.UNSUBSCRIBE_SUCCESS
            });

        } catch (error: any) {
            if (error.message === SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND) {
                return res.status(404).json({ success: false, message: error.message });
            }

            console.error('Error en unsubscribe:', error);
            return res.status(500).json({ success: false, message: SUBSCRIPTION_MESSAGES.UNSUBSCRIBE_ERROR });
        }
    },

    sendNewsletter: async (req: Request, res: Response) => {
        const validation = sendNewsletterSchema.safeParse(req.body);

        if (!validation.success) {
            console.error('❌ Validation error:', JSON.stringify(validation.error.issues, null, 2)); // DEBUG LOG
            return res.status(400).json({
                success: false,
                message: 'Datos del newsletter inválidos',
                errors: validation.error.issues.map(e => ({
                    field: e.path[0],
                    message: e.message
                }))
            });
        }

        try {
            const result = await SubscriptionService.sendNewsletterToAll(validation.data);

            return res.status(200).json(result);

        } catch (error: any) {
            console.error('Error sending newsletter:', error); // DEBUG LOG
            if (error.message === SUBSCRIPTION_MESSAGES.NO_ACTIVE_SUBSCRIBERS) {
                return res.status(400).json({ success: false, message: error.message });
            }

            console.error('Error en sendNewsletter:', error);
            return res.status(500).json({ success: false, message: SUBSCRIPTION_MESSAGES.SEND_NEWSLETTER_ERROR });
        }
    }
};