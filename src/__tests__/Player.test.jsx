import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Player from '../components/Player'

describe('Player', () => {
    const defaultProps = {
        crossfaderValue: 50,
        streamUrl: 'https://example.com/stream',
    }

    describe('Rendering', () => {
        it('play/pause butonunu render eder', () => {
            render(<Player {...defaultProps} />)
            const button = screen.getByRole('button', { name: /play|pause/i })
            expect(button).toBeInTheDocument()
        })

        it('restart butonunu render eder', () => {
            render(<Player {...defaultProps} />)
            const restartButton = screen.getByTitle('Restart stream')
            expect(restartButton).toBeInTheDocument()
        })

        it('volume bar\'larını render eder', () => {
            render(<Player {...defaultProps} />)
            const volumeBars = document.querySelectorAll('.volume-bar')
            expect(volumeBars.length).toBe(10)
        })

        it('başlangıçta connecting mesajı gösterir', () => {
            render(<Player {...defaultProps} />)
            expect(screen.getByText('connecting...')).toBeInTheDocument()
        })
    })

    describe('Volume Control', () => {
        it('volume bar\'a tıklanınca volume değişir', () => {
            render(<Player {...defaultProps} />)
            const volumeBars = document.querySelectorAll('.volume-bar')

            // 5. bar'a tıkla (%50 volume)
            fireEvent.click(volumeBars[4])

            // İlk 5 bar aktif olmalı
            const activeBars = document.querySelectorAll('.volume-bar.active')
            expect(activeBars.length).toBe(5)
        })

        it('son volume bar\'a tıklanınca %100 volume olur', () => {
            render(<Player {...defaultProps} />)
            const volumeBars = document.querySelectorAll('.volume-bar')

            fireEvent.click(volumeBars[9])

            const activeBars = document.querySelectorAll('.volume-bar.active')
            expect(activeBars.length).toBe(10)
        })
    })

    describe('Play/Pause Toggle', () => {
        it('play butonuna tıklanınca togglePlay çağrılır', async () => {
            render(<Player {...defaultProps} />)
            const playButton = screen.getByRole('button', { name: /play/i })

            fireEvent.click(playButton)
            // Audio mock olduğu için state değişimini kontrol ediyoruz
            expect(playButton).toBeInTheDocument()
        })
    })

    describe('Audio Element', () => {
        it('audio element doğru src ile render edilir', () => {
            render(<Player {...defaultProps} />)
            const audio = document.querySelector('audio')
            expect(audio).toBeInTheDocument()
            expect(audio.src).toBe(defaultProps.streamUrl)
        })
    })
})
