import { MpConectado } from '../models/MpConectado';

export class MercadoPagoService {
  private static clientId = process.env.MP_CLIENT_ID!;
  private static clientSecret = process.env.MP_CLIENT_SECRET!;
  private static redirectUri = process.env.MP_REDIRECT_URI!;

  /**
   * Genera la URL de autorización para conectar Mercado Pago
   */
  static getAuthorizationUrl(): string {
    const baseUrl = 'https://auth.mercadopago.com/authorization';
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      platform_id: 'mp',
      redirect_uri: this.redirectUri
    });
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Intercambia el código de autorización por tokens de acceso
   */
  static async exchangeCodeForTokens(code: string, adminUserId: number = 1) {
    try {
      const tokenUrl = 'https://api.mercadopago.com/oauth/token';

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_secret: this.clientSecret,
          client_id: this.clientId,
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const tokenData = await response.json();

      // Guardar los tokens en la base de datos
      const [mpConfig, created] = await MpConectado.upsert({
        usuario_id: adminUserId,
        mp_user_id: tokenData.user_id?.toString() || '',
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || '',
        public_key: tokenData.public_key || '',
        expires_at: new Date(Date.now() + (tokenData.expires_in * 1000))
      });

      return {
        success: true,
        message: created ? 'Cuenta de Mercado Pago conectada exitosamente' : 'Tokens actualizados exitosamente',
        data: {
          user_id: tokenData.user_id,
          expires_in: tokenData.expires_in
        }
      };

    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw new Error('Error al conectar con Mercado Pago');
    }
  }

  /**
   * Verifica si hay una conexión activa
   */
  static async isConnected(adminUserId: number = 1): Promise<boolean> {
    try {
      const mpConfig = await MpConectado.findOne({
        where: { usuario_id: adminUserId }
      });

      if (!mpConfig) return false;

      // Verificar si el token no ha expirado
      const now = new Date();
      return mpConfig.expires_at > now;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene la configuración de MP para el admin
   */
  static async getMpConfig(adminUserId: number = 1) {
    return await MpConectado.findOne({
      where: { usuario_id: adminUserId }
    });
  }
}