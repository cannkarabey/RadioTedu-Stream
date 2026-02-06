import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Crossfader from '../components/Crossfader'

describe('Crossfader', () => {
    const createMockSetValue = () => vi.fn()

    describe('Rendering', () => {
        it('slider\'ı render eder', () => {
            const setValue = createMockSetValue()
            render(<Crossfader crossfaderValue={50} setCrossfaderValue={setValue} />)

            const slider = screen.getByRole('slider')
            expect(slider).toBeInTheDocument()
        })

        it('Just Music ve Just Nature labellarını gösterir', () => {
            const setValue = createMockSetValue()
            render(<Crossfader crossfaderValue={50} setCrossfaderValue={setValue} />)

            expect(screen.getByText('Just Music')).toBeInTheDocument()
            expect(screen.getByText('Just Nature')).toBeInTheDocument()
        })

        it('reset butonunu render eder', () => {
            const setValue = createMockSetValue()
            render(<Crossfader crossfaderValue={50} setCrossfaderValue={setValue} />)

            expect(screen.getByTitle('Reset to 50/50')).toBeInTheDocument()
        })
    })

    describe('Percentage Display', () => {
        it('50/50 değerinde %50 gösterir', () => {
            const setValue = createMockSetValue()
            render(<Crossfader crossfaderValue={50} setCrossfaderValue={setValue} />)

            const percentages = screen.getAllByText('50%')
            expect(percentages.length).toBe(2) // music ve nature
        })

        it('100 değerinde %0 music, %100 nature gösterir', () => {
            const setValue = createMockSetValue()
            render(<Crossfader crossfaderValue={100} setCrossfaderValue={setValue} />)

            expect(screen.getByText('0%')).toBeInTheDocument()
            expect(screen.getByText('100%')).toBeInTheDocument()
        })

        it('0 değerinde %100 music, %0 nature gösterir', () => {
            const setValue = createMockSetValue()
            render(<Crossfader crossfaderValue={0} setCrossfaderValue={setValue} />)

            expect(screen.getByText('100%')).toBeInTheDocument()
            expect(screen.getByText('0%')).toBeInTheDocument()
        })
    })

    describe('Slider Interaction', () => {
        it('slider değiştiğinde setCrossfaderValue çağrılır', () => {
            const setValue = createMockSetValue()
            render(<Crossfader crossfaderValue={50} setCrossfaderValue={setValue} />)

            const slider = screen.getByRole('slider')
            fireEvent.change(slider, { target: { value: '75' } })

            expect(setValue).toHaveBeenCalledWith(75)
        })

        it('slider min değeri 0', () => {
            const setValue = createMockSetValue()
            render(<Crossfader crossfaderValue={50} setCrossfaderValue={setValue} />)

            const slider = screen.getByRole('slider')
            expect(slider).toHaveAttribute('min', '0')
        })

        it('slider max değeri 100', () => {
            const setValue = createMockSetValue()
            render(<Crossfader crossfaderValue={50} setCrossfaderValue={setValue} />)

            const slider = screen.getByRole('slider')
            expect(slider).toHaveAttribute('max', '100')
        })
    })

    describe('Reset Button', () => {
        it('reset butonuna tıklanınca 50 değerine döner', () => {
            const setValue = createMockSetValue()
            render(<Crossfader crossfaderValue={75} setCrossfaderValue={setValue} />)

            const resetButton = screen.getByTitle('Reset to 50/50')
            fireEvent.click(resetButton)

            expect(setValue).toHaveBeenCalledWith(50)
        })
    })
})
