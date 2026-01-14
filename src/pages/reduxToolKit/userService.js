const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
export const fetchUsersApi = async () => {
  await delay(500)
  return [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ]
}

export const createUserApi = async (userData) => {
  await delay(300)
  return { 
    id: Date.now(),
    ...userData
   }
}

export const deleteUserApi = async () => {
  await delay(200)
}