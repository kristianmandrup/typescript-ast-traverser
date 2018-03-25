import {
  node,
  testerFor,
  query
} from '../_imports'

const { log } = console

describe('class heritage', () => {
  describe('HeritageTester', () => {

    describe('implements', () => {
      const tester = testerFor('implements-class', {
        factory: node.tester.createClassHeritageTester,
        statementIndex: 1
      })

      describe('testExtends(query)', () => {
        it('anyOf: A - false', () => {
          const result = tester.testImplements(query.implements.anyOf)
          // log('testExtends', result)
          expect(result).not.toEqual(false)
        })
      })

      describe('test(query)', () => {
        it('implements: anyOf: Ix, Iy - false', () => {
          const res = tester.test(query.heritage.onlyImplements)
          // log('test', res)
          expect(res.result).toEqual(['Ix'])
        })
      })

      describe('test(query)', () => {
        it('extends: anyOf A and implements: anyOf: Ix, Iy - false', () => {
          const res = tester.test(query.heritage.extendsAndImplements)
          // log('test', res)
          expect(res.result).toEqual(false)
        })
      })
    })
  })
})

