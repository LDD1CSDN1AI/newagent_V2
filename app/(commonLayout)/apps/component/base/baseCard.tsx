import React from 'react'
import cn from 'classnames'
import Image from 'next/image'
import styles from './baseStyle.module.scss'
import iconBook from '@/public/image/circleIcon.png'
import rightGo from '@/public/image/rightGo.png'
import rightGoWhite from '@/public/bg/pageall_right.png'

type Props = {
  data?: any
  onOpen?: (val: any) => void

}

// 首页基础卡片
const baseCard: React.FC<Props> = (props) => {
  const { data, onOpen } = props
  const { styleValue, imageName } = data || {}
  let bgUrl = ''
  if (data.mode) {
    const bgName = data.mode === 'agent-chat' ? 'agent_card_bg' : (data.mode === 'chat' ? 'chat_card-bg' : 'workflow_card_bg')
    bgUrl = `url(/agent-platform-web/image/${bgName}.png)`
  } else {
    bgUrl = 'url(\'/agent-platform-web/bg/allBg.png\')'
  }
  if (data.bgName) {
    bgUrl = `url(\'/agent-platform-web/bg/${data.bgName}.png\')`;
  }

  return (
    <div className={cn('flex w-full mb-[18px] hoverCss', styles.hoverCss)} style={{
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
      backgroundColor: '#F4F4F8',
      paddingBottom: '20px',
      alignItems: 'center',
      height: '140px',
      // overflow: 'hidden',
      boxSizing: 'border-box',
      padding: '8px 29px',
      flex: 1,
      justifyContent: 'space-between',
      borderRadius: '6px',
    }} onClick={() => {
      onOpen?.({
        params: {
          isOpen: true,
          title: `${data.title}`,
          mode: `${data.mode}`,
          titleName: `${data.name}`,
        },
      })
    }}>
      <div style={styleValue && styleValue.content ? { ...styleValue.content } : { height: '140px', overflow: 'hidden' }} className='mx-auto mr-[9px] ml-[8px] pt-[20px]'>
        <div className='flex'>
          <div style={styleValue && styleValue.title ? { ...styleValue.title } : {}} className='text-[#216EFF] text-[18px] font-bold'>
            <span style={styleValue && styleValue.titleText ? { ...styleValue.titleText } : {}}>{data?.title}</span>
            <Image src={rightGoWhite}
              alt='img'
              style={{ width: '18px', height: '18px', marginTop: '5px' }}
              className='ml-[16px]'
            />
          </div>
        </div>
        <div style={styleValue && styleValue.text ? { ...styleValue.text } : {}} className={styleValue && styleValue.text ? '' : 'text-[16px] text-[#1C2748]'}>{data?.text}</div>
      </div>
      <div style={{ width: '120px', height: '120px', minWidth: '120px', maxWidth: '120px', minHeight: '120px', maxHeight: '120px', backgroundImage: bgUrl }}></div>
    </div>
  )
}

export default baseCard
