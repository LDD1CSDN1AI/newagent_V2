import React from 'react'
import styles from './guideCard.module.scss'

type Props = {
    title?: string
    subtitle?: string
    bgName?: string
    onClick?: () => void
}

const GuideCard: React.FC<Props> = (props) => {
    const { bgName, title = '新手引导-创建', subtitle, onClick } = props
    const bgUrl = bgName ? `url('/agent-platform-web/bg/${bgName}.png')` : ''
    return (
        <div className={styles.guideCard} onClick={onClick}>
            <div className={styles.cardBackground} style={{ backgroundImage: bgUrl }}>
            </div>

            {/* 底部文字 */}
            <div className={styles.cardFooter}>
                <span className={styles.cardTitle}>{title}</span>
                {subtitle && <span className={styles.cardSubtitle}>{subtitle}</span>}
            </div>
        </div>
    )
}

export default GuideCard

