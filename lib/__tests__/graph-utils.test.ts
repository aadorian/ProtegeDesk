import { calculateCircularPosition, calculateNodeAngle } from '../graph-utils'

describe('graph utility functions', () => {
  describe('calculateNodeAngle', () => {
    it('should return zero radians for the first node', () => {
      expect(calculateNodeAngle(0, 4)).toBe(0)
    })

    it('should return pi radians for the middle node in an even set', () => {
      expect(calculateNodeAngle(2, 4)).toBeCloseTo(Math.PI)
    })

    it('should return the final evenly spaced angle before a full circle', () => {
      expect(calculateNodeAngle(3, 4)).toBeCloseTo((Math.PI * 3) / 2)
    })

    it('should handle a single node by placing it at the starting angle', () => {
      expect(calculateNodeAngle(0, 1)).toBe(0)
    })
  })

  describe('calculateCircularPosition', () => {
    it('should place a point to the right of the center at zero radians', () => {
      expect(calculateCircularPosition(10, 20, 5, 0)).toEqual({ x: 15, y: 20 })
    })

    it('should place a point above the center at pi over two radians', () => {
      const position = calculateCircularPosition(10, 20, 5, Math.PI / 2)

      expect(position.x).toBeCloseTo(10)
      expect(position.y).toBeCloseTo(25)
    })

    it('should return the center when the radius is zero', () => {
      expect(calculateCircularPosition(10, 20, 0, Math.PI)).toEqual({ x: 10, y: 20 })
    })
  })
})
