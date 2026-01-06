import { render, screen, fireEvent } from '@testing-library/react';
import { ToastNotification } from '../components/ToastNotification';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Componente ToastNotification', () => {
    const mockOnClose = vi.fn();

    const defaultProps = {
        show: true,
        onClose: mockOnClose,
        message: 'Mensaje de prueba',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe renderizar el mensaje correctamente', () => {
        render(<ToastNotification {...defaultProps} />);
        expect(screen.getByText('Mensaje de prueba')).toBeInTheDocument();
        expect(screen.getByText('Éxito')).toBeInTheDocument();
    });

    it('debe mostrar el título personalizado si se proporciona', () => {
        render(<ToastNotification {...defaultProps} title="Título Personalizado" />);
        expect(screen.getByText('Título Personalizado')).toBeInTheDocument();
    });

    it('debe renderizar la variante success con sus clases e iconos correctos', () => {
        render(<ToastNotification {...defaultProps} variant="success" />);

        const header = screen.getByText('Éxito').closest('.toast-header');
        expect(header).toHaveClass('bg-success');

        expect(document.querySelector('.text-success')).toBeInTheDocument();
    });

    it('debe renderizar la variante error con sus clases e iconos correctos', () => {
        render(<ToastNotification {...defaultProps} variant="error" />);

        expect(screen.getByText('Error')).toBeInTheDocument();

        const header = screen.getByText('Error').closest('.toast-header');
        expect(header).toHaveClass('bg-danger');

        expect(document.querySelector('.text-danger')).toBeInTheDocument();
    });

    it('debe renderizar la variante warning con sus clases e iconos correctos', () => {
        render(<ToastNotification {...defaultProps} variant="warning" />);

        expect(screen.getByText('Advertencia')).toBeInTheDocument();

        const header = screen.getByText('Advertencia').closest('.toast-header');
        expect(header).toHaveClass('bg-warning');

        expect(document.querySelector('.text-warning')).toBeInTheDocument();
    });

    it('debe llamar a onClose cuando se cierra el toast', () => {
        render(<ToastNotification {...defaultProps} />);

        const closeButton = document.querySelector('.btn-close');
        if (closeButton) {
            fireEvent.click(closeButton);
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        }
    });
});
