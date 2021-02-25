import { DataType as DataTypeObj } from 'sequelize-typescript';
import { EnumDataType } from 'sequelize/types';

export function getColumnEnum(enumValue: Record<string, any>): EnumDataType<string> {
  return DataTypeObj.ENUM(...getValuesFromEnum(enumValue));
}

export function getValuesFromEnum(enumValue: Record<string, any>) {
  return Object.keys(enumValue);
}
