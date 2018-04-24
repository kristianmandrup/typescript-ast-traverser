import { isDefined } from '../../../util'
import { NodeTester, INodeTester } from './node-tester'
import { IDetailsTester } from '../../details/base'

export interface IBaseNodeTester extends INodeTester {
  parentBlocks?: any[]
  isNested?: boolean
  nestedLevels?: number

  test(query: any): boolean
  query(query: any): any
  info(): any
}

export class BaseNodeTester extends NodeTester {
  _shortName: string

  /**
   * Create Base Node Tester
   * @constructor
   * @param node
   * @param options
   */
  constructor(public node: any, options: any) {
    super(node, options)
  }

  /**
   * Count occurrences of specific types of nodes
   * @param opts
   */
  countOccurrence(opts: any = {}) {
    return this.nodeCounter.countOccurrence(opts)
  }

  /**
   * Test if valid query
   * @param query
   */
  isQuery(query: any) {
    return isDefined(query)
  }

  /**
   * Init info props
   */
  initInfoProps() {
    this.infoProps = {
      ...super.infoPropsMap,
      ...this.infoPropsMap,
    }
  }

  /**
   * Get map of properties to use for node info
   */
  get infoPropsMap() {
    return {}
  }

  /**
   * Return object with node information
   * Subclass should always override or extend
   * @returns { Object } node information
   */
  info(): any {
    return this.propKeys.reduce((acc: any, propName: string) => {
      acc[propName] = this.infoProps[propName] || this[propName]
      return acc
    }, {})
  }

  /**
   * Test node based on query
   * @param query
   * @returns { boolean} result of query (if node matches query)
   */
  test(query: any): boolean {
    return this.queryEngine.test(query)
  }

  /**
   * Query node and return full query result
   * @param query
   */
  query(query: any): boolean {
    return this.queryEngine.query(query)
  }

  /**
   * Run test on tester
   * @param opts
   */
  runTest(opts: any = {}) {
    return this.queryEngine.runTest(opts)
  }

  /**
   * Run tests on multiple testers
   * @param opts
   */
  runTests(opts: any = {}) {
    return this.queryEngine.runTests(opts)
  }

  /**
   * Query on a name like property
   * @param name
   * @param query
   */
  queryName(name: string, query: any) {
    return this.queryEngine.queryName(name, query)
  }

  /**
   * Query list of items (nodes)
   * @param items
   * @param query
   * @param options
   */
  queryItems(items: any[], query: any, options: any = {}) {
    return this.queryEngine.queryItems(items, query, options)
  }

  /**
   * Create a node tester
   * @param name
   * @param node
   * @param options
   */
  createNodeTester(name: string, node?: any, options?: any): IBaseNodeTester {
    this.validateCircular('node', name, 'createNodeTester')
    return this.factory.createNodeTester(name, node, options)
  }

  /**
   * Create a details tester
   * @param name
   * @param node
   * @param options
   */
  createDetailsTester(name: string, node?: any, options?: any): IDetailsTester {
    return this.factory.createDetailsTester(name, node, options)
  }

  /**
   * short name
   */
  get shortName() {
    this._shortName =
      this._shortName ||
      this.caption
        .replace(/NodeTester$/, '')
        .replace(/Tester$/, '')
        .toLowerCase()
    return this._shortName
  }

  /**
   * Test if tester to be created is circular
   * @param category
   * @param name
   */
  isCircular(category: string, name: string) {
    return category === 'node' && name === this.shortName
  }

  /**
   * Validate and warn if creating this (node) tester is circular
   * ie. potentially creating self in infinite loop
   * @param category
   * @param name
   * @param method
   */
  validateCircular(category: string, name: string, method: string) {
    if (this.isCircular(category, name)) {
      this.warn('${method}: circular', {
        category,
        name,
        method,
      })
    }
  }

  /**
   * Convenience factory for creating a node tester
   * @param name
   * @param node
   * @param options
   */
  createCategoryTester(
    category: string,
    name: string,
    node?: any,
    options?: any,
  ): any {
    this.validateCircular(category, name, 'createCategoryTester')
    return this.factory.createCategoryTester(category, name, node, options)
  }
}
