import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import BaseCard from '../base/baseCard'
import GuideCard from './guideCard'
import SystemInfo from './systemInfo'
import HotApp from './hotApp'
import bannerMap from '@/public/image/bannerMap.png'
import iconBook from '@/public/image/iconBook.png'
import message from '@/public/image/message.png'
import type { OpenTypes } from '@/app/(commonLayout)/apps/component/base/createModal'
import CreateModal from '@/app/(commonLayout)/apps/component/base/createModal'
import { notification } from 'antd'
import "./allPage.scss"
import { topTen } from '@/service/newCallNum'

type Props = {
  data?: any
}

const AllPage: React.FC<Props> = () => {
  const [isAddOpen, setIsAddOpen] = useState<OpenTypes>({
    isOpen: false,
    title: '',
  })

  // useEffect(() => {
  //   (
  //     async () => {
  //       showTipInfoFun();
  //     }
  //   )()
  // }, [])

  const [topTenData, setTopTenData] = useState('');

  useEffect(() => {
    getTopTen();
  }, []);

  const getTopTen = async () => {
    const result = await topTen();
    if (result.status + '' === '400') {
      notification.warning({
        message: '提示信息',
        description:
          '请求失败，' + result.msg,
      });
      return;
    }
    if (result?.data) {
      setTopTenData(result?.data);
    }
  }

  const showTipInfoFun = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const showTipInfo = urlParams.get('showTipInfo')
    if (showTipInfo) {
      notification.warning({
        message: '提示信息',
        key: 'showTipInfoFun',
        duration: null,
        description:
          '1.维护热线：4008-011-000集团用户转1再转6。 2.平台迁移后，之前构建的智能体和工作流可能出现问题，如有问题请删除重新构建',
      });
    }
  }

  const HeaderJs = [
    {
      title: '创建智能体',
      text: '点击"创建智能体"，填写信息、选择大模型、插件等，配置完成进行调优，保存后可在个人空间查看和修改智能体',
      mode: 'agent-chat',
      name: '智能体',
      bgName: 'head-create-agent',
      imageName: 'rightGoWhite',
      styleValue: {
        content: {
          minWidth: '160px',
          maxWidth: '280px',
        },
        text: {
          fontSize: '12px',
          lineHeight: '24px',
          color: 'black',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        },
        title: {
          display: 'flex',
          flexDirection: 'row',
          color: 'black',
          paddingBottom: '8px',
          overflow: 'hidden',
        },
        titleText: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: '1',
          minWidth: 0,
        }
      }
    },
    {
      title: '创建插件',
      text: '点击"创建插件"，可通过url地址接入和代码创建(支持线上调试)2种方式构建插件，保存后可在个人空间查看和修改插件',
      mode: 'chat',
      name: '插件',
      imageName: 'rightGoWhite',
      bgName: 'head-create-plug',
      styleValue: {
        content: {
          minWidth: '160px',
          maxWidth: '280px',
        },
        text: {
          fontSize: '12px',
          lineHeight: '24px',
          color: '#333333',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        },
        title: {
          display: 'flex',
          flexDirection: 'row',
          color: '#333333',
          paddingBottom: '8px',
          overflow: 'hidden',
        },
        titleText: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: '1',
          minWidth: 0,
        }
      }
    },
    {
      title: '创建工作流',
      text: '点击"创建工作流"，在画布上通过拖拽和节点配置的方式构建工作流，支持线上对工作流进行测试，保存后可在个人空间查看和修改工作流',
      mode: 'workflow',
      name: '工作流',
      imageName: 'rightGoWhite',
      bgName: 'head-create-flow',
      styleValue: {
        content: {
          minWidth: '160px',
          maxWidth: '280px',
        },
        text: {
          fontSize: '12px',
          lineHeight: '24px',
          color: '#333333',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        },
        title: {
          display: 'flex',
          flexDirection: 'row',
          color: '#333333',
          paddingBottom: '8px',
          overflow: 'hidden',
        },
        titleText: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: '1',
          minWidth: 0,
        }
      }
    },
  ]
  const GuideCardJs = [
    {
      title: "新手引导-创建1",
      bgName: "guideCardBg1",
    },
    {
      title: "新手引导-创建2",
      bgName: "guideCardBg2",
    },
    {
      title: "新手引导-创建3",
      bgName: "guideCardBg3",
    },
    {
      title: "新手引导-创建4",
      bgName: "guideCardBg4",
    },
  ]
  const HotAppJs = [
    {
      title: topTenData?.[0]?.name,
      bgName: "hotAppBg1",
      count: topTenData?.[0]?.count,
      image: '/agent-platform-web/bg/hotAppTip1.png',
    },
    {
      title: topTenData?.[1]?.name,
      bgName: "hotAppBg2",
      count: topTenData?.[1]?.count,
      image: '/agent-platform-web/bg/hotAppTip2.png',
    },
    {
      title: topTenData?.[2]?.name,
      bgName: "hotAppBg3",
      count: topTenData?.[2]?.count,
      image: '/agent-platform-web/bg/hotAppTip3.png',
    },
    {
      title: topTenData?.[3]?.name,
      bgName: "hotAppBg4",
      count: topTenData?.[3]?.count,
      image: '/agent-platform-web/bg/hotAppTip4.png',
    },
  ]
  return (
    <div className="scrollContainer" style={{ padding: '24px', height: '100vh', overflow: 'auto' }}>
      <div className='flex h-[200px] w-[100%]]' style={{
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        backgroundImage: 'url(\'/agent-platform-web/bg/allBanner.png\')',
        flexDirection: 'column',
        position: 'relative',
      }}>
        {/* <div className='message-content'>
          <div style={{ width: '64px', height: '100%' }}>
            <Image src={message} alt='img' style={{ position: 'relative', right: '-32px', top: '2px' }} />
          </div>
          <div className="marquee">
            <div className="marquee-content">
              平台功能全新升级：1.对话流功能上线项目空间，支持成员协同操作；2.新增变量赋值新节点；3.大模型、代码、API等节点上线失败重试、异常处理功能；3.Agent编辑页面上线测试日志追踪功能；4.优化项目空间成员身份，管理员身份具备项目空间管理权限。            </div>
          </div>
          <div style={{ width: '64px', height: '100%' }}>
          </div>
        </div> */}

        {/* <Image src={bannerMap} alt='img' style={{
          position: 'absolute',
          color: 'transparent',
          transformOrigin: 'top right',
          right: 0,
          top: 0,
          transform: 'scale(1.5)',
          zIndex: 1,
        }} /> */}
        <div style={{ marginLeft: '50px' }}>
          <p className='text-[#282829] text-[40px] mt-[50px] font-bold' style={{ fontWeight: '900' }}>智能体研发平台</p>
          <p className='text-[#27292B] text-[20px]  font-medium' style={{ fontWeight: '500', color: '#0F3D6F' }}>提供全套工具和能力，开发者可根据自己的需求快速搭建智能体</p>
        </div>

      </div>
      <div className='flex' style={{ marginTop: '24px', zIndex: 2, gap: '24px', flexWrap: 'wrap' }}>{HeaderJs?.map((item, index) => (<BaseCard onOpen={({ params }) => {
        setIsAddOpen({
          ...params,
        })
      }} data={item} key={index} />))}</div>

      <div className='flex' style={{ justifyContent: 'space-between', gap: '24px' }}>
        <div style={{ width: 'calc(67% - 12px)' }}>
          <div className='text-[20px] mb-[18px] text-[#1C2748] font-bold'>新手引导</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between' }}>
            {GuideCardJs?.map((item, index) => (<GuideCard key={index} {...item} />))}
          </div>
        </div>
        <div style={{ width: 'calc(33% - 12px)' }}>
          <div className='text-[20px] mb-[18px] text-[#1C2748] font-bold'>热门应用</div>
          <HotApp data={HotAppJs} />
          <div className='text-[20px] mb-[12px] text-[#1C2748] font-bold mt-[12px]'>系统公告</div>
          <SystemInfo />

        </div>
      </div>
      {isAddOpen.isOpen ? <CreateModal isAddOpen={isAddOpen} onClose={(val: boolean) => setIsAddOpen({ ...isAddOpen, isOpen: val })} /> : null}
    </div>
  )
}

export default AllPage
