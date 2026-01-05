import React, { useEffect, useState } from 'react'
import { Button, Space, Tabs, Input } from 'antd'
// import cn from 'classnames'
// import { usePathname } from 'next/navigation'
import useSwr from 'swr'
// import {
//   RiAddBoxLine,
// } from '@remixicon/react'
import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import UserCard from '../base/userCard'
import AddArea from './addArea'
import type { AppListResponse } from '@/models/app'
import type { PluginProvider } from '@/models/common'
import { getTenants } from '@/service/common'
import type { OpenTypes } from '@/app/(commonLayout)/apps/component/base/createModal'
import CreateModal from '@/app/(commonLayout)/apps/component/base/createModal'
import CreateFromDSLModal from '@/app/components/app/create-from-dsl-modal'
import GlobalUrl from '@/GlobalUrl'
import bgImage from "@/app/(commonLayout)/apps/assets/bg@2x.png";
import styles from './index.module.scss';
type Props = {
  data?: AppListResponse | undefined
  plugins?: PluginProvider[] | undefined
  mutate?: () => void
  pluginsMutate?: () => void
  setActiveTab?: (newActiveTab: string) => void
  setCallback?: any
}

type AreaNameListItem = {
  id: string
  name: string
  status: string
  created_at: string
  current: boolean
}

type areaNameItem = {
  key: string
  name: string
}

