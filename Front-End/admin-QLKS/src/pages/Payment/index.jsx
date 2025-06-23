import { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Tag, Modal, Form, Input, message, Tooltip, Descriptions, Divider, Select } from 'antd';
import { getAllPayments, getPaymentByBookingId, refundTransaction, queryTransactionStatus } from '../../services/paymentService';
import { 
    DollarOutlined, 
    InfoCircleOutlined, 
    SyncOutlined, 
    RollbackOutlined, 
    SearchOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined
} from '@ant-design/icons';
import './Payment.scss';
import dayjs from 'dayjs';
import { usePermissions } from '../../contexts/PermissionContext';

const { Option } = Select;

function Payment() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isRefundModalVisible, setIsRefundModalVisible] = useState(false);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [isQueryModalVisible, setIsQueryModalVisible] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [form] = Form.useForm();
    const [queryForm] = Form.useForm();
    const [queryResult, setQueryResult] = useState(null);
    const [queryLoading, setQueryLoading] = useState(false);

    // Get permission utilities
    const { canCreate, canUpdate, canDelete, isLoading: permissionLoading } = usePermissions();
    const hasCreatePermission = canCreate('payments');
    const hasUpdatePermission = canUpdate('payments');
    const hasDeletePermission = canDelete('payments');

    // Fetch all payments on component mount
    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await getAllPayments();
            if (response.EC === 0) {
                setPayments(response.DT);
            } else {
                message.error(response.EM || 'Lỗi khi tải dữ liệu thanh toán');
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách thanh toán:', error);
            message.error('Không thể tải danh sách thanh toán');
        } finally {
            setLoading(false);
        }
    };

    const showRefundModal = (record) => {
        setSelectedPayment(record);
        form.setFieldsValue({
            transactionCode: record.transactionCode,
            amount: record.amount.toString(),
            message: `Hoàn tiền cho giao dịch ${record.transactionCode}`
        });
        setIsRefundModalVisible(true);
    };

    const handleRefundCancel = () => {
        setIsRefundModalVisible(false);
        setSelectedPayment(null);
        form.resetFields();
    };

    const handleRefundSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            
            const response = await refundTransaction({
                transactionCode: values.transactionCode,
                amount: parseFloat(values.amount),
                message: values.message
            });
            
            if (response.EC === 0) {
                message.success('Hoàn tiền thành công');
                setIsRefundModalVisible(false);
                fetchPayments(); // Refresh data
            } else {
                message.error(response.EM || 'Hoàn tiền thất bại');
            }
        } catch (error) {
            console.error('Lỗi khi hoàn tiền:', error);
            message.error('Không thể hoàn tiền. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    // Show payment details modal
    const showDetailsModal = async (record) => {
        setDetailsLoading(true);
        try {
            const response = await getPaymentByBookingId(record.bookingId);
            if (response.EC === 0) {
                setPaymentDetails(response.DT);
                setIsDetailsModalVisible(true);
            } else {
                message.error(response.EM || 'Không thể tải thông tin chi tiết thanh toán');
            }
        } catch (error) {
            console.error('Lỗi khi tải chi tiết thanh toán:', error);
            message.error('Không thể tải thông tin chi tiết thanh toán');
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleDetailsModalClose = () => {
        setIsDetailsModalVisible(false);
        setPaymentDetails(null);
    };

    // Show query transaction status modal
    const showQueryModal = (record) => {
        queryForm.setFieldsValue({
            transactionCode: record.transactionCode
        });
        setIsQueryModalVisible(true);
    };

    const handleQueryModalClose = () => {
        setIsQueryModalVisible(false);
        setQueryResult(null);
        queryForm.resetFields();
    };

    const handleQuerySubmit = async () => {
        try {
            const values = await queryForm.validateFields();
            setQueryLoading(true);
            
            const response = await queryTransactionStatus(values.transactionCode);
            if (response.EC === 0) {
                setQueryResult(response.DT);
            } else {
                message.error(response.EM || 'Lỗi khi truy vấn trạng thái giao dịch');
            }
        } catch (error) {
            console.error('Lỗi khi truy vấn trạng thái giao dịch:', error);
            message.error('Không thể truy vấn trạng thái giao dịch');
        } finally {
            setQueryLoading(false);
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '---';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '---';
        return dayjs(dateString).format('DD/MM/YYYY HH:mm:ss');
    };

    // Status tag color mapping
    const getStatusColor = (status) => {
        if (!status) return 'default';
        
        const statusMap = {
            'Paid': 'success',
            'Pending': 'warning',
            'Failed': 'error',
            'Refunded': 'default',
            'Canceled': 'red'
        };
        return statusMap[status] || 'default';
    };

    // Table columns
    const columns = [
        {
            title: 'ID Thanh toán',
            dataIndex: 'paymentId',
            key: 'paymentId',
            sorter: (a, b) => a.paymentId - b.paymentId
        },
        {
            title: 'ID Đặt phòng',
            dataIndex: 'bookingId',
            key: 'bookingId',
            sorter: (a, b) => a.bookingId - b.bookingId
        },
        {
            title: 'Khách hàng',
            key: 'customer',
            render: (_, record) => (
                record.FactBooking?.Customer?.customerName || '---'
            )
        },
        {
            title: 'Khách sạn',
            key: 'hotel',
            render: (_, record) => (
                record.FactBooking?.Hotel?.hotelName || '---'
            )
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => formatCurrency(amount),
            sorter: (a, b) => a.amount - b.amount
        },
        {
            title: 'Phương thức',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            filters: [
                { text: 'VNPay', value: 'VNPay' },
                { text: 'Cash', value: 'Cash' },
                { text: 'CreditCard', value: 'CreditCard' },
                { text: 'BankTransfer', value: 'BankTransfer' }
            ],
            onFilter: (value, record) => record.paymentMethod === value
        },
        {
            title: 'Trạng thái',
            dataIndex: 'statusPayment',
            key: 'statusPayment',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status === 'Paid' ? 'Đã thanh toán' : 
                     status === 'Pending' ? 'Đang xử lý' :
                     status === 'Failed' ? 'Thất bại' :
                     status === 'Refunded' ? 'Đã hoàn tiền' :
                     status === 'Canceled' ? 'Đã hủy' : status}
                </Tag>
            ),
            filters: [
                { text: 'Đã thanh toán', value: 'Paid' },
                { text: 'Đang xử lý', value: 'Pending' },
                { text: 'Thất bại', value: 'Failed' },
                { text: 'Đã hoàn tiền', value: 'Refunded' },
                { text: 'Đã hủy', value: 'Canceled' }
            ],
            onFilter: (value, record) => record.statusPayment === value
        },
        {
            title: 'Ngày thanh toán',
            dataIndex: 'paymentDate',
            key: 'paymentDate',
            render: (date) => formatDate(date),
            sorter: (a, b) => {
                if (!a.paymentDate) return -1;
                if (!b.paymentDate) return 1;
                return new Date(a.paymentDate) - new Date(b.paymentDate);
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button 
                            type="primary" 
                            icon={<InfoCircleOutlined />}
                            size="small"
                            onClick={() => showDetailsModal(record)}
                        />
                    </Tooltip>
                    
                    <Tooltip title="Truy vấn trạng thái">
                        <Button 
                            type="default"
                            icon={<SearchOutlined />}
                            size="small"
                            onClick={() => showQueryModal(record)}
                        />
                    </Tooltip>
                    
                    {/* Only show refund button for successful payments that haven't been refunded */}
                    {record.statusPayment === 'Paid' && !record.refundAmount && (
                        <Tooltip title="Hoàn tiền">
                            <Button 
                                type="default" 
                                danger
                                icon={<RollbackOutlined />}
                                size="small"
                                onClick={() => showRefundModal(record)}
                            />
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="payment-page">
            <Card 
                title={
                    <Space>
                        <DollarOutlined />
                        <span>Quản lý thanh toán</span>
                    </Space>
                }
                extra={
                    <Button 
                        type="primary" 
                        icon={<SyncOutlined />}
                        onClick={fetchPayments} 
                        loading={loading}
                    >
                        Làm mới
                    </Button>
                }
            >
                <Table 
                    columns={columns.filter(col => {
                        if (col.key !== 'action') return true;
                        return hasUpdatePermission || hasDeletePermission;
                    })}
                    dataSource={payments} 
                    rowKey="paymentId"
                    loading={loading || permissionLoading}
                    pagination={{ 
                        pageSize: 10,
                        showTotal: (total) => `Tổng cộng ${total} giao dịch`,
                        showSizeChanger: true
                    }}
                />
            </Card>

            {/* Refund Modal */}
            <Modal
                title="Xác nhận hoàn tiền"
                open={isRefundModalVisible}
                onOk={handleRefundSubmit}
                onCancel={handleRefundCancel}
                confirmLoading={loading}
                okText="Hoàn tiền"
                cancelText="Hủy"
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="transactionCode"
                        label="Mã giao dịch"
                        rules={[{ required: true, message: 'Vui lòng nhập mã giao dịch!' }]}
                    >
                        <Input disabled />
                    </Form.Item>
                    
                    <Form.Item
                        name="amount"
                        label="Số tiền hoàn"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số tiền!' },
                            { 
                                validator: (_, value) => {
                                    if (value && selectedPayment && parseFloat(value) > selectedPayment.amount) {
                                        return Promise.reject('Số tiền hoàn không được lớn hơn số tiền đã thanh toán!');
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <Input type="number" step="0.01" />
                    </Form.Item>
                    
                    <Form.Item
                        name="message"
                        label="Lý do hoàn tiền"
                        rules={[{ required: true, message: 'Vui lòng nhập lý do hoàn tiền!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Query Transaction Modal */}
            <Modal
                title="Truy vấn trạng thái giao dịch"
                open={isQueryModalVisible}
                onCancel={handleQueryModalClose}
                footer={[
                    <Button key="query" type="primary" onClick={handleQuerySubmit} loading={queryLoading}>
                        Truy vấn
                    </Button>,
                    <Button key="close" onClick={handleQueryModalClose}>
                        Đóng
                    </Button>
                ]}
            >
                <Form
                    form={queryForm}
                    layout="vertical"
                >
                    <Form.Item
                        name="transactionCode"
                        label="Mã giao dịch"
                        rules={[{ required: true, message: 'Vui lòng nhập mã giao dịch!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
                
                {queryResult && (
                    <>
                        <Divider />
                        <Descriptions title="Kết quả truy vấn" bordered column={1}>
                            <Descriptions.Item label="Mã giao dịch">{queryResult.transactionCode}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={queryResult.status === 'Success' ? 'green' : 'red'}>
                                    {queryResult.status === 'Success' ? 'Thành công' : 'Thất bại'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã phản hồi">{queryResult.responseCode}</Descriptions.Item>
                            <Descriptions.Item label="Thông báo">{queryResult.message}</Descriptions.Item>
                            <Descriptions.Item label="Ngày thanh toán">{formatDate(queryResult.paymentDate)}</Descriptions.Item>
                            <Descriptions.Item label="Số tiền">{formatCurrency(queryResult.amount)}</Descriptions.Item>
                            <Descriptions.Item label="Ngân hàng">{queryResult.bankCode || '---'}</Descriptions.Item>
                            <Descriptions.Item label="Loại thẻ">{queryResult.cardType || '---'}</Descriptions.Item>
                            <Descriptions.Item label="Mã GD VNPay">{queryResult.transactionNo || '---'}</Descriptions.Item>
                        </Descriptions>
                    </>
                )}
            </Modal>

            {/* Payment Details Modal */}
            <Modal
                title="Chi tiết thanh toán"
                open={isDetailsModalVisible}
                onCancel={handleDetailsModalClose}
                footer={[
                    <Button key="close" onClick={handleDetailsModalClose}>
                        Đóng
                    </Button>
                ]}
                width={800}
            >
                {detailsLoading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</div>
                ) : paymentDetails ? (
                    <>
                        <Descriptions title="Thông tin thanh toán" bordered column={2}>
                            <Descriptions.Item label="ID Thanh toán">{paymentDetails.paymentId}</Descriptions.Item>
                            <Descriptions.Item label="ID Đặt phòng">{paymentDetails.bookingId}</Descriptions.Item>
                            <Descriptions.Item label="Số tiền">{formatCurrency(paymentDetails.amount)}</Descriptions.Item>
                            <Descriptions.Item label="Phương thức">{paymentDetails.paymentMethod}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={getStatusColor(paymentDetails.statusPayment)}>
                                    {paymentDetails.statusPayment === 'Paid' ? 'Đã thanh toán' : 
                                     paymentDetails.statusPayment === 'Pending' ? 'Đang xử lý' :
                                     paymentDetails.statusPayment === 'Failed' ? 'Thất bại' :
                                     paymentDetails.statusPayment === 'Refunded' ? 'Đã hoàn tiền' :
                                     paymentDetails.statusPayment === 'Canceled' ? 'Đã hủy' : 
                                     paymentDetails.statusPayment}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã giao dịch">{paymentDetails.transactionCode || '---'}</Descriptions.Item>
                            <Descriptions.Item label="Ngày thanh toán">{formatDate(paymentDetails.paymentDate)}</Descriptions.Item>
                            <Descriptions.Item label="Ngân hàng">{paymentDetails.bankCode || '---'}</Descriptions.Item>
                            <Descriptions.Item label="Loại thẻ">{paymentDetails.cardType || '---'}</Descriptions.Item>
                            <Descriptions.Item label="Mã GD VNPay">{paymentDetails.vnp_TransactionNo || '---'}</Descriptions.Item>
                        </Descriptions>

                        {paymentDetails.refundAmount && (
                            <>
                                <Divider />
                                <Descriptions title="Thông tin hoàn tiền" bordered column={2}>
                                    <Descriptions.Item label="Số tiền hoàn">{formatCurrency(paymentDetails.refundAmount)}</Descriptions.Item>
                                    <Descriptions.Item label="Ngày hoàn tiền">{formatDate(paymentDetails.refundDate)}</Descriptions.Item>
                                    <Descriptions.Item label="Mã GD hoàn tiền">{paymentDetails.refundTransactionCode || '---'}</Descriptions.Item>
                                </Descriptions>
                            </>
                        )}

                        {paymentDetails.FactBooking && (
                            <>
                                <Divider />
                                <Descriptions title="Thông tin đặt phòng" bordered column={2}>
                                    <Descriptions.Item label="Tên khách hàng">{paymentDetails.FactBooking.Customer?.customerName || '---'}</Descriptions.Item>
                                    <Descriptions.Item label="Số điện thoại">{paymentDetails.FactBooking.Customer?.phoneNumber || '---'}</Descriptions.Item>
                                    <Descriptions.Item label="Email">{paymentDetails.FactBooking.Customer?.email || '---'}</Descriptions.Item>
                                    <Descriptions.Item label="Khách sạn">{paymentDetails.FactBooking.Hotel?.hotelName || '---'}</Descriptions.Item>
                                    <Descriptions.Item label="Địa chỉ">{paymentDetails.FactBooking.Hotel?.address || '---'}</Descriptions.Item>
                                    <Descriptions.Item label="Check-in">{formatDate(paymentDetails.FactBooking.dateIn)}</Descriptions.Item>
                                    <Descriptions.Item label="Check-out">{formatDate(paymentDetails.FactBooking.dateOut)}</Descriptions.Item>
                                </Descriptions>
                            </>
                        )}

                        {paymentDetails.FactBooking && paymentDetails.FactBooking.FactBookingDetails && paymentDetails.FactBooking.FactBookingDetails.length > 0 && (
                            <>
                                <Divider />
                                <h3>Chi tiết phòng đặt</h3>
                                <Table 
                                    dataSource={paymentDetails.FactBooking.FactBookingDetails}
                                    rowKey="bookingDetailId"
                                    pagination={false}
                                    columns={[
                                        {
                                            title: 'Phòng',
                                            dataIndex: ['Room', 'roomName'],
                                            key: 'roomName',
                                            render: (text) => text || '---'
                                        },
                                        {
                                            title: 'Loại phòng',
                                            dataIndex: ['Room', 'roomType'],
                                            key: 'roomType',
                                            render: (text) => text || '---'
                                        },
                                        {
                                            title: 'Số lượng',
                                            dataIndex: 'roomCount',
                                            key: 'roomCount',
                                            render: (text) => text || 1
                                        },
                                        {
                                            title: 'Người lớn',
                                            dataIndex: 'adultCount',
                                            key: 'adultCount',
                                            render: (text) => text || 0
                                        },
                                        {
                                            title: 'Trẻ em',
                                            dataIndex: 'childrenCount',
                                            key: 'childrenCount',
                                            render: (text) => text || 0
                                        },
                                        {
                                            title: 'Giá phòng',
                                            dataIndex: 'specialRate',
                                            key: 'specialRate',
                                            render: (price) => formatCurrency(price)
                                        },
                                        {
                                            title: 'Thành tiền',
                                            dataIndex: 'totalAmount',
                                            key: 'totalAmount',
                                            render: (amount) => formatCurrency(amount)
                                        }
                                    ]}
                                    summary={() => {
                                        const total = paymentDetails.FactBooking.FactBookingDetails.reduce(
                                            (sum, detail) => sum + parseFloat(detail.totalAmount || 0), 
                                            0
                                        );
                                        return (
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell index={0} colSpan={6} style={{ textAlign: 'right' }}>
                                                    <strong>Tổng cộng:</strong>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={1}>
                                                    <strong>{formatCurrency(total)}</strong>
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        );
                                    }}
                                />
                            </>
                        )}
                    </>
                ) : (
                    <div>Không có dữ liệu</div>
                )}
            </Modal>
        </div>
    );
}

export default Payment;