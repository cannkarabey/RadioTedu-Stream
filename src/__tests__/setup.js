import '@testing-library/jest-dom'

// Mock Audio API for tests
global.Audio = class {
    constructor(src) {
        this.src = src
        this.volume = 1
        this.paused = true
    }
    play() {
        this.paused = false
        return Promise.resolve()
    }
    pause() {
        this.paused = true
    }
    load() { }
}

// Mock HTMLMediaElement
Object.defineProperty(window.HTMLMediaElement.prototype, 'load', {
    configurable: true,
    writable: true,
    value: () => { },
})

Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
    configurable: true,
    writable: true,
    value: () => Promise.resolve(),
})

Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    writable: true,
    value: () => { },
})
