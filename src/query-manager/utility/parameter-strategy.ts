import { BaseCollapsedQueryItem, ParameterStrategy } from "../queries"

export  const inferParameterStrategy = (queryString: string): ParameterStrategy => {
    if (queryString.includes('?')) {
      return ParameterStrategy.QuestionMark
    }

    if (queryString.includes('$')) {
      return ParameterStrategy.Dollar
    }

    if (queryString.includes(':')) {
      return ParameterStrategy.Colon
    }

    if (queryString.includes('&')) {
      return ParameterStrategy.Ampersand
    }

    return ParameterStrategy.KeyValue
}

export const collectParameters = (queryItem: BaseCollapsedQueryItem): string[] => {

    const paramaterStrategy = inferParameterStrategy(queryItem.query)

    if (paramaterStrategy === ParameterStrategy.Dollar) {
      return queryItem.query.match(/\$[0-9]+/g) ?? []
    }

    if (paramaterStrategy === ParameterStrategy.Colon) {
        return queryItem.query.match(/\:[a-zA-Z]+/g) ?? []
    }

    return []
}