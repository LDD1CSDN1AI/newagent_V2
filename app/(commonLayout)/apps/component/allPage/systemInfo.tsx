import React from 'react'
import styles from './systemInfo.module.scss'

type Props = {
    version?: string
    title?: string
    date?: string
    content?: string[]
    onClick?: () => void
}

const SystemInfo: React.FC<Props> = (props) => {
    const {
        version = 'V1.2.3',
        title = '更新公告',
        date = '2025-11-26',
        content = [
            '对话流功能上线项目空间，支持成员协同操作',
            '新增变量赋值新节点；3.大模型、代码、API等节点上线失败重试、异常处理功能',
            'Agent编辑页面上线测试日志追踪功能',
            '优化项目空间成员身份，管理员身份具备项目空间管理权限。'
        ],
        onClick
    } = props

    const bgUrl = `url('/agent-platform-web/bg/systemInfoCardBg.png')`

    return (
        <div className={styles.systemInfoCard} style={{ backgroundImage: bgUrl, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }} onClick={onClick}>
            <div className={styles.cardContent}>
                <div className={styles.leftContent}>
                    <div className={styles.cardHeader}>
                        <div className={styles.headerLeft}>
                            <span className={styles.version}>{version}</span>
                            <span className={styles.title}>{title}</span>
                        </div>
                        <span className={styles.date}>{date}</span>
                    </div>
                    <div className={styles.contentList}>
                        {content.map((item, index) => (
                            <div key={index} className={styles.contentItem}>
                                <span className={styles.bullet}></span>
                                <span className={styles.contentText}>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SystemInfo

