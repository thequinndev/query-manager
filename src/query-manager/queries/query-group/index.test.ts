import { createUser, getAllUsers, getUserById, getUserNameAndDateById, userQueries } from '@examples/index'

describe('queryGroup', () => {
  it('should combine all the query items by alias', () => {
    expect(userQueries).toEqual({
        createUser: createUser,
        getAllUsers: getAllUsers,
        getUserById: getUserById,
        getUserNameAndDateById: getUserNameAndDateById,
    })
  })
})