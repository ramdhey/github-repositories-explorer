import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import FireworksBg from '../FireworksBg'

// Mock the react-tsparticles library
vi.mock('react-tsparticles', () => ({
  default: ({ options }: { options: any }) => (
    <div data-testid="particles" data-options={JSON.stringify(options)} />
  ),
}))

// Mock the tsparticles-preset-fireworks library
vi.mock('tsparticles-preset-fireworks', () => ({
  loadFireworksPreset: vi.fn(),
}))

describe('FireworksBg', () => {
  it('renders the particles component with correct options', () => {
    render(<FireworksBg />)
    
    const particles = screen.getByTestId('particles')
    expect(particles).toBeInTheDocument()
    
    const options = JSON.parse(particles.getAttribute('data-options') || '{}')
    expect(options).toEqual({
      preset: 'fireworks',
      fullScreen: { zIndex: -1 },
      background: { color: 'transparent' },
      sounds: {
        enable: false,
      },
    })
  })
}) 