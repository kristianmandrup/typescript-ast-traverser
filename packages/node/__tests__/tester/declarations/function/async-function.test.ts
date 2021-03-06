import {
  testerFor,
  context,
  query,
  logObj,
  log,
} from '../_imports'

describe('function declaration', () => {
  describe('async', () => {
    context('async-function file', () => {
      const tester: any = testerFor({
        fileName: 'async-function',
        type: 'function/declaration',
        factoryName: 'function.decl',
        statementIndex: 0
      })

      describe.skip('not', () => {
        describe('testMethods(query)', () => {
          it('not anyOf: A - true', () => {
            const result = tester.testParameters({
              not: query.parameters
            })
            expect(result).toBe(true)
          })
        })
      })

      describe('info()', () => {
        it('collects correct info', () => {
          const info = tester.info()
          logObj('info', info)
          expect(info).toEqual({
          })
        })
      })

      describe('testParameters(query)', () => {
        context('has matching parameter name', () => {
          it('anyOf: name - true ', () => {
            const res = tester.testParameters(query.parameters)
            log('should match', { res })
            expect(res).not.toBe(false)
            // expect(res.result).toBe(true)
          })
        })

        context('has no matching parameters for unknown', () => {
          it('anyOf: name - true ', () => {
            const res = tester.testParameters(query.parameters)
            log('no match', { res })
            expect(res).toBe(false)
          })
        })
      })

      describe.skip('test(query)', () => {
        it('members: anyOf: Ix, Iy - false', () => {
          const res = tester.test(query.parameters)
          // expect(res.implements).toEqual(['Ix'])
          // expect(res.result).toBe(true)
        })
      })
    })
  })
})
