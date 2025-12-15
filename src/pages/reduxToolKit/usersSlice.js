
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchUsersApi, createUserApi, deleteUserApi } from './userService'
// 🌟 异步 Thunk：获取用户列表
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUsersApi()
      return response // 返回数据（fulfilled payload）
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch users')
    }
  }
)

// 🌟 异步 Thunk：创建用户
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const newUser = await createUserApi(userData)
      return newUser
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create user')
    }
  }
)

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async(userId, { rejectWithValue }) => {
    try {
      const newUser = await deleteUserApi(userId)
      return userId
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create user')
    }
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // 同步 reducer （如重置错误）
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
    .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
    .addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
    // 处理 createUser
    .addCase(createUser.pending, (state) => {
      state.loading = true
    })
    .addCase(createUser.fulfilled, (state, action) => {
      state.loading = false
      state.items.push(action.payload)
    })
    .addCase(createUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    }) 
    // 处理deleteUser
    .addCase(deleteUser.pending, (state) => {
      state.loading = true
    })
    .addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false
      state.items = state.items.filter(user => user.id !== action.payload)
    })
    .addCase(deleteUser.rejected, (state, action) => {
      state.loading = false
    }) 
  }
})

export const { clearError } = usersSlice.actions
export default usersSlice.reducer