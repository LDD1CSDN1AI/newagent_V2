import React, { useEffect, useState } from 'react'
import { Card, Button, Pagination, message, Input, Segmented } from 'antd';
import type { PaginationProps } from 'antd'
import Icon, { SearchOutlined, EyeOutlined } from '@ant-design/icons'
import RadioButton from './radioButton'
import CardItem from './cardItem'
import s from './style.module.css'
import * as API from '@/service/newChat'
import { del, get, post } from '@/service/base'
import NewChatDetailPage from './detail'
import bgImage from "@/app/(commonLayout)/apps/assets/bg@2x.png";

type chatItem = {}

const NewChatPage: React.FC = (props) => {

  const chatSourceList = [
    { label: '全部', key: '', value: '' },
    { label: '平台插件', key: '1', value: '1' },
    { label: '用户插件', key: '2', value: '2' },
  ]

  const chatTypeList = [
    { label: '通用', key: '通用' },
    { label: '多模态', key: '多模态' },
    { label: '办公助手', key: '办公助手' },
    { label: '代码执行', key: '代码执行' },
  ]

  const sortByList = [
    { label: '按最新排序', key: 'create_time' },
    { label: '按最热排序', key: 'subscribe_count' }
  ]
  const [chatSource, setChatSource] = useState<string>('')
  const [chatType, setChatType] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('create_time')
  const [keyword, setKeyword] = useState<string>('')
  // 所有插件
  const [allChatList, setAllChatList] = useState<Array<chatItem>>([])
  // 平台插件
  const [systemChatList, setSystemChatList] = useState<Array<chatItem>>([])
  // 用户插件
  const [customChatList, setCustomChatList] = useState<Array<chatItem>>([])
  // 当前列表展示数据
  const [chatList, setChatList] = useState<Array<chatItem>>([])
  const [limit, setLimit] = useState(9)
  const [current, setCurrent] = useState(0);
  const [typePage, setTypePage] = useState('main')
  const [detailInfo, setDetailInfo] = useState(null)

  const onChangePage: PaginationProps['onChange'] = (pageNumber) => {
    setCurrent(pageNumber - 1)
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleFliter()
  }, [allChatList])

  useEffect(() => {
    handleFliter()
  }, [chatSource, chatType, keyword])

  useEffect(() => {
    let newChatList = handleSort([...chatList])
    setChatList(newChatList)
  }, [sortBy])

  const handleFliter = () => {
    let newChatList = chatSource === '' ? allChatList
      : chatSource === '1' ? systemChatList
        : chatSource === '2' ? customChatList
          : []

    newChatList = newChatList.filter(obj => {
      return (chatType === '' ? true : obj.labels.includes(chatType)) && (keyword === '' ? true : obj.name.includes(keyword))
    })
    newChatList = handleSort(newChatList)
    setChatList(newChatList)
  }

  const fetchData = async () => {
    try {
      // 并行发起两个请求
      const [res1, res2] = await Promise.all([
        get(`/workspaces/current/tools/builtin/flat`),
        get(`/workspaces/current/tools/api/flat`),
      ]);
      const systemChatData = res1.map(item => {
        return { ...item, sourceName: '平台插件' }
      })
      const customChatData = res2.map(item => {
        return { ...item, sourceName: '用户插件' }
      })
      setSystemChatList(systemChatData)
      setCustomChatList(customChatData)
      let chatListResult = handleSort([...systemChatData, ...customChatData])
      setAllChatList(chatListResult)
      setChatList(chatListResult)
    } catch (err) {
      // setError(err);
      console.log('err', err)
    } finally { }
  };

  const handleSort = (list) => {
    let newList = []
    if (sortBy === 'create_time') {
      newList = list.sort((a, b) => new Date(b.create_time) - new Date(a.create_time));
    } else if (sortBy === 'subscribe_count') {
      newList = list.sort((a, b) => b.subscribe_count - a.subscribe_count);
    }
    return newList
  }

  const handleSubscribe = (data) => {
    let url = ''
    if (data.sub) {
      url = API.subscribeCancel
    } else {
      url = API.subscribe
    }
    url({
      body: {
        author: data.author,
        plugin_name: data.name
      }
    }).then(async res => {
      if (res.code === 200 && res.msg === 'success') {
        await fetchData();
        message.success(`${data.sub ? '取消' : ''}订阅成功`)
      }
    })
  }

  const showDetail = ({ type, data }, index) => {
    setDetailInfo({ ...data, index })
    setTypePage(type)
  }

  const detailToList = async (type) => {
    setTypePage(type)
    setDetailInfo(null)
    await fetchData();
  }

  return (
    <div style={{
      padding: '0px',
    }}>
      {
        typePage === 'main' ? <>
          {/* <div style={{ width: '100%', display: 'flex', fontWeight: '700', justifyContent: 'center', alignItems: 'center', position: 'relative', padding: '16px 16px' }}>
            <div className='text-[#1C2748] text-[20px]' style={{ fontWeight: '700', fontSize: '20px', position: 'absolute', left: '24px' }}>插件广场</div>
            <div> */}
          {/* <RadioButton
                size='small'
                list={chatSourceList}
                active={chatSource}
                setActive={(key) => setChatSource(key)}
              /> */}
          {/* 使用分段器展示 radioOptions*/}
          {/* </div>
          </div> */}

          <div className='flex' style={{ justifyContent: 'space-between', fontWeight: '700', backgroundColor: 'white', padding: '16px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
            <div className='text-[#1C2748] text-[20px]'>插件广场</div>
            <Segmented value={chatSource} options={chatSourceList} onChange={(value) => setChatSource(value as string)} />
            <div></div>
          </div>
          {/* <div className="mt-[24px]">插件分类：<RadioButton
              size='small'
              list={chatTypeList}
              active={chatType}
              setActive={(key) => setChatType(key)}
            />
            </div> */}

          <div
            style={{
              backgroundImage: `url(${bgImage.src})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          >
            <div className={`rounded-[8px] px-[24px] ${s.scrollContainer}`} style={{ height: 'calc(100vh - 86px)', position: 'relative', overflowY: 'auto' }}>
              <div className="flex h-[70px] items-center justify-end mb-[10px] py-[12px] border-bottom-[1px solid #F1F2F5]">
                <div className="flex">
                  <Input
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    allowClear
                    placeholder='请输入搜索内容'
                    style={{ width: 250, height: 40, marginRight: 16, borderRadius: '2px' }}
                    suffix={<SearchOutlined />}
                  />
                </div>
              </div>
              <div
                className={`flex-1 overflow-y-auto w-[100%] ${s.scrollContainer}`}
                style={{ height: "calc(100vh - 164px)", marginTop: '10px' }}
              >
                <div
                  className={`h-full flex-1 ${s.cardGrid} ${s.scrollContainer}`}>
                  {
                    chatList.map((item, index) => {
                      return <CardItem
                        key={index}
                        data={item}
                        indexValue={index + 1}
                        changeShowTypePage={(params) => showDetail(params, index)}
                        handleSubscribe={(isSub) => handleSubscribe(isSub)}
                      />
                    })
                  }
                </div>
              </div>
            </div>
          </div>
          {/* <div className='pb-[24px]'>
            <Pagination align="end" defaultCurrent={9} showQuickJumper current={current + 1} total={allChatList?.length} onChange={onChangePage} />
          </div> */}
        </> : <NewChatDetailPage
          data={detailInfo}
          changeShowTypePage={({ type }) => detailToList(type)}
        />
      }
    </div >
  )
}

export default NewChatPage;