import * as ts from 'typescript'
import {
  ParametersTester
} from './parameters';
import {
  TypeNodeTester
} from '../../type';
import {
  isEmpty
} from '../../../../util'
import { FunctionTester } from '../../../details';
import { IndentifierNodeTester } from '../../identifier';
import {
  BlockNodeTester,
  createBlockNodeTester
} from '../../statements/block';

export function isFunctionLike(node: any) {
  return ts.isFunctionLike(node)
}

export function createFunctionTester(node: any, options: any = {}) {
  if (!isFunctionLike(node)) return
  return new FunctionLikeNodeTester(node, options)
}

/**
 * For function, arrow function or method
 * TODO: Use BlockStatementTester for adding nesting levels support and testing function block
 */
export class FunctionLikeNodeTester extends IndentifierNodeTester {
  parametersTester: ParametersTester
  functionTester: FunctionTester
  typeNodeTester: TypeNodeTester
  blockNodeTester: BlockNodeTester

  constructor(node: any, options: any) {
    super(node, options)
    if (node.parameters) {
      this.parametersTester = new ParametersTester(node.parameters, options)
    } else {
      this.log('FunctionLikeTester: no typeParameters', {
        node
      })
    }
    this.functionTester = new FunctionTester(options)

    if (node.type) {
      this.typeNodeTester = new TypeNodeTester(node.type, options)
    }

    this.blockNodeTester = createBlockNodeTester(this.node, options)
  }

  /**
   * Determine how many levels deep the if is nested
   */
  get nestedLevels() {
    return this.blockNodeTester.nestedLevels
  }

  /**
   * Collect all info for function node
   */
  info() {
    return {
      name: this.name,
      parameters: this.parametersTester.info(),
      returnType: this.returnType,
      exported: this.isExported,
      arrow: this.isArrow,
      generator: this.isGenerator,
      nestedLevels: this.nestedLevels
    }
  }

  /**
   * Determine if function is an arrow function
   */
  get isArrow(): boolean {
    return this.functionTester.is(this.node, 'arrow')
  }

  /**
   * Determine if function is a generator function with asterisk (function*)
   */
  get isGenerator(): boolean {
    return this.functionTester.is(this.node, 'generator')
  }

  /**
   * Perform query on function node
   * @param query
   */
  test(query: any) {
    return this.testName(query.name) &&
      this.testType(query.type) && // async, arrow or normal
      this.testParameters(query.parameters) &&
      this.testReturnType(query.returnType)
  }

  /**
   * Query on the return type of function node
   * @param query
   */
  testReturnType(query: any) {
    return this.typeTester.test(query)
  }

  /**
   * Get the return type. If none specified, return implicit:any
   */
  get returnType() {
    return this.typeNodeTester ? this.typeNodeTester.typeName : 'implicit:any'
  }

  /**
   * Query the return type of function node
   * @param query
   */
  testType(query: any) {
    if (isEmpty(this.modifiers)) return true
    return this.functionTester.test(this.node, query)
  }

  /**
   * Query the parameters of function node
   * @param query
   */
  testParameters(query: any) {
    return this.parametersTester.test(query)
  }
}