import * as ts from 'typescript'
import { BlockStatementTester } from '../block-statement';
import {
  testName
} from '../../util'

/**
 * Factory to create a For loop tester
 * @param node
 * @param options
 */
export function createForLoopTester(node: any, options: any = {}): ForLoopTester {
  return new ForLoopTester(node, options)
}

/**
 * For loop query tester and data aggregator
 */

export class ForLoopTester extends BlockStatementTester {
  constructor(node: any, options: any) {
    super(node, options)
  }

  /**
   * Determine if the node is a simple ("old school" C style) for statement
   */
  get isFor() {
    return ts.isForStatement(this.node)
  }

  /**
   * Determine if the node is a for x of y statement
   */
  get isForOf() {
    return ts.isForOfStatement(this.node)
  }

  /**
   * Determine if the node is a for x in y statement
   */
  get isForIn() {
    return ts.isForInStatement(this.node)
  }

  /**
   * Determine and return the for for loop type ('for', 'of' or 'in')
   */
  get forType(): string {
    if (this.isFor) return 'for'
    if (this.isForIn) return 'in'
    if (this.isForOf) return 'of'
    this.error('forType: unknown type of for loop', {
      node: this.node
    })
    return 'unknown'
  }

  info() {
    return {
      ...super.info(),
      loop: true,
      for: true,
      forType: this.forType
    }
  }

  /**
   * Query whether on else block on/off and nesting levels
   */
  test(query: any) {
    return super.test(query) && this.testForType(query.type)
  }

  testForType(query: any) {
    return testName(this.forType, query)
  }
}
