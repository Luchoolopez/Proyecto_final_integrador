import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscription.service';
import { SUBSCRIPTION_MESSAGES } from '../utils/subscription/subscription.constants';

export const SubscriptionController = {


    subscribe: async (req: Request, res: Response) => {
        try {
            const subscription = await SubscriptionService.subscribe(req.body);

            return res.status(201).json({
                success: true,
                message: SUBSCRIPTION_MESSAGES.SUBSCRIBE_SUCCESS, 
                data: subscription
            });

        } catch (error: any) {
            if (error.message === SUBSCRIPTION_MESSAGES.EMAIL_ALREADY_REGISTERED) {
                return res.status(409).json({ 
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: SUBSCRIPTION_MESSAGES.SUBSCRIBE_ERROR
            });
        }
    },

    unsubscribe: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'El email es requerido para desuscribirse.' 
                });
            }

            await SubscriptionService.unsubscribe(email);

            return res.status(200).json({
                success: true,
                message: SUBSCRIPTION_MESSAGES.UNSUBSCRIBE_SUCCESS
            });

        } catch (error: any) {
            if (error.message === SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND) {
                return res.status(404).json({ 
                    success: false, 
                    message: error.message 
                });
            }

            return res.status(500).json({
                success: false,
                message: SUBSCRIPTION_MESSAGES.UNSUBSCRIBE_ERROR
            });
        }
    },


    sendNewsletter: async (req: Request, res: Response) => {
        try {
            const result = await SubscriptionService.sendNewsletterToAll(req.body);

            return res.status(200).json(result);

        } catch (error: any) {
            if (error.message === SUBSCRIPTION_MESSAGES.NO_ACTIVE_SUBSCRIBERS) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: SUBSCRIPTION_MESSAGES.SEND_NEWSLETTER_ERROR
            });
        }
    }
};