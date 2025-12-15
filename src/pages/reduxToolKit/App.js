import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers, createUser, clearError, deleteUser } from './usersSlice'
import { useEffect } from 'react'
import { Button, List, Typography, Spin } from 'antd'

const App = () => {
  const dispatch = useDispatch()
  const { items, error, loading } = useSelector((state) => {
    return state.users
  })
  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const handleAdd = () => {
    dispatch(createUser({ name: 'zhangshan' }))
  }

  const handleDelete = (userId) => {
    dispatch(deleteUser(userId))
  }
  return (
    <Spin spinning={loading}>
      {/* 错误提示 */}
      {error && (
        <div style={{ color: 'red' }}>
          {error}
          <Button onClick={() => dispatch(clearError())}>清除</Button>
        </div>
      )}

      <Button onClick={handleAdd}>添加</Button>
      {/* 用户列表 */}
      <List
        bordered
        dataSource={items}
        renderItem={user => (
          <List.Item>
            <Typography.Text mark>{user.name + user.id}</Typography.Text>
            <Button danger ghost onClick={() => handleDelete(user.id)}>Delete</Button>
          </List.Item>
        )}
      />
    </Spin>
  )
}
export default App