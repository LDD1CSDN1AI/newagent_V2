import React from 'react'
import { Button } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';

type Props = {
  list?: Array<{ label: string; key: string; value: string }>
  active?: string | number
  size?: SizeType
  setActive?: (key: string) => void
}

const RadioButton: React.FC<Props> = (props) => {

  const { list = [], active, size = 'middle', setActive } = props
  const handleSetActive = (key: string) => {
    setActive?.(key)
  }

  return (
    <div style={{ width: '290px', height: '36px', lineHeight: '36px', backgroundColor: '#F3F5F9', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderRadius: '4px' }}>
      {
        list.map(item => <Button
          key={item.key}
          size={size}
          style={{
            width: '88px',
            height: '26px',
            lineHeight: '26px',
            textAlign: 'center',
            color: item.key === active ? '#3470f6' : '#464646',
            background: item.key === active ? '#FFFFFF' : 'none',
            border: 'none'
          }}
          onClick={() => handleSetActive(item.key)}>{item.label}
        </Button>)
      }
    </div>
  )
}

export default RadioButton;