import { useState, useEffect } from 'react';
import { Table, Button, Card, Form, Empty, Input, Modal, Popconfirm, message, Space, Select, TreeSelect } from 'antd';
import { getMenuTreeApi, addMenuApi, updateMenuApi, deleteMenuApi } from '../api/menuApi';
import { hasPermission } from '../utils/permission';
import IconSelect from '../components/iconSelect';
import * as AntIcons from '@ant-design/icons';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
interface TreeNode {
    id: number;
    title: string;
    children?: TreeNode[];
}

const MenuList = () => {
    const [form] = Form.useForm();
    const [list, setList] = useState<any[]>([]);
    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const [visible, setVisible] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null); // 当前编辑的菜单ID

    // 格式化树形数据
    const formatTreeData = (data: any[]): TreeNode[] => {
        return data.map(item => ({
            id: item.id,
            title: item.menuName,
            children: item.children ? formatTreeData(item.children) : [],
        }));
    };

    // 加载菜单列表
    const loadMenuList = async () => {
        try {
            const res = await getMenuTreeApi();
            setList(res.data);
            setTreeData(formatTreeData(res.data));
        } catch (error) {
            message.error('菜单加载失败');
        }
    };

    useEffect(() => {
        loadMenuList();
    }, []);

    // 新增
    const handleAdd = () => {
        form.resetFields();
        setCurrentId(null);
        setVisible(true);
    };

    // 编辑回填
    const handleEdit = (record: any) => {
        form.setFieldsValue(record);
        setCurrentId(record.id);
        setVisible(true);
    };

    // 删除
    const handleDelete = async (id: number) => {
        try {
            await deleteMenuApi(id);
            message.success('删除成功');
            loadMenuList();
        } catch (error) {
            message.error('删除失败');
        }
    };

    // 提交
    const handleSubmit = async (values: any) => {
        try {
            // 编辑时，不允许主页（id=1）修改 parentId
            if (currentId === 1) {
                values.parentId = null;
            }

            // 不允许自己选自己当上级
            if (values.parentId === currentId) {
                message.error('不能选择自己作为上级菜单');
                return;
            }
            console.log(values)
            console.log(currentId)

            if (currentId) {
                await updateMenuApi(currentId, values);
            } else {
                await addMenuApi(values);
            }
            message.success('保存成功');
            setVisible(false);
            loadMenuList();
        } catch (error) {
            message.error('提交失败');
        }
    };

    const columns = [
        { title: '菜单名称', dataIndex: 'menuName' },
        { title: '路由路径', dataIndex: 'path' },
        // { title: 'api路径', dataIndex: 'apiUrl' },
        { title: '类型', dataIndex: 'type' },
        {
            title: '图标',
            dataIndex: 'icon',
            key: 'icon',
            render: (icon: string | null) => {
                const IconComp = (AntIcons as any)[icon || 'AppstoreOutlined'];
                return IconComp ? <IconComp style={{ fontSize: 16 }} /> : '-';
            },
        },
        { title: '排序', dataIndex: 'sort' },
        {
            title: '操作',
            render: (_: unknown, record: { id: number }) => (
                <Space>
                    {hasPermission('menuEdit') && 
                     <Button type="text" icon={<EditOutlined />} onClick={() => { form.setFieldsValue(record); setVisible(true); }}>编辑</Button>
                 }
                    {hasPermission('menuDel') &&
                        <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
                            <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
                        </Popconfirm>
                    }
                </Space>
            )
        }
    ];

    return (
        <Card title="菜单管理">
            {hasPermission('menuAdd') && <Button type="primary" onClick={handleAdd}>新增菜单</Button>}
            <Table columns={columns}
                dataSource={list}
                rowKey="id"
                pagination={false}
                locale={{ emptyText: <Empty description="暂无内容" /> }}
            />


            <Modal
                title="菜单信息"
                open={visible}
                onCancel={() => setVisible(false)}
                footer={null}
                width={600}
                destroyOnHidden
                forceRender
            >
                <Form form={form} onFinish={handleSubmit} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                    <Form.Item name="id" hidden><Input /></Form.Item>

                    <Form.Item label="菜单名称" name="menuName" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    {/* 上级菜单：编辑【主页】时禁用选择 */}
                    <Form.Item label="上级菜单" name="parentId">
                        <TreeSelect
                            placeholder="请选择上级菜单"
                            allowClear
                            treeData={treeData}
                            fieldNames={{ label: 'title', value: 'id', children: 'children' }}
                            disabled={currentId === 1} //主页禁止修改上级
                        />
                    </Form.Item>

                    <Form.Item label="类型" name="type" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="menu">menu</Select.Option>
                            <Select.Option value="button">button</Select.Option>
                            <Select.Option value="api">api</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="路由路径" name="path"><Input /></Form.Item>
                    <Form.Item label="api路径" name="apiUrl" hidden><Input /></Form.Item>
                    <Form.Item label="菜单图标" name="icon"><IconSelect /></Form.Item>
                    <Form.Item label="排序" name="sort"><Input /></Form.Item>
                    <Form.Item wrapperCol={{ offset: 4 }}>
                        <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>提交</Button>
                        <Button onClick={() => setVisible(false)}>取消</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default MenuList;