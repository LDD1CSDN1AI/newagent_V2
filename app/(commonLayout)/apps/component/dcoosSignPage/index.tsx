import React, { useEffect, useState } from 'react'
import { Button, Divider, Empty, Input, Modal, Radio, Space, Table, Tooltip, message } from 'antd'
import type { TableProps } from 'antd'
import useSWRInfinite from 'swr/infinite'
import useSWR from 'swr'
import { addDcoosApi, fetchLlmList } from '@/service/common'
import { fetchAppList } from '@/service/apps'
import type { AppListResponse } from '@/models/app'
import Toast from '@/app/components/base/toast'
import { useAppContext } from '@/context/app-context'
import GlobalUrl from '@/GlobalUrl'
import emptyTable from '@/public/image/emptyTable.png'
import { CheckCircleFilled } from '@ant-design/icons'
type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection']
type Props = {
  data?: AppListResponse | undefined
  mutate?: () => void
  setActiveTab?: any
}

const agentTypeName: any = {
  'metabolic': '智能体',
  'agent-chat': 'Agent',
  'workflow': '工作流',
  'chat': '聊天助手',
  'advanced-chat': '对话流'
}

const getKey = (
  pageIndex: number,
  previousPageData: AppListResponse,
  // keywords: string,
) => {
  if (!pageIndex || previousPageData.has_more) {
    const params: any = { url: '/apps', params: { page: pageIndex + 1, limit: 100, mode: 'dcoos-sign' } }

    return params
  }
  return null
}


