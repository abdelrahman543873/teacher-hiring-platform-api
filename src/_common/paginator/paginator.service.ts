import { PaginationRes } from './paginator.types';
import { MyModelStatic } from '../database/database.static-model';
import { SortEnum } from '../graphql/graphql.enum';
import { IPaginateInput } from './paginator.interface';

export const parseSortArray = (sortArr: Record<string, any> | Array<any>[]) => {
  return sortArr.map(obj => (Array.isArray(obj) ? obj : Object.entries(obj)));
};

export const defaultPaginateObj = {
  filter: {},
  sort: [{ createdAt: SortEnum.DESC }],
  page: 0,
  limit: 15,
  include: [],
  attributes: []
};

export const fillUnDefinedValues = (input: IPaginateInput) => {
  for (const key of Object.keys(defaultPaginateObj)) {
    if (!input[key]) {
      input[key] = defaultPaginateObj[key];
    }
  }
  return input;
};

export const paginate = async <T>(
  model: MyModelStatic,
  input: IPaginateInput = defaultPaginateObj
): Promise<PaginationRes<T>> => {
  let totalPages = 0,
    totalCount = 0,
    hasNext = false;
  let { filter, include, limit, page, sort, attributes } = fillUnDefinedValues(input);
  // Using `findAll` instead of `count` because `count` generates a different SQL
  totalCount = (await model.findAll({ where: filter, include })).length;
  if (limit > 50) limit = 50;
  if (limit < 0) limit = 15;
  if (page < 0) page = 0;
  totalPages = totalCount / limit < 1 ? 1 : Math.ceil(totalCount / limit);
  const skip = page > 1 ? (page - 1) * limit : 0;
  hasNext = skip + limit < totalCount;
  let order = null;
  if (Array.isArray(sort)) {
    order = parseSortArray(sort);
  } else {
    // Literal query
    order = sort;
  }
  const items = await model.findAll({
    where: filter,
    ...(order && { order }),
    attributes,
    limit,
    offset: skip,
    include,
    subQuery: false,
    nest: true,
    raw: true
  });
  return {
    pageInfo: {
      totalCount,
      totalPages,
      page,
      limit,
      hasNext
    },
    items: <any>items
  };
};

export const manualPaginator = <T>(
  array: T[] = [],
  filter = {},
  sort = '-createdAt',
  page = 0,
  limit = 15
): PaginationRes<T> => {
  const res = {
    pageInfo: {
      totalCount: 0,
      totalPages: 0,
      page: 0,
      limit: 15,
      hasNext: false
    },
    items: []
  };
  if (!array || !array.length) return res;
  let totalPages = 0,
    totalCount = 0,
    hasNext = false;
  let sortField = sort;
  sortField = sort && sort.startsWith('-') ? sort.replace('-', '') : null;
  let items = !sort
    ? array
    : sort.startsWith('-')
    ? array.sort((a, b) => b[sortField] - a[sortField])
    : array.sort((a, b) => a[sortField] - b[sortField]);
  if (filter && Object.keys(filter).length) {
    items = array.filter(entity => {
      for (const i in filter) {
        return entity[i] === filter[i];
      }
    });
  }
  totalCount = items.length;
  if (limit > 50) limit = 50;
  if (limit < 0) limit = 15;
  if (page < 0) page = 0;
  totalPages = totalCount / limit < 1 ? 1 : Math.ceil(totalCount / limit);
  const skip = page > 1 ? (page - 1) * limit : 0;
  hasNext = skip + limit < totalCount;
  items = items.slice(skip, limit + skip);
  return {
    pageInfo: {
      totalCount,
      totalPages,
      page,
      limit,
      hasNext
    },
    items
  };
};

export const manualPaginatorReturnsArray = <T>(
  array: T[] = [],
  filter = {},
  sort = '-createdAt',
  page = 0,
  limit = 15
): T[] => {
  if (!array || !array.length) return [];
  let sortField = sort;
  sortField = sort && sort.startsWith('-') ? sort.replace('-', '') : null;
  let items = !sort
    ? array
    : sort.startsWith('-')
    ? array.sort((a, b) => b[sortField] - a[sortField])
    : array.sort((a, b) => a[sortField] - b[sortField]);
  if (filter && Object.keys(filter).length) {
    items = array.filter(entity => {
      for (const i in filter) {
        return entity[i] === filter[i];
      }
    });
  }
  if (limit > 50) limit = 50;
  if (limit < 0) limit = 15;
  if (page < 0) page = 0;
  const skip = page > 1 ? (page - 1) * limit : 0;
  items = items.slice(skip, limit + skip);
  return items;
};
