import { tableSchemas } from '@examples/index'
import { queryParameter } from '.'

describe('queryParameter', () => {
    it('should convert the parameter name and schema to a valid parameter item', () => {
        const paramTest = queryParameter('test', tableSchemas.userTableSchema.shape.id)
        expect(paramTest).toEqual({
            test: tableSchemas.userTableSchema.shape.id
        })
    })
})