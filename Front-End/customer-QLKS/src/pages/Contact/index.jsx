import { useState } from 'react';
import { Row, Col, Card, Form, Input, Button, Typography, notification, Divider } from 'antd';
import { 
  EnvironmentOutlined, 
  SendOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  FacebookOutlined, 
  InstagramOutlined 
} from '@ant-design/icons';
import './Contact.scss';
import { sendContactEmail } from '../../services/contactService';

const { Title, Text } = Typography;
const { TextArea } = Input;

function Contact() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [notiApi, contextHolder] = notification.useNotification();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await sendContactEmail({
        name: values.name,
        email: values.email,
        subject: values.subject,
        message: values.message,
      });

      if (response && response.EC === 0) {
        notiApi.success({
          message: 'Gửi thành công',
          description: 'Cảm ơn bạn đã gửi tin nhắn cho chúng tôi. Chúng tôi sẽ liên hệ lại với bạn sớm.',
        });
        form.resetFields();
      } else {
        throw new Error(response?.EM || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Lỗi khi gửi email:', error);
      notiApi.error({
        message: 'Gửi thất bại',
        description: 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau hoặc liên hệ qua số điện thoại.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {contextHolder}
      <div className="contact-header">
        <Title level={1} className="contact-title">LIÊN HỆ CHÚNG TÔI</Title>
        <Text className="contact-subtitle">Liên hệ và góp ý với chúng tôi</Text>
      </div>

      <Row gutter={[24, 24]} className="contact-content">
        <Col xs={24} md={12}>
          <div className="contact-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3779.6543248183077!2d105.69434537490079!3d18.67283856733188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3139cddf0bf20f23%3A0x86154b56a284fa6d!2zOTkgTMOqIER14bqpbiwgQsOqzIFuIFRodeG7tSwgVGjDoG5oIHBo4buRIFZpbmgsIE5naOG7hyBBbiwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1689175967462!5m2!1svi!2s"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hotel Location"
            ></iframe>

            <Card className="contact-info-card">
              <div className="contact-info">
                <Title level={3}>Địa Chỉ</Title>
                <div className="contact-info-item">
                  <EnvironmentOutlined />
                  <Text> 99 Lê Duẩn - Phường Bến Thủy - Thành Phố Vinh</Text>
                </div>
              </div>
            </Card>
          </div>

          <div className="contact-details">
            <Card className="contact-details-card">
              <Title level={3}>Liên Hệ Đường Dây Nóng</Title>
              <div className="contact-info-item">
                <PhoneOutlined />
                <Text> +84974562765</Text>
              </div>
              <div className="contact-info-item">
                <PhoneOutlined />
                <Text> +84974562765</Text>
              </div>

              <Divider />

              <Title level={3}>Email</Title>
              <div className="contact-info-item">
                <MailOutlined />
                <Text> phamhquyenanh@gmail.com</Text>
              </div>

              <Divider />

              <Title level={3}>Theo Dõi Ngay</Title>
              <div className="contact-social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FacebookOutlined />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <InstagramOutlined />
                </a>
              </div>
            </Card>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <Card className="contact-form-card">
            <Title level={2}>Gửi Tin Nhắn</Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="contact-form"
            >
              <Form.Item
                name="name"
                label="Họ và Tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input placeholder="Nhập họ và tên của bạn" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input placeholder="Nhập địa chỉ email của bạn" />
              </Form.Item>

              <Form.Item
                name="subject"
                label="Tiêu Đề"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
              >
                <Input placeholder="Nhập tiêu đề tin nhắn" />
              </Form.Item>

              <Form.Item
                name="message"
                label="Tin Nhắn"
                rules={[{ required: true, message: 'Vui lòng nhập nội dung tin nhắn!' }]}
              >
                <TextArea rows={5} placeholder="Nhập nội dung tin nhắn của bạn" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                  loading={loading}
                  className="contact-submit-btn"
                >
                  Gửi Tin Nhắn
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Contact;