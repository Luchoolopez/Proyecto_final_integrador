export interface Subscription {
    id: number;
    email: string;
    activo: boolean;
    fecha_suscripcion: string;
}

export interface SendNewsletterDto {
    subject: string;
    content: string;
}

export interface NewsletterResponse {
    success: boolean;
    message: string;
    recipientsCount: number;
}