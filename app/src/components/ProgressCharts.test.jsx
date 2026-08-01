import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  WeightProgressChart,
  VolumeBarChart,
  FrequencyHeatmap,
} from './ProgressCharts.jsx';

describe('WeightProgressChart', () => {
  it('renders a single point (circle + text) when there is only one entry', () => {
    const { container } = render(
      <WeightProgressChart
        points={[{ date: '2026-07-10', weightUsed: 32, completedAt: '2026-07-10T09:00:00.000Z' }]}
      />
    );
    expect(container.querySelector('polyline')).toBeNull();
    expect(container.querySelector('circle')).not.toBeNull();
    expect(screen.getByText(/32\s*kg/i)).toBeInTheDocument();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a polyline for two or more points with svg aria-hidden', () => {
    const { container } = render(
      <WeightProgressChart
        points={[
          { date: '2026-07-06', weightUsed: 30, completedAt: '2026-07-06T09:00:00.000Z' },
          { date: '2026-07-20', weightUsed: 40, completedAt: '2026-07-20T09:00:00.000Z' },
        ]}
      />
    );
    expect(container.querySelector('polyline')).not.toBeNull();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText(/30\s*kg/i)).toBeInTheDocument();
  });
});

describe('VolumeBarChart', () => {
  it('renders one bar per session entry and hides the svg from AT', () => {
    const { container } = render(
      <VolumeBarChart
        bars={[
          { sessionId: 's1', date: '2026-07-06', volume: 2500 },
          { sessionId: 's2', date: '2026-07-10', volume: 1200 },
        ]}
      />
    );
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBeGreaterThanOrEqual(2);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('FrequencyHeatmap', () => {
  it('renders aria-labelled cells and the aggregate stats line', () => {
    const cells = Array.from({ length: 84 }, (_, i) => ({
      date: `2026-05-${String((i % 28) + 1).padStart(2, '0')}`,
      filled: i % 5 === 0,
      ariaLabel: i % 5 === 0 ? 'sesión completada' : 'sin sesión',
    }));
    render(
      <FrequencyHeatmap
        cells={cells}
        stats={{ last7: 3, last30: 9, streak: 2 }}
      />
    );
    expect(screen.getAllByLabelText(/sesión|sin sesión/i).length).toBe(84);
    expect(screen.getByText(/Últimos 7 días:\s*3/i)).toBeInTheDocument();
    expect(screen.getByText(/Últimos 30 días:\s*9/i)).toBeInTheDocument();
    expect(screen.getByText(/Racha actual:\s*2/i)).toBeInTheDocument();
  });
});
