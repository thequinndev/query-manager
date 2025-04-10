import { BaseCollapsedQueryItem, ParameterStrategy } from "../queries";

export const inferParameterStrategy = (
  queryString: string,
): ParameterStrategy => {
  if (queryString.includes("?")) {
    return ParameterStrategy.QuestionMark;
  }

  if (queryString.includes("$")) {
    return ParameterStrategy.Dollar;
  }

  if (queryString.includes("&")) {
    return ParameterStrategy.Ampersand;
  }

  if (queryString.includes(":")) {
    return ParameterStrategy.Colon;
  }

  return ParameterStrategy.KeyValue;
};

export const collectParameters = (
  queryItem: BaseCollapsedQueryItem,
): string[] => {
  const parameterStrategy = inferParameterStrategy(queryItem.query);

  if (parameterStrategy === ParameterStrategy.Dollar) {
    return queryItem.query.match(/\$[0-9]+/g) ?? [];
  }

  if (parameterStrategy === ParameterStrategy.Colon) {
    const params = [];
    for (const paramKey in queryItem.parameters?.collapsed ?? {}) {
      const searchParam = `:${paramKey}`;
      if (queryItem.query.includes(searchParam)) {
        params.push(searchParam);
      }
    }

    return params;
  }

  if (parameterStrategy === ParameterStrategy.Ampersand) {
    const params = [];
    for (const paramKey in queryItem.parameters?.collapsed ?? {}) {
      const searchParam = `&${paramKey}`;
      if (queryItem.query.includes(searchParam)) {
        params.push(searchParam);
      }
    }

    return params;
  }

  if (parameterStrategy === ParameterStrategy.QuestionMark) {
    return queryItem.query.match(/\?/g) ?? [];
  }

  return [];
};