const AreaPage: React.FC<Props> = (props) => {
  const { data, plugins, setActiveTab, mutate, pluginsMutate, setCallback } = props
  const [openModal, setOpenModal] = useState<boolean>(false)
  // const pathName = usePathname()
  const [activeArea, setActiveArea] = useState<any>('')
  const [tabClick, setTabClick] = useState<string>('1')
  const [showCreateFromDSLModal, setShowCreateFromDSLModal] = useState(false)

  const [isAddOpen, setIsAddOpen] = useState<OpenTypes>({
    isOpen: false,
    title: '',
  })
  const [header_image, setHeaderImage] = useState('agent')
  const [areaName, setAreaName] = useState<Array<areaNameItem>>([])

  const { data: tenants, mutate: tenantsMutate }: any = useSwr('/getTenants', getTenants)
  useEffect(() => {
    if (tenants) {
      const newArr: any = []
      const defaultSpace = tenants?.find((item: any) => item.current === true)
      setActiveArea(defaultSpace.id)
      setCallback(defaultSpace.id)
      tenants.forEach((item: AreaNameListItem, index: any) => {
        newArr.push({ key: item.id, name: item.name })
      })
      setAreaName(newArr)
    }
  }, [tenants])

  const getTabName = () => {
    switch (tabClick) {
      case '1':
        return { name: 'Agent', mode: 'agent-chat', upload: '导入' };
      case '2':
        return { name: '插件', mode: 'chat' };
      case '3':
        return { name: '工作流', mode: 'workflow' };
      case '4':
        return { name: '智能体', mode: 'metabolic' };
      case '5':
        return { name: '对话流', mode: 'advanced-chat' };
      default:
        return { name: '' };
    }
  }

  // const areaName = [
  //   {
  //     key: 1,
  //     name: '默认空间',
  //   },
  //   {
  //     key: 2,
  //     name: '项目空间1',
  //   },
  //   {
  //     key: 3,
  //     name: '项目空间2',
  //   },
  //   {
  //     key: 4,
  //     name: '项目空间4',
  //   },
  // ]
  const operations = () => {
    return (
      <>
        <Input
          placeholder="搜索个人应用名称"
          allowClear
          // onChange={(e) => onNameSelectChange(e.target.value)}
          style={{ width: 250, height: 32, marginRight: 12, borderRadius: '2px' }}
          suffix={<SearchOutlined />}
        />
        <Button className="btn-primary" style={{ borderRadius: '2px', height: '32px', background: '#fff', color: '#216EFF' }} onClick={() => {
          const mode = getTabName().mode;
          setIsAddOpen({
            isOpen: true,
            title: `创建${getTabName().name}`,
            titleName: `${getTabName().name}`,
            mode,
          })
          const headerImg = tabClick === '1' ? 'agent' : tabClick === '2' ? 'chat' : tabClick === '3' ? 'workflow' : 'metabolic'
          setHeaderImage(headerImg)
        }}>
          <CloseCircleOutlined style={{ transform: 'rotate(45deg)' }} />
          {`创建${getTabName().name}`}
        </Button>
      </>)
  }
  //   width: 88px;
  // height: 24px;
  // font-family: PingFangSC, PingFang SC;
  // font-weight: 500;
  // font-size: 18px;
  // color: #216EFF;
  // line-height: 25px;
  // text-align: right;
  // font-style: normal;

  const fromType = '个人空间';
  const items = [
    {
      label: 'Agent',
      key: '1',
      children: <div className={`flex-1 w-[100%] overflow-y-auto ${styles.scrollContainer}`} style={{ height: 'calc(100vh - 268px)' }}>
        <div className={`${styles.cardGrid} ${styles.scrollContainer}`}>
          {/* {data?.data && data?.data?.length <= 0 ? <div style={{ width: '100%', height: '360px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{`点击右上方,创建${getTabName().name},创建新的${getTabName().name}`}</div> : data?.data?.filter(i => i.mode === 'agent-chat' && tabClick === '1').map((item, index) => ( */}
          {data?.data && data?.data?.length <= 0 ? <div style={{ width: '100%', height: '360px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div> : data?.data?.filter(i => i.mode === 'agent-chat' && tabClick === '1').map((item, index) => (

            <UserCard
              headerImag='header_agent1'
              mutate={mutate}
              key={index}
              fromType={fromType}
              data={item}
              areaList={areaName}
              tabClick={tabClick}
              activeArea={activeArea}
              currentTab='agent'
            // styleCss={{ backgroundImage: 'url(\'/agent-platform-web/bg/agentBg1.png\')' }}
            />
          ))}
        </div>
      </div>,
    },
    {
      label: '插件',
      key: '2',
      children: <div className={`flex-1 w-[100%] overflow-y-auto  ${styles.scrollContainer}`} style={{ height: 'calc(100vh - 268px)' }}>
        <div className={`${styles.cardGrid}  ${styles.scrollContainer}`}>
          {/* {plugins && plugins?.length <= 0 ? <div style={{ width: '100%', height: '360px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{`点击右上方,创建${getTabName().name},创建新的${getTabName().name}`}</div> : plugins?.map((item, index) => ( */}
          {plugins && plugins?.length <= 0 ? <div style={{ width: '100%', height: '360px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div> : plugins?.map((item, index) => (

            <UserCard
              headerImag='header_chat1'
              mutate={pluginsMutate}
              key={index}
              plugin={item}
              areaList={areaName}
              fromType={fromType}
              tabClick={tabClick}
              activeArea={activeArea}
              currentTab='chat'
            // styleCss={{ backgroundImage: 'url(\'/agent-platform-web/bg/agentBg2.png\')' }}
            />),
          )}
        </div>
      </div>,
    },
    {
      label: '工作流',
      key: '3',
      children: <div className={`flex-1 w-[100%] overflow-y-auto ${styles.scrollContainer}`} style={{ height: 'calc(100vh - 268px)' }}>
        <div className={`${styles.cardGrid}  ${styles.scrollContainer}`}>
          {/* {data?.data && data?.data?.length <= 0 ? <div style={{ width: '100%', height: '360px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{`点击右上方,创建${getTabName().name},创建新的${getTabName().name}`}</div> : data?.data?.filter(i => i.mode === 'workflow' && tabClick === '3').map((item, index) => ( */}
          {data?.data && data?.data?.length <= 0 ? <div style={{ width: '100%', height: '360px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div> : data?.data?.filter(i => i.mode === 'workflow' && tabClick === '3').map((item, index) => (

            <UserCard
              headerImag='header_workflow1'
              mutate={mutate}
              key={index}
              data={item}
              areaList={areaName}
              fromType={fromType}
              tabClick={tabClick}
              activeArea={activeArea}
              currentTab='workflow'
            // styleCss={{ backgroundImage: 'url(\'/agent-platform-web/bg/agentBg3.png\')' }}
            />
          ))}
        </div>
      </div>,
    },
    // {
    //   label: '智能体',
    //   key: '4',
    //   children: <div className='flex-1 w-[100%] overflow-y-auto' style={{ height: 'calc(100vh - 268px)' }}>
    //     <div className='flex flex-1 flex-wrap overflow-hidden overflow-y-auto  gap-[1.45vw]'>
    //       {data?.data && data?.data?.length <= 100 ? <div style={{ width: '100%', height: '360px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{`点击右上方,创建${getTabName().name},创建新的${getTabName().name}`}</div> : data?.data?..filter(i => i.mode === 'metabolic' && tabClick === '4').map((item, index) => (
    //         <UserCard
    //           headerImag='header_agent1'//UI未出图，暂用agent
    //           mutate={mutate}
    //           key={index}
    //           data={item}
    //           fromType={fromType}
    //           areaList={areaName}
    //           tabClick={tabClick}
    //           activeArea={activeArea}
    //           currentTab='metabolic'
    //         // styleCss={{ backgroundImage: 'url(\'/agent-platform-web/bg/agentBg3.png\')' }}
    //         />
    //       ))}
    //     </div>
    //   </div>,
    // },
    {
      label: '对话流',
      key: '5',
      children: <div className={`flex-1 w-[100%] overflow-y-auto  ${styles.scrollContainer}`} style={{ height: 'calc(100vh - 268px)' }}>
        <div className={`${styles.cardGrid} ${styles.scrollContainer}`}>
          {/* {data?.data && data?.data?.filter(i => i.mode === 'advanced-chat' && tabClick === '5').length <= 0 ? <div style={{ width: '100%', height: '360px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{`点击右上方,创建${getTabName().name},创建新的${getTabName().name}`}</div> : data?.data?.filter(i => i.mode === 'advanced-chat' && tabClick === '5').map((item, index) => ( */}
          {data?.data && data?.data?.filter(i => i.mode === 'advanced-chat' && tabClick === '5').length <= 0 ? <div style={{ width: '100%', height: '360px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div> : data?.data?.filter(i => i.mode === 'advanced-chat' && tabClick === '5').map((item, index) => (

            <UserCard
              headerImag='header_workflow1'//UI未出图，暂用agent
              mutate={mutate}
              key={index}
              data={item}
              fromType={fromType}
              areaList={areaName}
              tabClick={tabClick}
              activeArea={activeArea}
              currentTab='workflow'
            // styleCss={{ backgroundImage: 'url(\'/agent-platform-web/bg/agentBg3.png\')' }}
            />
          ))}
        </div>
      </div>,
    }
  ]
  return (
    <>
      <div className=''>
        <div className='flex' style={{ justifyContent: 'space-between', fontWeight: '700', backgroundColor: 'white', padding: '16px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
          <div className='text-[#1C2748] text-[20px]'>个人空间</div>
          <div className={styles.publishManage} style={{ fontWeight: 400, fontSize: '14px', color: '#464646', lineHeight: '22px', padding: '3px 25px', borderRadius: '2px' }} onClick={() => { setActiveTab?.('release') }}>发布管理</div>
        </div>
        {/* <div className='flex justify-between py-[17px] px-[28px] bg-[#fff] mb-[18px] rounded-[8px]'>
          <div className='flex'>
            {tenants?.map((item: any) => (
              <div key={item.id}
                className={cn('my-auto py-[6px] px-[20px] mr-[24px] border rounded-[4px] cursor-pointer',
                  activeArea === item.id
                    ? 'border-[#216EFF] bg-[rgba(33,110,255,0.1)] text-[#216EFF]'
                    : 'border-[#BBBDC0] text-[#BBBDC0]',
                )}
                onClick={() => {
                  setActiveArea(item.id)
                  setCallback(item.id)
                }}>
                {item.name}
              </div>
            ))}
          </div> */}
        {/* <Space>
            <Image src={setEdit} alt='img' width={30} className='mr-[10px] h-[30px] my-auto cursor-pointer' onClick={() => {
              history.pushState(null, '', `${pathName}?category=detail`)
              setActiveTab?.('detail')
            }} />
            <Image src={add} alt='img' width={30} className='h-[30px] my-auto cursor-pointer' onClick={() => setOpenModal(true)} />
          </Space> */}
        {/* </div> */}

        <div className='rounded-[6px] px-[24px]'
          style={{
            height: 'calc(100vh - 138px)', backgroundImage: `url(${bgImage.src})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              {
                items.map(item => <Button
                  className={styles.tabButton}
                  style={{
                    borderRadius: '0px',
                    marginRight: '12px',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    color: item.key === tabClick ? '#1677ff' : '',
                    borderBottom: item.key === tabClick ? '2px solid #1677ff' : '1px solid rgb(217, 217, 217)',
                  }}
                  onClick={() => setTabClick(item.key)}
                >
                  {item.label}
                </Button>)
              }
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              {operations()}
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            {
              items.filter(item => item.key === tabClick)[0].children
            }
          </div>
          {/* <Tabs tabBarExtraContent={operations()} items={items} onChange={(val) => { setTabClick(val) }} /> */}
        </div>
      </div >
      <CreateFromDSLModal
        tenant_id={activeArea}
        fromType='个人空间'
        tabClick={tabClick}
        show={showCreateFromDSLModal}
        onClose={() => setShowCreateFromDSLModal(false)}
        onSuccess={() => mutate?.()}
      />
      <AddArea modalState={openModal} onClose={(val: boolean) => setOpenModal(val)} />
      {
        isAddOpen.isOpen
          ? <CreateModal fromType='个人空间' tabClick={tabClick} categoryTenants={true} tenant_id={activeArea} isAddOpen={isAddOpen} onClose={(val: boolean) => setIsAddOpen({ ...isAddOpen, isOpen: val })} />
          : null
      }
    </>
  )
}

export default AreaPage
