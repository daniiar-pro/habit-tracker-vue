import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { saveDates, dates } from '../../src/store/localStorage'

describe('saveDates', () => {
  beforeEach(() => {
    Object.defineProperty(global, 'localStorage', {
      value: {
        setItem: vi.fn(),
      },
      writable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('saves dates to localStorage', () => {
    dates.value = {
      '2023-12-01': [{ title: 'Habit 1', completed: false, date: '2023-12-01', stopped: false }],
      '2023-12-02': [{ title: 'Habit 2', completed: true, date: '2023-12-02', stopped: true }],
    }

    saveDates()

    expect(global.localStorage.setItem).toHaveBeenCalledTimes(1)
    expect(global.localStorage.setItem).toHaveBeenCalledWith(
      'dates',
      JSON.stringify({
        '2023-12-01': [{ title: 'Habit 1', completed: false, date: '2023-12-01', stopped: false }],
        '2023-12-02': [{ title: 'Habit 2', completed: true, date: '2023-12-02', stopped: true }],
      }),
    )
  })
})
