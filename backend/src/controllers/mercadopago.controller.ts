import { Request, Response } from "express";
import { MercadoPagoService } from "../services/mercadopago.service";

export class MercadoPagoController {

    /**
     * Inicia el proceso de conexión con Mercado Pago
     * Redirige al usuario a la página de autorización de MP
     */
    connect = async (req: Request, res: Response): Promise<Response> => {
        try {
            const isConnected = await MercadoPagoService.isConnected();

            if (isConnected) {
                return res.status(200).json({
                    success: true,
                    message: 'Ya tienes una cuenta de Mercado Pago conectada',
                    connected: true
                });
            }

            const authUrl = MercadoPagoService.getAuthorizationUrl();

            return res.status(200).json({
                success: true,
                message: 'Redirige al usuario a esta URL para autorizar',
                authUrl,
                connected: false
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error al iniciar conexión con Mercado Pago',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    };

    /**
     * Maneja el callback de Mercado Pago después de la autorización
     * Intercambia el código por tokens de acceso
     */
    callback = async (req: Request, res: Response): Promise<Response> => {
        console.log('🔄 Mercado Pago callback iniciado');
        console.log('Query params:', req.query);
        try {
            const { code, state } = req.query;

            if (!code || typeof code !== 'string') {
                console.log('❌ Código de autorización faltante');
                return res.status(400).json({
                    success: false,
                    message: 'Código de autorización faltante'
                });
            }

            console.log('✅ Código recibido, intercambiando por tokens...');
            const result = await MercadoPagoService.exchangeCodeForTokens(code);

            console.log('✅ Tokens obtenidos exitosamente:', result);
            // Redirigimos al panel de admin para que el usuario vea que la conexión fue exitosa.
            const redirectUrl = `${process.env.FRONTEND_URL ?? ''}/admin?mp=connected`;
            return res.redirect(redirectUrl) as unknown as Response; //probando asi simple, hay que cambiarlo o mejarlo 

        } catch (error) {
            console.error('❌ Mercado Pago callback error:', error);
            const redirectUrl = `${process.env.FRONTEND_URL ?? ''}/admin?mp=error`;
            return res.redirect(redirectUrl) as unknown as Response;
        }
    };

    /**
     * Verifica el estado de la conexión
     */
    status = async (req: Request, res: Response): Promise<Response> => {
        try {
            const isConnected = await MercadoPagoService.isConnected();
            const mpConfig = await MercadoPagoService.getMpConfig();

            return res.status(200).json({
                success: true,
                connected: isConnected,
                config: isConnected ? {
                    user_id: mpConfig?.mp_user_id,
                    connected_at: mpConfig?.fecha_conexion,
                    expires_at: mpConfig?.expires_at
                } : null
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error al verificar estado de conexión',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    };
}