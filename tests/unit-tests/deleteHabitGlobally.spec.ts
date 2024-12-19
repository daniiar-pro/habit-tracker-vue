import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { deleteHabitGlobally, dates, habitsList } from '../../src/store/localStorage'

describe('deleteHabitGlobally', () => {
  beforeEach(() => {
    Object.defineProperty(global, 'localStorage', {
      value: {
        setItem: vi.fn(),
      },
      writable: true,
    })

    dates.value = {
      '2023-12-01': [
        { title: 'Habit 1', completed: false, date: '2023-12-01', stopped: false },
        { title: 'Habit 2', completed: true, date: '2023-12-01', stopped: false },
      ],
      '2023-12-02': [
        { title: 'Habit 1', completed: false, date: '2023-12-02', stopped: false },
        { title: 'Habit 3', completed: true, date: '2023-12-02', stopped: false },
      ],
    }

    habitsList.value = [
      { title: 'Habit 1', completed: false, date: '2023-12-01' },
      { title: 'Habit 2', completed: true, date: '2023-12-01' },
      { title: 'Habit 3', completed: true, date: '2023-12-02' },
    ]
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('removes the specified habit globally from dates and habitsList', () => {
    deleteHabitGlobally('Habit 1')

    expect(dates.value).toEqual({
      '2023-12-01': [{ title: 'Habit 2', completed: true, date: '2023-12-01', stopped: false }],
      '2023-12-02': [{ title: 'Habit 3', completed: true, date: '2023-12-02', stopped: false }],
    })

    expect(habitsList.value).toEqual([
      { title: 'Habit 2', completed: true, date: '2023-12-01' },
      { title: 'Habit 3', completed: true, date: '2023-12-02' },
    ])

    expect(global.localStorage.setItem).toHaveBeenCalledWith('dates', JSON.stringify(dates.value))
    expect(global.localStorage.setItem).toHaveBeenCalledWith(
      'habitsList',
      JSON.stringify(habitsList.value),
    )
  })

  it('does nothing if the habit does not exist', () => {
    deleteHabitGlobally('Nonexistent Habit')

    expect(dates.value).toEqual({
      '2023-12-01': [
        { title: 'Habit 1', completed: false, date: '2023-12-01', stopped: false },
        { title: 'Habit 2', completed: true, date: '2023-12-01', stopped: false },
      ],
      '2023-12-02': [
        { title: 'Habit 1', completed: false, date: '2023-12-02', stopped: false },
        { title: 'Habit 3', completed: true, date: '2023-12-02', stopped: false },
      ],
    })

    expect(habitsList.value).toEqual([
      { title: 'Habit 1', completed: false, date: '2023-12-01' },
      { title: 'Habit 2', completed: true, date: '2023-12-01' },
      { title: 'Habit 3', completed: true, date: '2023-12-02' },
    ])

    expect(global.localStorage.setItem).toHaveBeenCalledWith('dates', JSON.stringify(dates.value))
    expect(global.localStorage.setItem).toHaveBeenCalledWith(
      'habitsList',
      JSON.stringify(habitsList.value),
    )
  })
})
