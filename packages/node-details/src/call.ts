import * as ts from 'typescript'
import { BaseDetailsTester } from './base'

export function createCallTester(options: any) {
  return new CallTester(options)
}

export class CallTester extends BaseDetailsTester {
  literal: any
  node: any

  /**
   * Function call (invocation) details tester
   * @constructor
   * @param options
   */
  constructor(options: any) {
    super(options)
  }

  /**
   * syntax map
   */
  get syntaxMap() {
    return {
      await: ts.SyntaxKind.AwaitExpression,
    }
  }

  /**
   * Test if function call node is an await expression
   * @param node function call node to test
   */
  await(node?: any) {
    return this.has('await', { node })
  }
}
