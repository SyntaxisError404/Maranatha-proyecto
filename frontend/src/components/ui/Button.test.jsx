import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renderiza su contenido', () => {
    render(<Button>Guardar</Button>);
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
  });

  it('dispara onClick al hacer clic', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Clic</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('queda deshabilitado y no dispara onClick cuando loading', () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Enviar</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('aplica la clase de la variante de éxito', () => {
    render(<Button variant="success">Ok</Button>);
    expect(screen.getByRole('button').className).toContain('bg-kids-green');
  });
});
