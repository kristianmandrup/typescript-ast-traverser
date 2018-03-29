import { BaseTester } from './base'
import {
  createTypeTester,
  TypeTester
} from '../details/type';

/**
 * Factory to create type node tester
 * Can be used to test function return type, parameter types or variable decl types
 * @param node
 * @param options
 */
export function createTypeNodeTester(node: any, options: any = {}) {
  return new TypeNodeTester(node, options)
}

export class TypeNodeTester extends BaseTester {
  typeTester: TypeTester

  /**
   * Create a TypeNodeTester instance, used to query a type node
   * @param node
   * @param options
   */
  constructor(node: any, options: any) {
    super(node, options)
    this.typeTester = createTypeTester(options)
  }

  /**
   * Get the type(s) that match for the node
   * Uses node details tester: TypeTester
   * TODO: can we return multiple types if union type or similar?
   */
  get typeName(): any {
    return this.typeTester.matches()
  }
}
