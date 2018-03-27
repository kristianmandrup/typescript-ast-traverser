import * as ts from 'typescript'
import { BaseTester } from '../base'
import {
  createParameterTester,
  ParameterTester,
  isParameter
} from './parameter';
import {
  idDetails,
  typeName,
  nameOf,
} from '../util'
import {
  decoratorName
} from '../util/name'

export function isParameters(nodes: any[], options: any = {}) {
  const {
    error
  } = options
  if (!nodes.every(isParameter)) {
    error && error('All nodes must be parameters', {
      nodes
    })
  }
}

export function createParametersTester(node: any, options: any = {}) {
  if (!isParameters(node, options)) return
  return new ParameterTester(node, options)
}

export class ParametersTester extends BaseTester {
  parameter: ParameterTester
  nodes: ts.ParameterDeclaration[]

  constructor(nodes: any, options: any) {
    super(nodes, options)
    this.nodes = nodes
  }

  get parameters() {
    return this.nodes
  }

  /**
   * Query parameters
   * @param query the query to perform
   */
  test(query: any) {
    return this.testNames(query.names) &&
      this.testTypes(query.types) &&
      this.testDecorators(query.decorators)
  }

  /**
   * TODO: Use it instead of relying only on ListTester
   * Create a ParameterTester for the node
   * @param node
   */
  createParameterTester(node: any) {
    return new ParameterTester(node, this.options)
  }

  /**
   * Collect info for parameters
   */
  info() {
    return {
      names: this.names,
      types: this.types,
      items: this.items
    }
  }

  /**
   * The list of parameter types
   */
  get types() {
    return this.parameters.map(typeName) || []
  }

  /**
   * The list of parameter decorators
   */
  get decorators() {
    return this.parameters.map(decoratorName) || []
  }

  /**
   * The list of parameter names
   */
  get names() {
    return this.parameters.map(nameOf) || []
  }

  /**
   * The list of parameter items
   * each item has: name, type, decorators and initializer details
   */
  get items() {
    return this.parameters.map(idDetails) || []
  }

  /**
   * Query the parameter names
   * @param query
   */
  testNames(query: any) {
    return this.queryItems(this.names, query)
  }

  /**
   * Query the parameter types
   * @param query
   */
  testTypes(query: any) {
    return this.queryItems(this.types, query)
  }

  /**
   * Query the parameter items
   * @param query
   */
  testDecorators(query: any) {
    return this.queryItems(this.decorators, query)
  }

  /**
   * Query the parameter items
   * @param query
   */
  testItems(query: any, options: any = {}) {
    return this.queryItems(this.items, query, options)
  }

  createItemTesterOpts() {
    const createTester = (items: any[]) => {
      return (node: any, query: any) => {
        return this.createParameterTester(node).test(query)
      }
    }
    return {
      createTester
    }
  }

}
