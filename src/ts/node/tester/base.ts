import * as ts from 'typescript'
import { NodeDetailsTester } from '../details/generic';
import { IdentifierTester } from '../details';
import { Loggable } from '../../loggable';
import { NodeTester } from '.';
import {
  keysOf
} from '../../util'

export interface INodeTester {
  tester: NodeTester
  details: NodeDetailsTester
}

const testMethodMap = {
  find: ['one', 'any', 'anyOf', 'oneOf'],
  every: ['exactly', 'all', 'allOf'],
  some: ['some']
}

export class BaseTester extends Loggable {
  identifier: IdentifierTester
  $node: INodeTester
  node: any

  constructor(node: any, options: any) {
    super(options)
    this.identifier = new IdentifierTester(options)
    if (!node) {
      this.error(`BaseTester: Missing node for tester`, {
        node,
        options,
        constructor: this.constructor.name
      })
    }

    this.node = node
    this.$node = {
      tester: new NodeTester(options),
      details: new NodeDetailsTester(options)
    }
  }

  get modifiers() {
    return this.node.modifiers || []
  }

  nameOf(node: ts.Node) {
    return node['name'].getText()
  }

  get name() {
    return this.nameOf(this.node)
  }

  arrayTestMethod(obj: any): any {
    const keys: string[] = keysOf(obj)
    const methodKeys: string[] = Object.keys(testMethodMap)
    let keyName
    const method = methodKeys.find((methodKey: string) => {
      keyName = keys.find(key => {
        return testMethodMap[methodKey].includes(key)
      })
      return Boolean(keyName)
    })
    const result = {
      method,
      keyName
    }
    return method && result || this.error(`arrayTestMethod: Invalid ${obj}`)
  }

  testNot(query: any, tester: Function) {
    if (!query) return true
    return query.not ? !Boolean(tester(query.not)) : tester(query)
  }

  // TODO
  orQuery(query: any, tester: Function) {
    throw new Error('Not yet implemented')
  }

  testOr(query: any, tester: Function) {
    if (!query) return true
    return query.or ? this.orQuery(query.or, tester) : tester(query)
  }

  nameMatch(nodeName: string, name: string | RegExp) {
    return name instanceof RegExp ? name.test(nodeName) : name === nodeName
  }

  createNameTest(nameQuery: any) {
    return (nodeName: string) => {
      const nameMatchers = nameQuery.anyOf || []
      return nameMatchers.find((match: string | RegExp) => {
        return this.nameMatch(nodeName, match)
      })
    }
  }

  test(query: any): any {
    return true
  }

  exported(exported: true = true) {
    return Boolean(this.isExported) === Boolean(exported)
  }

  get isExported() {
    return this.identifier.is(this.node, 'exported')
  }

  testName(name: string): boolean {
    return this.name
  }

  testType(type: string): boolean {
    return Boolean(!type || this.validatePrimitiveType(type) && this.$node.details.is(this.node, type))
  }

  validatePrimitiveType(type: string): boolean {
    return this.primitiveTypes.includes(type)
  }

  get primitiveTypes() {
    return ['boolean', 'string', 'number', 'array', 'void']
  }
}

