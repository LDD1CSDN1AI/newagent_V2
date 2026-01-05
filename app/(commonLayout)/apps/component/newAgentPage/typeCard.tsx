import React, { useState } from 'react'
import cn from 'classnames'
import { useRouter } from 'next/navigation'
import { Button, Flex, Input, Select, Modal, Space, Tooltip, type MenuProps } from 'antd'
import styles from '../base/baseStyle.module.scss'
import type { App } from '@/types/app'
import { useAppContext } from '@/context/app-context'
import Image from 'next/image'
import './index.scss'
import user from '@/app/(commonLayout)/apps/assets/user.png';
import { copyCard } from '../common'
import { getRedirection } from '@/utils/app-redirection'
import { CopyOutlined, EnvironmentOutlined, EyeFilled, StarOutlined } from '@ant-design/icons'
import Calendar from '@/app/components/base/date-and-time-picker/calendar'
import { RiCalendarLine } from '@remixicon/react'
import { ThumbsUp } from '@/app/components/base/icons/src/vender/line/alertsAndFeedback'


type Props = {
  headerImg?: string
  data?: App | any
  plugin?: any
  className?: string
  styleCss?: React.CSSProperties
  indexValue?: number
  tenant_id?: any
  toHanleOpeartion?: any
  getDetailContent?: any
  radioValue?: any
  tenants?: any
}

// 智能体类型卡片
const TypeCard: React.FC<Props> = (props) => {
  const { data, plugin, className, styleCss, headerImg, indexValue, toHanleOpeartion, getDetailContent, tenant_id, radioValue, tenants } = props
  const { isCurrentWorkspaceEditor } = useAppContext()
  const { push } = useRouter()
  const [isModalCopyOpen, setIsModalCopyOpen] = useState(false)
  const [newName, setNewName] = useState(data?.name || '');
  const [copyTenantId, setCopyTenantId] = useState(data?.tenant_id || '');

  const cancelCopy = () => {
    setNewName('')
    setIsModalCopyOpen(false)
  }

  const colorArray = [
    '#ffbf71', '#216eff', '#216eff', '#9866fd', '#56d892', '#33c9f4', '#216eff'
  ];

  const workflow = async (e?: any, appId?: any) => {
    const name = newName || (data?.name)

    getRedirection(isCurrentWorkspaceEditor, {
      ...data,
      tenant_id: tenant_id,
      fromType: '个人空间',
      status: data?.status ?? plugin?.status,
      tabClick: 'agent-chat',
      category: 'area',
      name: name,
      id: appId || data?.id,
      appId: appId || (data?.id ?? plugin?.id)
    }, push, tenant_id)
  }

  return (
    <div
      className={cn('w-full h-fit bg-white border border-[#E0E6EC] relative rounded-[6px] p-[20px] flex flex-col', styles.hoverCss, className)}
    >
      {/* 顶部图标区域 */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            marginBottom: '20px'
          }}
        >
          <img
            style={{ width: '100%', height: '100%' }}
            src={`/agent-platform-web/image/head_agent_new_${((indexValue || 0) % 4) + 1}.png`}
            alt="agent icon"
          />
        </div>
      </div>

      {/* 标题 */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <div
          style={{
            fontWeight: '500',
            fontSize: '14px',
            color: '#333',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%'
          }}
          title={data?.name}
        >
          {data?.name}
        </div>
      </div>

      {/* 描述文本 */}
      <Tooltip title={data?.description || ''}>
        <div
          className='only-show-two'
          style={{
            fontSize: '14px',
            color: '#555',
            lineHeight: '22px',
            marginBottom: '20px',
            textAlign: 'center',
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}
        >
          {data?.description}
        </div>
      </Tooltip>

      {/* 按钮区域 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'space-between' }}>
        <Button
          style={{ border: '1px solid #E6E7EB', backgroundColor: '#fff', color: '#666666', borderRadius: '2px', flex: 1, height: '34px' }}
          size='small'
          onClick={(e) => {
            e.stopPropagation()
            getDetailContent(data)
          }}
        >
          查看详情
        </Button>
        <Button
          style={{ border: '1px solid #E6E7EB', backgroundColor: '#fff', color: '#666666', borderRadius: '2px', flex: 1, height: '34px' }}
          size='small'
          onClick={(e) => {
            e.stopPropagation()
            toHanleOpeartion(data?.id, 1, 'experience_count')
          }}
        >
          立即体验
        </Button>
        {/* <Button
          style={{ border: '1px solid #E6E7EB', backgroundColor: '#fff', color: '#666666', borderRadius: '2px', flex: 1, height: '34px' }}
          size='small'
          onClick={(e) => {
            e.stopPropagation()
            setIsModalCopyOpen(true)
          }}
        >
          复制
        </Button> */}
      </div>

      {/* 底部元数据 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#999999', borderTop: '1px solid #E6E7EB', paddingTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <EnvironmentOutlined style={{ fontSize: '14px' }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
            {data?.location || ''}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>{data?.created_at}</span>
        </div>
      </div>

      <Modal
        className={styles.modalGlobal}
        title={`Agent复制`}
        open={isModalCopyOpen}
        onOk={() => copyCard({
          name: newName,
          tenant_id: copyTenantId || '',
          icon: '',
          icon_background: '',
          mode: radioValue === 'workflow' ? 'workflow' : 'agent',
          app_id: (data?.id ?? plugin?.id) || '',
          fromType: '个人空间',
          callback: (id) => { workflow(null, id); cancelCopy() }
        })}
        onCancel={() => cancelCopy()}
        okText='确定'
        cancelText='取消'
      >
        <div style={{ margin: '4px 0' }}>
          空间：<Select
            placeholder='请选择发布空间'
            allowClear
            fieldNames={{
              label: 'name',
              value: 'id'
            }}
            options={tenants}
            value={data?.tenant_id}
            style={{ width: '100%' }}
            onChange={(id: any) => setCopyTenantId(id)}
          />
        </div>
        <div style={{ margin: '4px 0' }}>
          新命名：<Input key={data?.name} defaultValue={data?.name} onChange={(e) => setNewName(e.target.value)} />
        </div>
      </Modal >
    </div >
  )
}

export default TypeCard
