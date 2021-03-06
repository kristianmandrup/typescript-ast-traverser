import { BaseNodeTester } from '../../base'
import { testName } from '../../util'

/**
 * Factory to create a BinaryExpressionNode tester
 * @param node
 * @param options
 */
export function createAssignmentNodeTester(node: any, options: any) {
  // const binaryTester = new BinaryExprTester({ ...options, node })
  // if (binaryTester.matches(node)) return
  return new AssignmentNodeTester(node, options)
}

export class AssignmentNodeTester extends BaseNodeTester {
  constructor(node: any, options: any) {
    super(node, options)
    this.init(node)
  }

  init(node: any) {
    this.setTester({
      factory: 'identifier',
      node: node.left,
    })

    this.setTester({
      name: 'binary',
      factory: 'expr.binary',
      type: 'details',
      node,
    })
  }

  /**
   * Binary tester
   */
  get binaryTester() {
    return this.getTester({
      name: 'binary',
      type: 'details',
    })
  }

  /**
   * id Tester
   */
  get idNodeTester() {
    return this.getTester({
      name: 'identifier',
    })
  }

  /**
   * Factory to create a VariableDeclaration tester
   * @param node
   * @param options
   */
  createAssignmentTester(node: any, options: any) {
    const binaryTester: any = this.createDetailsTester(
      'expr.binary',
      node,
      options,
    )
    if (binaryTester.assignment(node)) return
    return this.createNodeTester('assignment', node, options)
  }

  /**
   * Get name of identifier being assigned to
   */
  get name() {
    return this.idNodeTester.name
  }

  get assignmentType(): string {
    return this.binaryTester.anyAssignment(this.node) || 'unknown'
  }

  info() {
    return {
      name: this.name,
      assignmentType: this.assignmentType,
      value: null, // TODO
    }
  }

  /**
   *
   * @param query
   */
  testDetails(query: any): any {
    return {
      name: this.idNodeTester.test(query.name),
    }
  }

  /**
   * Test identifier being assigned to
   * @param query
   */
  test(query: any): any {
    return this.testName(query.name)
  }

  testAssignmentType(query: any) {
    return testName(this.assignmentType, query)
  }

  testName(query: any) {
    return this.idNodeTester.test(query.name)
  }

  /**
   * Test type and/or id of particular typical values assigned, such as:
   * - class
   * - function
   * - other identifier
   * - undefined
   * - null
   * @param query
   */
  testValue(query: any) {
    return true
  }
}
