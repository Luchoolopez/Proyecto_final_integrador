import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmModal } from '../components/ConfirmModal';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Componente ConfirmModal', () => {
    const mockOnClose = vi.fn();
    const mockOnConfirm = vi.fn();

    const defaultProps = {
        show: true,
        onClose: mockOnClose,
        onConfirm: mockOnConfirm,
        message: '¿Estás seguro?',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe renderizar el modal con el mensaje correcto', () => {
        render(<ConfirmModal {...defaultProps} />);

        expect(screen.getByText('¿Estás seguro?')).toBeInTheDocument();
        expect(screen.getByText('Confirmar acción')).toBeInTheDocument();
        expect(screen.getByText('Confirmar')).toBeInTheDocument();
        expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    it('debe llamar a onConfirm y onClose cuando se hace clic en el botón de confirmar', () => {
        render(<ConfirmModal {...defaultProps} />);

        const confirmButton = screen.getByText('Confirmar');
        fireEvent.click(confirmButton);

        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('debe llamar a onClose cuando se hace clic en el botón de cancelar', () => {
        render(<ConfirmModal {...defaultProps} />);

        const cancelButton = screen.getByText('Cancelar');
        fireEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});
