export class UserFormatter {
    static formatUserResponse(user: any): any {
        return {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            telefono: user.telefono,
            rol: user.rol,
            activo: user.activo,
            fecha_creacion: user.fecha_creacion,
            fecha_ultimo_acceso: user.fecha_ultimo_acceso
        };
    }

    static formatUserListResponse(users: any[]): any[] {
        return users.map(user => this.formatUserResponse(user));
    }

    static formatUserStats(users: any[]): any {
        const total = users.length;
        const active = users.filter(user => user.activo).length;
        const inactive = total - active;

        return {
            total,
            active,
            inactive,
            activePercentage: total > 0 ? (active / total) * 100 : 0
        };
    }
}