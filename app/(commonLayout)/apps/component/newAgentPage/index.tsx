import { Button, Flex, Input, message, Pagination, Radio, Segmented, Space, PaginationProps, Card } from "antd";
import useSwr from 'swr'
import './index.scss';
import { useEffect, useState } from "react";
import { getTenants } from '@/service/common'
import { editNewAgentData, getNewAgentPage } from "@/service/apps";
import TypeCard from "./typeCard";
import { getFiveIndex } from "@/utils/var";
import NewChatDetailPage from "./detail";
import RadioButton from "../newChatPage/radioButton";
import bgImage from "@/app/(commonLayout)/apps/assets/bg@2x.png";
import { SearchOutlined } from '@ant-design/icons';

const NewAgentPage: React.FC = (props) => {

    const tenant_id = '9a0ead78-3689-4bf0-8000-9ab72250cfb2';

    const [radioValue, setRadioValue] = useState('agent-chat')
    const [segmentedValue, setSegmentedValue] = useState('')
    const [sortTypeValue, setSortTypeValue] = useState('')
    const [searchName, setSearchName] = useState('')
    const [selectData, setSelectData] = useState<any>({})
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(9)
    const [showContentType, setShowContentType] = useState('main');
    const [detailData, setDetailData] = useState<any>({});
    const [result, setResult] = useState<any>({});
    const { data: tenants, mutate: tenantsMutate }: any = useSwr('/getTenants', getTenants)

    const radioOptions = [
        { label: '智能体', key: 'agent-chat', value: 'agent-chat' },
        { label: '工作流', key: 'workflow', value: 'workflow' }
    ]

    const segmentedOptions = [
        { label: '全部', key: '', value: '' },
        { label: '通用', key: 'common', value: 'common' },
        { label: '办公助手', key: 'official', value: 'official' },
        { label: '业务场景', key: 'business', value: 'business' },
    ]

    useEffect(() => {
        getTableList();
    }, [radioValue, segmentedValue, sortTypeValue, showContentType]);

    const sortType = [
        { label: '按最新排序', key: '' },
        { label: '按最热排序', key: 'experience_count' },
        { label: '按点赞排序', key: 'like_count' },
    ]

    const getTableList = async (page1: number = 1, limit1: number = 9) => {
        const limit2 = limit1 || limit
        const page2 = page1 || page
        limit1 && setLimit(limit1);
        page1 && setPage(page1)

        const param = {
            page: page2,
            limit: limit2,
            mode: radioValue,
            app_type: segmentedValue,
            count_type: sortTypeValue || '',
            name: searchName || '',
        }

        try {
            const url = `global-apps/rank?page=${param.page}&limit=${param.limit}&mode=${param.mode}&app_type=${param.app_type}&count_type=${param.count_type}&name=${param.name}`;
            // const url = `global-apps/rank?page=${param.page}&limit=${param.limit}&count_type=${param.count_type}&name=${param.name}`;
            const result: any = await getNewAgentPage({ url });
            if ((result as any)?.data !== undefined) {
                const timer = setTimeout(() => {
                    setResult(result)

                }, 0)
            } else {
                message.error('查询失败')
            }
        } catch (error) {
            message.error('请求失败，请检查网络或稍后重试')
            console.error('请求错误:', error)
        }
    }

    const getDetailContent = async (data: any) => {
        setSelectData(data);
        const { id } = data;

        const param = {
            app_id: id
        }

        try {
            const url = `app/get-specifics?app_id=${param.app_id}`;
            const result: any = await getNewAgentPage({ url });
            if ((result as any)?.id !== undefined) {
                const timer = setTimeout(() => {
                    const { name, description: desc, is_liked, created_at: time, location: source, like_count: num } = result as any;
                    setShowContentType('detail')
                    setDetailData({ name, desc, time, source, num, is_liked, id })
                }, 0)
            } else {
                message.error('查询失败')
            }
        } catch (error) {
            message.error('请求失败，请检查网络或稍后重试')
            console.error('请求错误:', error)
        }
    }

    const toHanleOpeartion = async (app_id: string, add_value: string, count_type: string) => {
        const param = {
            mode: radioValue,
            app_id,
            add_value, //点赞/取消点赞(1 or -1)；立即体验（1）
            tenant_id,
            count_type: count_type //  (""like_count", "experience_count"")
        }
        try {
            const url = `app/edit-count?mode=${param.mode}&app_id=${param.app_id}&add_value=${param.add_value}&tenant_id=${param.tenant_id}&count_type=${param.count_type}`
            const result = await editNewAgentData({ url, param });
            if (result?.success) {
                const timer = setTimeout(() => {
                    if (add_value + '' === '1' && param.count_type === 'experience_count') {
                        window.open(`/agent-platform-web/explore/installed/${app_id}?tanent_id=${tenant_id}`)
                    } else if ((add_value + '' === '1' || add_value + '' === '-1') && param.count_type === 'like_count') {
                        getDetailContent(selectData);
                        message.info(add_value + '' === '1' ? '点赞成功' : '取消点赞成功');
                    }
                }, 0)
            } else {
                message.error('查询失败')
            }
        } catch (error) {
            message.error('请求失败，请检查网络或稍后重试')
            console.error('请求错误:', error)
        }

    }

    const onChangePage: PaginationProps['onChange'] = (page: any, pageSize: any) => {
        setPage(page)
        setLimit(pageSize)
        getTableList(page, pageSize)
    }


    const getShowContent = (showContentType: string) => {
        switch (showContentType) {
            case 'detail':
                return <NewChatDetailPage {...({ tenant_id, radioValue, key: detailData?.num, onClose: () => setShowContentType('main'), toHanleOpeartion, info: detailData } as any)} />
            case 'main':
                return <div style={{ width: '100%', height: '100%' }}>
                    <div className='flex' style={{ justifyContent: 'space-between', fontWeight: '700', backgroundColor: 'white', padding: '16px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                        <div className='text-[#1C2748] text-[20px]'>应用广场</div>
                        <Segmented value={radioValue} options={radioOptions} onChange={(value) => setRadioValue(value as string)} />
                        <div></div>
                    </div>
                    {/* <div style={{ width: '100%', padding: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 500, fontSize: '20px', color: '#000000', lineHeight: '22px' }}></span>
                        使用分段器展示 radioOptions
                        <Segmented value={radioValue} options={radioOptions} onChange={(value) => setRadioValue(value as string)} />
                        <div></div>
                    </div> */}
                    <div className="newAgentPage" style={{
                        backgroundImage: `url(${bgImage.src})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        padding: '20px 24px 0px 24px'
                    }}>
                        {/* <Card style={{ width: '100%' }}>
                            <div>应用：<RadioButton
                                size='small'
                                list={radioOptions}
                                active={radioValue}
                                {...({ setActive: (key: any) => setRadioValue(key) } as any)}
                            />
                            </div>
                        </Card> */}
                        <Flex style={{ width: '100%', marginBottom: '20px' }} justify={'flex-end'} gap={'middle'} vertical={false}>
                            <Input
                                placeholder="请输入搜索内容"
                                // allowClear
                                onChange={(e) => setSearchName(e.target.value)}
                                onPressEnter={() => getTableList(1, 9)}
                                style={{ width: 360, height: 32, borderRadius: '2px' }}
                                suffix={<SearchOutlined />}
                            />
                        </Flex>

                        <div className={`flex-1 w-[100%] overflow-y-auto scrollContainer`} style={{ height: 'calc(100vh - 164px)' }}>
                            <div className='cardGrid'>
                                {result?.data?.map((item: any, index: number) => index > 1 && <TypeCard key={index + item?.name} {...({
                                    data: item,
                                    headerImg: 'header_agent1',
                                    toHanleOpeartion,
                                    tenant_id,
                                    radioValue,
                                    getDetailContent,
                                    indexValue: index + 1,
                                    styleCss: { backgroundImage: `url('/agent-platform-web/bg/agentChatBg${getFiveIndex(index + 1)}.png')` },
                                    tenants
                                } as any)} />)}
                            </div>
                        </div>
                        {/* <div className='pb-[24px]'>
                            <Pagination align="end" defaultPageSize={result?.limit || 9} showQuickJumper current={result?.page} total={result?.total} onChange={onChangePage} />
                        </div> */}
                    </div>
                </div>
        }
    }

    return <>
        {getShowContent(showContentType)}
    </>
}
export default NewAgentPage;