import { toList, isArray } from '../../../util'
import { findDerived } from 'find-derived'
import { Loggable } from '../../../loggable'
import { isRegExp } from 'util'
import { IValueMatcher } from './base'
import { matcherTypeFactoryMap } from './factory-map'
import { ILoggable } from '../../../loggable/loggable'

export function createMatcherSelector(options: any = {}) {
  return new MatcherSelector(options)
}

export interface IMatcherSelector extends ILoggable {
  select(value: any): IValueMatcher
}

export class MatcherSelector extends Loggable {
  matcherTypeFactoryMap: any = matcherTypeFactoryMap

  /**
   * Resolve more detailed type of object
   * @param value
   */
  resolveObjectType(value: any): string {
    if (isRegExp(value)) return 'regexp'
    if (isArray(value)) return 'array'
    if (value.min || value.max) return 'range'
    return 'object'
  }

  /**
   * Resolve the type of value
   * @param value
   */
  resolveType(value: any): string {
    const type = typeof value
    return type === 'object' ? this.resolveObjectType(value) : type
  }

  /**
   * Determine type of the value to be testerd, then try to create each matcher for that type until one is valid
   * Return matcher if one is found to be valid
   * @param value
   * @returns IValueMatcher
   */
  select(value: any): IValueMatcher {
    const type = this.resolveType(value)
    const typeMatcherFactories = this.matcherTypeFactoryMap[type]
    if (!typeMatcherFactories) {
      this.error('select: invalid type', {
        type,
        value,
        factoryMap: matcherTypeFactoryMap,
      })
    }
    return this.selectMatcher(typeMatcherFactories, value)
  }

  /**
   * Select appropriate matcher for the value
   * @param typeMatcherFactories
   * @param value
   */
  selectMatcher(typeMatcherFactories: any, value: any): any {
    return findDerived(
      toList(typeMatcherFactories),
      (createMatcher: Function) => {
        return this.testMatcherFactory(createMatcher, value)
      },
    )
  }

  /**
   * Test if matcher factory is valid for this value
   * @param factoryFn
   * @param value
   */
  testMatcherFactory(factoryFn: Function, value: any): IValueMatcher | boolean {
    try {
      return factoryFn(this.options)
    } catch (e) {
      return false
    }
  }
}
