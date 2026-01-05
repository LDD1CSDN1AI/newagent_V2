import React from 'react'
import styles from './hotApp.module.scss'


type Props = {
    data?: any
}

const HotApp: React.FC<Props> = (props) => {
    const { data } = props
    return (
        <div className={styles.hotApp}>
            <div className={styles.hotAppList}>
                {data?.map((item: any, index: number) => (
                    <div className={styles.hotAppItem} key={index}>
                        <div className={styles.hotAppItemTitle}>
                            <div className={styles.hotAppItemTitleImage} style={{ backgroundImage: item.image ? `url('${item.image}')` : '' }}></div>
                            <span className={styles.hotAppItemTitleText}>{item.title}</span>
                        </div>
                        <div className={styles.hotAppItemCount}>{item.count}调用</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default HotApp