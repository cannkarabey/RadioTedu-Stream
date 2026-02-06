import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ChannelSwitcher from '../components/ChannelSwitcher'

// Mock channel config
vi.mock('../channelConfig', () => ({
    CHANNELS: {
        jazz: { id: 'jazz', name: 'Jazz' },
        lofi: { id: 'lofi', name: 'Lo-Fi' },
        classical: { id: 'classical', name: 'Classical' },
    },
}))

describe('ChannelSwitcher', () => {
    const createMockOnChange = () => vi.fn()

    describe('Rendering', () => {
        it('tüm kanal butonlarını render eder', () => {
            const onChange = createMockOnChange()
            render(<ChannelSwitcher currentChannel="jazz" onChannelChange={onChange} />)

            expect(screen.getByText('Jazz')).toBeInTheDocument()
            expect(screen.getByText('Lo-Fi')).toBeInTheDocument()
            expect(screen.getByText('Classical')).toBeInTheDocument()
        })

        it('music ikonu gösterir', () => {
            const onChange = createMockOnChange()
            render(<ChannelSwitcher currentChannel="jazz" onChannelChange={onChange} />)

            // FaMusic icon'u svg olarak render edilir
            const musicIcon = document.querySelector('.text-gold')
            expect(musicIcon).toBeInTheDocument()
        })
    })

    describe('Active State', () => {
        it('aktif kanal active class\'a sahip', () => {
            const onChange = createMockOnChange()
            render(<ChannelSwitcher currentChannel="lofi" onChannelChange={onChange} />)

            const lofiButton = screen.getByText('Lo-Fi')
            expect(lofiButton).toHaveClass('active')
        })

        it('diğer kanallar active class\'a sahip değil', () => {
            const onChange = createMockOnChange()
            render(<ChannelSwitcher currentChannel="lofi" onChannelChange={onChange} />)

            const jazzButton = screen.getByText('Jazz')
            expect(jazzButton).not.toHaveClass('active')
        })
    })

    describe('Channel Selection', () => {
        it('kanal butonuna tıklanınca onChannelChange çağrılır', () => {
            const onChange = createMockOnChange()
            render(<ChannelSwitcher currentChannel="jazz" onChannelChange={onChange} />)

            const classicalButton = screen.getByText('Classical')
            fireEvent.click(classicalButton)

            expect(onChange).toHaveBeenCalledWith('classical')
        })

        it('her kanal kendi id\'si ile çağrılır', () => {
            const onChange = createMockOnChange()
            render(<ChannelSwitcher currentChannel="classical" onChannelChange={onChange} />)

            fireEvent.click(screen.getByText('Jazz'))
            expect(onChange).toHaveBeenCalledWith('jazz')

            fireEvent.click(screen.getByText('Lo-Fi'))
            expect(onChange).toHaveBeenCalledWith('lofi')
        })
    })

    describe('Button Attributes', () => {
        it('her buton title attribute\'a sahip', () => {
            const onChange = createMockOnChange()
            render(<ChannelSwitcher currentChannel="jazz" onChannelChange={onChange} />)

            expect(screen.getByTitle('Switch to Jazz')).toBeInTheDocument()
            expect(screen.getByTitle('Switch to Lo-Fi')).toBeInTheDocument()
            expect(screen.getByTitle('Switch to Classical')).toBeInTheDocument()
        })
    })
})
