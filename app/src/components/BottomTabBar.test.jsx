import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BottomTabBar } from './BottomTabBar.jsx';

describe('BottomTabBar — Progress tab (AC1)', () => {
  it('renders five tabs including Progreso → /progress after Historial', () => {
    render(
      <MemoryRouter>
        <BottomTabBar />
      </MemoryRouter>
    );

    const items = screen.getAllByTestId('tab-item');
    expect(items).toHaveLength(5);

    expect(screen.getByRole('link', { name: /Historial/i })).toHaveAttribute('href', '/history');
    const progress = screen.getByRole('link', { name: /Progreso/i });
    expect(progress).toHaveAttribute('href', '/progress');

    const labels = items.map((el) => el.textContent);
    const historialIdx = labels.findIndex((t) => /Historial/i.test(t));
    const progresoIdx = labels.findIndex((t) => /Progreso/i.test(t));
    expect(progresoIdx).toBe(historialIdx + 1);
  });
});
