import { Request, Response } from "express";
import { MercadoPagoService } from "../services/mercadopago.service";

export class MercadoPagoController {

    /**
     * Inicia el proceso de conexión con Mercado Pago
     * Redirige al usuario a la página de autorización de MP
     */
    connect = async (req: Request, res: Response): Promise<Response> => {
        try {
            const adminUserId = req.user!.id;
            const isConnected = await MercadoPagoService.isConnected(adminUserId);

            if (isConnected) {
                return res.status(200).json({
                    success: true,
                    message: 'Ya tienes una cuenta de Mercado Pago conectada',
                    connected: true
                });
            }

            const authUrl = MercadoPagoService.getAuthorizationUrl(adminUserId);

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
        const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
        try {
            const { code, state } = req.query;

            if (!code || typeof code !== 'string') {
                console.log('❌ Código de autorización faltante');
                return res.redirect(`${frontendUrl}/admin?mp=error_code`) as unknown as Response;
            }

            if (!state || typeof state !== 'string') {
                console.log('❌ State (admin ID) faltante. Imposible identificar la cuenta.');
                return res.redirect(`${frontendUrl}/admin?mp=error_state`) as unknown as Response;
            }

            const adminUserId = parseInt(state, 10);

            console.log('✅ Código recibido, intercambiando por tokens...');
            const result = await MercadoPagoService.exchangeCodeForTokens(code, adminUserId);

            console.log('✅ Tokens obtenidos exitosamente:', result);
            return res.redirect(`${frontendUrl}/admin?mp=connected`) as unknown as Response;

        } catch (error) {
            console.error('❌ Mercado Pago callback error:', error);
            return res.redirect(`${frontendUrl}/admin?mp=error`) as unknown as Response;
        }
    };

    /**
     * Verifica el estado de la conexión
     */
    status = async (req: Request, res: Response): Promise<Response> => {
        try {
            const adminUserId = req.user!.id;
            const mpConfig = await MercadoPagoService.getMpConfig(adminUserId);
            
            // Evaluamos la conexión localmente sin volver a consultar a la Base de Datos
            let isConnected = false;
            if (mpConfig && mpConfig.expires_at > new Date()) {
                isConnected = true;
            }

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