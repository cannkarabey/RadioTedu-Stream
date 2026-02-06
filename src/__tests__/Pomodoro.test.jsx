import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Pomodoro from '../components/Pomodoro'

describe('Pomodoro', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    describe('Rendering', () => {
        it('Focus başlığını gösterir', () => {
            render(<Pomodoro />)
            expect(screen.getByText(/Focus/i)).toBeInTheDocument()
        })

        it('pomodoro panel mevcut', () => {
            render(<Pomodoro />)
            const panel = document.querySelector('.pomodoro-panel')
            expect(panel).toBeInTheDocument()
        })

        it('timer gösterir', () => {
            render(<Pomodoro />)
            // The time display contains "25" and "00"
            const timeDisplay = document.querySelector('.font-mono')
            expect(timeDisplay).toBeInTheDocument()
            expect(timeDisplay.textContent).toContain('25')
            expect(timeDisplay.textContent).toContain('00')
        })

        it('start butonunu gösterir', () => {
            render(<Pomodoro />)
            const startButton = screen.getByRole('button', { name: /start/i })
            expect(startButton).toBeInTheDocument()
        })

        it('reset butonunu gösterir', () => {
            render(<Pomodoro />)
            const resetButton = screen.getByRole('button', { name: /reset/i })
            expect(resetButton).toBeInTheDocument()
        })
    })

    describe('Timer Controls', () => {
        it('start butonuna tıklanınca pause butonu görünür', () => {
            render(<Pomodoro />)
            const startButton = screen.getByRole('button', { name: /start/i })

            fireEvent.click(startButton)

            expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
        })

        it('pause butonuna tıklanınca start butonu görünür', () => {
            render(<Pomodoro />)

            // Start
            fireEvent.click(screen.getByRole('button', { name: /start/i }))
            // Pause
            fireEvent.click(screen.getByRole('button', { name: /pause/i }))

            expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
        })
    })

    describe('Close Button', () => {
        it('close butonuna tıklanınca panel kapanır', () => {
            render(<Pomodoro />)
            const closeButton = screen.getByRole('button', { name: /close/i })

            fireEvent.click(closeButton)

            // Panel kapandığında toggle butonu görünür
            expect(screen.getByRole('button', { name: /open pomodoro/i })).toBeInTheDocument()
        })

        it('toggle butonuna tıklanınca panel tekrar açılır', () => {
            render(<Pomodoro />)

            // Close
            fireEvent.click(screen.getByRole('button', { name: /close/i }))

            // Reopen
            fireEvent.click(screen.getByRole('button', { name: /open pomodoro/i }))

            // Panel tekrar görünür
            const panel = document.querySelector('.pomodoro-panel')
            expect(panel).toBeInTheDocument()
        })
    })
})
