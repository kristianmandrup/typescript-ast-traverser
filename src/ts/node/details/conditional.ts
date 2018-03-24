
import { CheckModifier } from './generic'
import { BaseDetailsTester } from './base';

export class ConditionalTester extends BaseDetailsTester {
  constructor(options: any) {
    super(options)
    this.checkers = new CheckModifier(options).conditional
  }
}