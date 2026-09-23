import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '../src/components/ThemeToggle'

describe('ThemeToggle', () => {
  it('alterna la clase dark y persiste la elección', () => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')

    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: /tema oscuro/i })

    fireEvent.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('matecode-theme')).toBe('dark')
  })
})
