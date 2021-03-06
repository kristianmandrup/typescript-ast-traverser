import { BaseFactory } from './base'
import { toList } from '@tecla5/qast-util'

const defaults = {
  registry: {
    function: 'FunctionDeclaration',
    call: 'FunctionCall',
    method: 'MethodDeclaration',
    property: 'PropertyDeclaration',
    variable: 'VariableDeclaration',
    const: ['VariableDeclaration', 'Const'],
    let: ['VariableDeclaration', 'Let'],
    import: 'ImportDeclaration',
    export: 'ExportDeclaration',
    getter: ['GetAccessor', 'MethodOrAccessor'],
    setter: ['SetAccessor', 'MethodOrAccessor'],
    methodLike: 'MethodOrAccessor',
    class: 'ClassDeclaration',
    namespace: 'NamespaceExportDeclaration',
  },
}

export function createVisitorFactory(options: any) {
  return new VisitorFactory(options)
}

export class VisitorFactory extends BaseFactory {
  factory: {} // contains all registered factory methods

  constructor(options: any = {}) {
    super(options)
  }

  /**
   * Register map of visitor factories
   * @param registry
   */
  registerAllFactories(registry: any) {
    registry = registry || defaults.registry
    Object.keys(registry).map((key) => {
      this.registerFactory(key, toList(registry[key]))
    })
  }

  /**
   * Register single visitor factory
   * @param name
   * @param types
   */
  registerFactory(name: string, types: string[]) {
    // opts may contain test object and cbs object
    this.factory[name] = (name: string, opts: any = {}, cb: Function) => {
      return this.generic({
        types,
        name,
        opts,
        cb,
      })
    }
  }
}
