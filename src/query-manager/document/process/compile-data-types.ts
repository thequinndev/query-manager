import { z } from "zod";
import { BaseCollapsedQueryItem } from "../../queries";
import { collectParameters } from "../../utility/parameter-strategy";
import { processProperties } from "./properties";

export const compileDataTypes = (item: BaseCollapsedQueryItem) => {
  const params = collectParameters(item);

  const dataTypeSections: string[] = [];
  let index = 0;
  for (const param of item.parameters?.original ?? []) {
    const firstKey = Object.keys(param)[0];
    const schema = param[firstKey] as z.ZodAny;
    const props = processProperties(schema);

    const paramSection = params[index] ? `${params[index]} => ` : "";
    dataTypeSections.push(`* ${paramSection}${firstKey}${props.join("\n")}`);
    index++;
  }

  if (!dataTypeSections.length) {
    return null;
  }

  return dataTypeSections.join("\n");
};
