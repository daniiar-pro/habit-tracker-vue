import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getHabitsForDate, dates, habitsList } from '../../src/store/localStorage'


vi.mock('./localStorage', async (importOriginal) => {
  const actual = await importOriginal()
  return Object.assign({}, actual, {
    saveDates: vi.fn(),
  })
})

describe('getHabitsForDate', () => {
  beforeEach(() => {
    dates.value = {}
    habitsList.value = [
      { title: 'Habit 1', completed: false, date: '2023-12-01' },
      { title: 'Habit 2', completed: true, date: '2023-12-02' },
    ]
  })

  it('returns habits from dates store', () => {
    dates.value = {
      '2023-12-01': [{ title: 'Habit 1', completed: false, date: '2023-12-01' }],
    }

    const result = getHabitsForDate('2023-12-01')

    expect(result).toEqual([{ title: 'Habit 1', completed: false, date: '2023-12-01' }])
  })

  it('returns an empty array if habitsList is empty', () => {
    habitsList.value = []

    const result = getHabitsForDate('2023-12-01')

    expect(result).toEqual([])
  })
})
