import {
  testerFor,
  query,
  context,
  node
} from '../_imports'

const { log } = console

describe('class', () => {
  describe('members', () => {
    describe('all', () => {
      context('none file', () => {
        const tester = testerFor({
          fileName: 'members/none',
          type: 'declarations/class',
          traverse: (statements: any[]) => {
            // find first getter
            return statements[0].members
          }
        })

        const query: any = {
          identifiers: {
            noMatch: {
              anyOf: ['unknown']
            },
            anyOf: {
              anyOf: ['hello']
            },
            allOf: {
              allOf: ['hello']
            },
            onlyAccessors: {
              noMatch: {
                anyOf: ['unknown']
              },
              anyOf: {
                anyOf: ['name']
              },
              allOf: {
                allOf: ['name']
              }
            }
          }
        }


        describe.skip('not', () => {
          describe('testAccessors(query)', () => {
            it('not anyOf: A - true', () => {
              const result = tester.test(query.onlyAccessors.anyOf)
              expect(result).toBe(true)
            })
          })
        })
      })
    })

    context('accessors file', () => {
      const tester = testerFor({
        fileName: 'members/accessors',
        type: 'declarations/class',
        traverse: (statements: any[]) => {
          // find first getter
          return statements[0].members
        }
      })

      describe.only('test(query)', () => {
        context('has getter and setter for name', () => {
          it('anyOf: name - true ', () => {
            const res = tester.test(query.members.onlyAccessors.anyOf)
            log('should match', { res })
            expect(res).not.toBe(false)
            expect(res.result).toBe(true)
          })
        })

        context('has no matching members for unknown', () => {
          it('anyOf: name - true ', () => {
            const res = tester.test(query.members.onlyAccessors.noMatch)
            log('no match', { res })
            expect(res).toBe(false)
          })
        })
      })

      describe.skip('test(query)', () => {
        it('members: anyOf: Ix, Iy - false', () => {
          const res = tester.test(query.members)
          // expect(res.implements).toEqual(['Ix'])
          // expect(res.result).toBe(true)
        })
      })
    })
  })
})
