import { ObjectLike } from '@app/shared/models';
import { isEqualWith, isArray, isObject } from 'lodash-es';

function deepEqualsCustomizer(firstObj: unknown, secondObj: unknown): boolean | undefined {
  if (!isArray(firstObj) || !isArray(secondObj)) {
    return undefined;
  }

  if (firstObj.length !== secondObj.length) {
    return false;
  }

  const sortedFirstObj = firstObj.sort();
  const sortedSecondObj = secondObj.sort();

  return sortedFirstObj.every((item, index) => {
    return isEqualWith(sortedFirstObj[index], sortedSecondObj[index], deepEqualsCustomizer);
  });
}

export class ObjectUtil {
  static isDeepEquals(first: unknown, second: unknown): boolean {
    return isEqualWith(first, second, deepEqualsCustomizer);
  }

  static enumToArray(enumType: { [key: string]: string }): string[] {
    if (!enumType) {
      return [];
    }
    return Object.keys(enumType)
      .filter(key => Number.isNaN(Number(key)))
      .map(key => enumType[key]);
  }

  static enumToKeyValueArray(enumType: ObjectLike): { key: string; value: ObjectLike[keyof ObjectLike] }[] {
    if (!enumType) {
      return [];
    }

    return Object.keys(enumType)
      .filter(key => isNaN(Number(key)))
      .map(key => ({ key, value: enumType[key] }));
  }

  static isEmptyObject(item: unknown): boolean {
    return isObject(item) && this.isObjectEmpty(<ObjectLike>item);
  }

  private static isObjectEmpty(obj: Record<string, unknown>) {
    return !Object.keys(obj).length;
  }

  static getDeepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj)) as T;
  }

  static isEmptyArray(item: unknown): boolean {
    return isArray(item) && item.length === 0;
  }

  static deleteEmptyProperties(obj: ObjectLike, recursive = true): ObjectLike {
    if (!obj || !isObject(obj)) {
      return obj;
    }

    const clone = ObjectUtil.getDeepCopy(obj);

    Object.keys(clone).forEach(propName => {
      const value = clone[propName];

      if (recursive && isObject(value)) {
        clone[propName] = this.deleteEmptyProperties(<ObjectLike>value, recursive);
      }

      const val = clone[propName];
      if (val === null || val === undefined || val === '' || this.isEmptyObject(val) || this.isEmptyArray(val)) {
        delete clone[propName];
      }
    });

    return clone;
  }
}
