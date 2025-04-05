import { z } from "zod"
import zodToJsonSchema from "zod-to-json-schema"

export const processProperties = (schema: z.ZodAny): string[] => {
    const props: string[] = []
    const jsonSchema = zodToJsonSchema(schema) as any
    const dataType = jsonSchema.type ?? null
    if (dataType) {
        props.push(`\n\t* type: ${dataType}`)
    }
    const min = jsonSchema.minLength ?? jsonSchema.minimum ?? null
    if (min) {
        props.push(`\n\t* min: ${min}`)
    }
    const max = jsonSchema.maxLength ?? jsonSchema.maximum ?? null
    if (max) {
        props.push(`\n\t* max: ${max}`)
    }

    return props
}