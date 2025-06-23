import { useState, useEffect } from 'react';
import { Modal, Form, Input, Rate, Button, message } from 'antd';
import { createRoomReview, checkCustomerReviewed } from '../../services/roomReviewService';

const { TextArea } = Input;

const ReviewForm = ({ roomId, customerId, roomName, visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    console.log('ReviewForm props:', { roomId, customerId, roomName, visible });
    
    // Hiển thị loại dữ liệu
    console.log('Kiểu dữ liệu:', {
      roomIdType: typeof roomId,
      customerIdType: typeof customerId,
      visibleType: typeof visible
    });
    
    // Kiểm tra giá trị
    if (!roomId) console.warn('!!! Thiếu roomId');
    if (!customerId) console.warn('!!! Thiếu customerId');
  }, [roomId, customerId, roomName, visible]);

  const handleSubmit = async (values) => {
    try {
      // Đảm bảo roomId và customerId là số
      const roomIdNum = parseInt(roomId);
      const customerIdNum = parseInt(customerId);
      
      if (isNaN(roomIdNum) || isNaN(customerIdNum)) {
        message.error('Thông tin phòng hoặc khách hàng không hợp lệ');
        console.error('Dữ liệu không hợp lệ:', { 
          roomId, customerId, 
          roomIdNum, customerIdNum,
          roomIdValid: !isNaN(roomIdNum),
          customerIdValid: !isNaN(customerIdNum)
        });
        return;
      }
      
      console.log('Đang gửi đánh giá:', { 
        ...values, 
        roomId: roomIdNum, 
        customerId: customerIdNum 
      });
      
      setSubmitting(true);
      
      // Kiểm tra xem khách hàng đã đánh giá phòng này chưa
      const hasReviewed = await checkCustomerReviewed(customerIdNum, roomIdNum);
      if (hasReviewed) {
        message.error('Bạn đã đánh giá phòng này rồi!');
        setSubmitting(false);
        return;
      }
      
      // Gửi đánh giá
      const response = await createRoomReview({
        roomId: roomIdNum,
        customerId: customerIdNum,
        rating: values.rating,
        comment: values.comment
      });
      
      if (response && response.EC === 0) {
        message.success('Đánh giá của bạn đã được gửi thành công!');
        form.resetFields();
        if (onSuccess) onSuccess();
        onClose();
      } else {
        message.error(response?.EM || 'Có lỗi xảy ra khi gửi đánh giá!');
        console.error('Lỗi từ API:', response);
      }
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      message.error('Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại sau!');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Modal
      title={`Đánh giá phòng ${roomName}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ rating: 5 }}
      >
        <Form.Item
          name="rating"
          label="Đánh giá của bạn"
          rules={[{ required: true, message: 'Vui lòng đánh giá phòng!' }]}
        >
          <Rate allowHalf />
        </Form.Item>
        
        <Form.Item
          name="comment"
          label="Nhận xét"
          rules={[
            { required: true, message: 'Vui lòng nhập nhận xét của bạn!' },
            { min: 10, message: 'Nhận xét phải có ít nhất 10 ký tự!' }
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Chia sẻ trải nghiệm của bạn về phòng này..."
            maxLength={500}
            showCount
          />
        </Form.Item>
        
        <Form.Item className="review-form__actions">
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Gửi đánh giá
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReviewForm; 