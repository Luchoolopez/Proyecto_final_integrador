import { Subscription } from '../models'; 
import { Op } from 'sequelize';
import { CreateSubscriptionInput, SendNewsletterInput } from '../validations/subscription.schema';
import { SUBSCRIPTION_MESSAGES } from '../utils/subscription/subscription.constants';
import { sendNewsletterEmail } from '../utils/email/email.service';

export const SubscriptionService = {
    subscribe: async (data: CreateSubscriptionInput) => {
        try {
            const existingSubscription = await Subscription.findOne({
                where: { email: data.email }
            });

            if (existingSubscription) {
                if (existingSubscription.activo) {
                    throw new Error(SUBSCRIPTION_MESSAGES.EMAIL_ALREADY_REGISTERED);
                }
                existingSubscription.activo = true;
                existingSubscription.fecha_baja = null;
                existingSubscription.fecha_suscripcion = new Date(); 
                
                await existingSubscription.save();
                return existingSubscription;
            }

            const newSubscription = await Subscription.create({
                email: data.email,
                activo: data.activo ?? true,
                fecha_baja: data.fecha_baja ?? null,
            });
            return newSubscription;

        } catch (error: any) {
            if (error.message === SUBSCRIPTION_MESSAGES.EMAIL_ALREADY_REGISTERED) {
                throw error;
            }
            console.error('Error en servicio subscribe:', error);
            throw new Error(SUBSCRIPTION_MESSAGES.SUBSCRIBE_ERROR);
        }
    },

    unsubscribe: async (email: string) => {
        try {
            const subscription = await Subscription.findOne({ 
                where: { email, activo: true } 
            });

            if (!subscription) {
                throw new Error(SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND);
            }

            subscription.activo = false;
            subscription.fecha_baja = new Date();
            await subscription.save();

            return true;

        } catch (error: any) {
            if (error.message === SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND) {
                throw error;
            }
            console.error('Error en servicio unsubscribe:', error);
            throw new Error(SUBSCRIPTION_MESSAGES.UNSUBSCRIBE_ERROR);
        }
    },

    sendNewsletterToAll: async (data: SendNewsletterInput) => {
        try {
            let emailList: string[] = [];

            if (data.recipients && data.recipients.length) {
                emailList = data.recipients;
            } else if (data.all) {
                const subscribers = await Subscription.findAll({
                    where: { activo: true },
                    attributes: ['email'],
                    raw: true
                });

                if (!subscribers.length) {
                    throw new Error(SUBSCRIPTION_MESSAGES.NO_ACTIVE_SUBSCRIBERS);
                }

                emailList = subscribers.map((sub: any) => sub.email);
            } else {
                throw new Error('No se especificaron destinatarios.');
            }

            await sendNewsletterEmail(emailList, data.subject, data.content);

            return {
                success: true,
                message: SUBSCRIPTION_MESSAGES.SEND_SUCCESS,
                recipientsCount: emailList.length
            };

        } catch (error: any) {
            if (error.message === SUBSCRIPTION_MESSAGES.NO_ACTIVE_SUBSCRIBERS) {
                throw error;
            }
            console.error('Error en servicio sendNewsletterToAll:', error);
            throw new Error(SUBSCRIPTION_MESSAGES.SEND_NEWSLETTER_ERROR);
        }
    }
};

export namespace SubscriptionServiceHelpers {
    export const getActiveSubscribers = async () => {
        const subscribers = await Subscription.findAll({
            where: { activo: true },
            attributes: ['email'],
            raw: true
        });
        return subscribers.map((s: any) => s.email);
    };
    export const searchSubscribers = async (query: string) => {
        const where: any = { activo: true };
        if (query && query.trim().length) {
            where.email = { [Op.like]: `%${query.trim()}%` };
        }
        const subscribers = await Subscription.findAll({
            where,
            attributes: ['email'],
            limit: 50,
            raw: true
        });
        return subscribers.map((s: any) => s.email);
    };
}