const columnsLlm: TableProps<any>['columns'] = [
  {
    title: '应用名称',
    dataIndex: 'modelName',
    key: 'modelName',
  },
  {
    title: '服务类型',
    dataIndex: 'mode',
    key: 'mode',
    render(text) {
      return (
        '大模型'
      )
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
    key: 'createDate',
    render(text) {
      return (
        text.split(' ')[0]
      )
    },
  },
]

const DcoosPage: React.FC<Props> = ({ setActiveTab }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [agentType, setAgentType] = useState('agent-chat')
  const [showResultModal, setShowResultModal] = useState(false)
  const { data, mutate } = useSWRInfinite(
    (pageIndex: number, previousPageData: AppListResponse) => getKey(pageIndex, previousPageData),
    fetchAppList,
    { revalidateFirstPage: true },
  )
  const { data: llmList, mutate: llmMutate }: any = useSWR(GlobalUrl.wangyun_defaultUrlIp_no_agent_platform + '/intf-restful-service/deploy/queryAllDeployedModel', fetchLlmList)

  const { userProfile }: any = useAppContext()

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
    type: 'radio',
  }

  const columns: TableProps<any>['columns'] = [
    {
      title: '应用名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'mode',
      key: 'mode',
      render(text) {
        return (
          agentTypeName[text]
        )
      },
    },
    {
      title: '所属项目空间',
      dataIndex: 'tenant_name',
      key: 'tenant_name',
    },
    {
      title: '应用ID',
      dataIndex: 'app_model_config_id',
      key: 'app_model_config_id',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render(text) {
        return (
          text.split('T')[0]
        )
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, rd) => (
        <Space size="middle">
          {(rd.app_mode !== '') && (

            <span style={{ color: '#1677ff', cursor: 'pointer' }}
              onClick={() => onSelectChange([rd.id])}>注册</span>
          )
          }
        </Space >
      ),
    },
  ]

  useEffect(() => {
    selectedRowKeys.length !== 0 && addApi()
  }, [selectedRowKeys]);

  const addApi = () => {
    if (selectedRowKeys[0]) {
      const mode = data?.[0].data.find(item => item.id === selectedRowKeys[0])?.mode

      const getUrl = () => {
        switch (mode) {
          case 'agent-chat':
            return GlobalUrl.shufa_rongqi_ip + `/v1/chat-messages/${selectedRowKeys[0]}`;
          case 'workflow':
            return GlobalUrl.shufa_rongqi_ip + `/v1/workflows/run/${selectedRowKeys[0]}`;
          case 'advanced-chat':
            return GlobalUrl.shufa_rongqi_ip + `/v1/chat-messages/${selectedRowKeys[0]}`;
        }
      }

      if (agentType === 'agent-chat') {
        addDcoosApi({

          url: GlobalUrl.defaultUrlIp + '/interface/api/add-api',
          body: {
            url: getUrl(),
            type: 'post',
            name: data?.[0].data.find(item => item.id === selectedRowKeys[0])?.name,
            createBy: userProfile?.employee_number,
            app_id: selectedRowKeys[0]
          },
        }).then((res: any) => {
          // setActiveTab('dcoos')
          if (res?.code + '' === '0') {
            setShowResultModal(true)
          } else {
            message.error(res?.msg)
          }
        }
        )
      }

      else {
        addDcoosApi({
          url: GlobalUrl.wangyun_defaultUrlIp_no_agent_platform + '/intf-restful-service/deploy/modelRegisterApi',
          body: {
            deployTaskId: selectedRowKeys[0],
            status: '1',
          },
        }).then(() => setActiveTab('dcoos'))
      }
    }
    else {
      Toast.notify({
        type: 'warning',
        message: '请先选择能力模型',
      })
    }
  }

  const handleTypeChange = (type: any) => {
    setAgentType(type)
    setSelectedRowKeys([])
  }

  const dataTypes = [
    { label: '智能体', value: 'agent-chat' },
    { label: '工作流', value: 'workflow' },
    { label: '对话流', value: 'advanced-chat' },
    { label: '大模型', value: 'llm' },
  ]

  return (
    <>
      <div style={{ backgroundColor: '#F8F9FD', height: '100%', width: '100%' }}>
        <div onClick={() => {
          setActiveTab('dcoos')
        }} style={{ backgroundColor: 'white', padding: '16px 16px', marginBottom: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', cursor: 'pointer' }} className='flex items-center mb-[16px]'>
          <div
            style={{ fontSize: '14px', color: '#393E44', marginRight: '4px', fontWeight: '700', marginTop: '-2px' }}
          >
            &lt;
          </div>
          <div style={{ fontWeight: '400', fontFamily: 'Source Han Sans-Regular' }} className='text-[#666666] text-[14px]'>返回上一页</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* <div style={{ marginTop: '24px' }}>
              <Divider type="vertical" style={{ borderInlineStart: '3px solid #3470F8' }} />
              <span className='font-bold'>能力选择</span>
            </div> */}
          {/* <div style={{ marginTop: '24px' }} className='flex justify-center mb-[24px]'>
              <Button style={{ marginRight: '24px' }} onClick={() => setSelectedRowKeys([])}>取消</Button>
              <Button type='primary' onClick={addApi}>确定</Button>
            </div> */}
        </div>
        <div style={{ margin: ' 0 24px 24px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* <Radio.Group onChange={e => handleTypeChange(e.target.value)} defaultValue="agent">
              <Radio.Button value="agent">智能体</Radio.Button>
              <Radio.Button value="llm">大模型</Radio.Button>
            </Radio.Group> */}
          <div>
            全部：
            {
              dataTypes.map(record => {
                return <div onClick={() => handleTypeChange(record.value)} style={{ cursor: 'pointer', display: 'inline-block', padding: '4px 16px', margin: '0 6px', color: agentType === record.value ? '#216EFF ' : '', borderBottom: agentType === record.value ? '1px solid #216EFF' : '' }}>
                  {
                    record.label
                  }
                </div>
              })
            }
          </div>
          <Space style={{ width: '323px' }}>
            {/* <Input style={{ width: '240px', border: 'none' }} placeholder='输入名称/接口ID/应用ID查询' />
            <Button type={'primary'}>搜索</Button> */}
          </Space>
        </div>
        <div className='flex flex-col bg-[#fff] rounded-[8px] px-[24px]' style={{ height: 'calc(100vh - 160px)', padding: '16px 16px', margin: '0 16px' }}>

          <div className='flex-1 w-[100%]'>
            {agentType === 'agent-chat' || agentType === 'workflow' || agentType === 'advanced-chat'
              ? (
                <Table columns={columns} rowKey={rd => rd.id}
                  locale={{
                    emptyText:
                      <Empty
                        imageStyle={{ width: '240px', height: '240px' }}
                        image={'/agent-platform-web/image/emptyTable.png'}
                        description=""
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                      </Empty>
                  }}
                  //  rowSelection={rowSelection}
                  dataSource={data?.[0].data.filter(record => record.mode === agentType)}
                  pagination={{ defaultPageSize: 5 }} />
              )
              : (
                <Table columns={columnsLlm} rowKey={rd => rd.id}
                  // rowSelection={rowSelection}
                  locale={{
                    emptyText:
                      <Empty
                        imageStyle={{ width: '240px', height: '240px' }}
                        image={'/agent-platform-web/image/emptyTable.png'}
                        description=""
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                      </Empty>
                  }}
                  dataSource={llmList?.data} pagination={{ defaultPageSize: 5 }} />
              )}
          </div>
          <Modal
            title={'注册'}
            open={showResultModal}
            onCancel={() => setShowResultModal(false)}
            footer={[
              <Button onClick={() => { setShowResultModal(false); setActiveTab('dcoos'); }}>查看接口ID</Button>,
              <Button onClick={() => setShowResultModal(false)} type={'primary'}>继续注册</Button>
            ]}
          >
            <CheckCircleFilled style={{ color: 'green' }} />{data?.[0].data.find(item => item.id === selectedRowKeys[0])?.name}已注册成功
          </Modal>
        </div>
      </div>
    </>

  )
}

export default DcoosPage
