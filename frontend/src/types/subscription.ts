export interface Subscription {
    id: number;
    email: string;
    activo: boolean;
    fecha_suscripcion: string;
}

export interface SendNewsletterDto {
    subject: string;
    content: string;
    all?: boolean; // send to all active subscribers when true
    recipients?: string[]; // specific recipient emails
}

export interface NewsletterResponse {
    success: boolean;
    message: string;
    recipientsCount: number;
}