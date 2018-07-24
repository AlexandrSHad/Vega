
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace vega.Extensions
{
    public static class IQueryableExtensions
    {
        public static IQueryable<TSource> ApplyOrdering<TSource, TKey>(this IQueryable<TSource> query, IQueryObject queryObject, Dictionary<string, Expression<Func<TSource, TKey>>> columnsMap)
        {
            if (string.IsNullOrWhiteSpace(queryObject.SortBy) || !columnsMap.ContainsKey(queryObject.SortBy)) 
                return query;

            if (queryObject.IsSortAscending)
                return query.OrderBy(columnsMap[queryObject.SortBy]);
            else
                return query.OrderByDescending(columnsMap[queryObject.SortBy]);
        }

        public static IQueryable<TSource> ApplyPaging<TSource>(this IQueryable<TSource> query, IQueryObject queryObject)
        {
            if (queryObject.Page <= 0)
                queryObject.Page = 1;
            
            if (queryObject.PageSize <= 0)
                queryObject.PageSize = 10;
            
            return query.Skip((queryObject.Page - 1) * queryObject.PageSize).Take(queryObject.PageSize);
        }
    }
}
