import { useNavigate } from 'react-router-dom'
import styles from './NotFound.module.less'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className={styles['not-found']}>
      <div className={styles.content}>
        <div className={styles.numbers}>
          <div className={styles.number}>404</div>
        </div>
        <div className={styles.message}>
          <h2>抱歉，我们找不到该页面！</h2>
          <p>您要查找的页面已被移动、删除、重命名或不存在</p>
        </div>
        <button 
          className={styles['back-button']}
          onClick={() => navigate('/home')}
        >
          返回首页
        </button>
      </div>
      <div className={styles.clouds}></div>
    </div>
  )
}

export default NotFound 