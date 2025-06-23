import { Card, Row, Col, Select, Button } from 'antd';
import { DollarTwoTone, ContactsTwoTone, ProfileTwoTone, DownloadOutlined } from '@ant-design/icons';
import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import './Dashboard.scss';
import Revenue from '../../components/Revenue';
import BookedCount from '../../components/BookedCount';
import RoomCount from '../../components/RoomCount';
import CustomerArea from '../../components/CustomerArea';
import HotelPie from '../../components/HotelPie';

function Dashboard() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const revenueRef = useRef();
  const bookedRef = useRef();
  const roomCountRef = useRef();
  const customerChartRef = useRef();
  const hotelChartRef = useRef();
  
  // Generate years options (current year and 5 years back)
  const years = [];
  for (let i = 0; i < 6; i++) {
    years.push(currentYear - i);
  }

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };
  
  const exportToExcel = () => {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    
    // Get data from components using refs
    const revenueData = revenueRef.current?.getData() || { value: 0 };
    const bookedData = bookedRef.current?.getData() || { value: 0 };
    const roomData = roomCountRef.current?.getData() || { value: 0 };
    const customerData = customerChartRef.current?.getData() || [];
    const hotelData = hotelChartRef.current?.getData() || [];
    
    // Create summary sheet
    const summaryData = [
      ['Báo Cáo Dashboard - ' + selectedYear],
      [''],
      ['Số Liệu Tổng Quan'],
      ['Chỉ số', 'Giá trị'],
      ['Tổng doanh thu', revenueData.value.toLocaleString('vi-VN') + ' VNĐ'],
      ['Số lượng đơn đặt phòng', bookedData.value],
      ['Tổng số phòng', roomData.value],
      ['']
    ];
    
    // Add monthly customer data
    summaryData.push(['Khách Hàng Đăng Ký Theo Tháng']);
    summaryData.push(['Tháng', 'Số lượng']);
    customerData.forEach(item => {
      summaryData.push([`Tháng ${item.month}`, item.count]);
    });
    
    summaryData.push(['']);
    
    // Add hotel revenue data
    summaryData.push(['Doanh Thu Theo Khách Sạn']);
    summaryData.push(['Tên Khách Sạn', 'Doanh Thu (VNĐ)']);
    hotelData.forEach(item => {
      summaryData.push([
        item.hotelName, 
        typeof item.totalRevenue === 'number' ? 
        item.totalRevenue.toLocaleString('vi-VN') : 
        '0'
      ]);
    });
    
    // Add to workbook with formatting
    const ws = XLSX.utils.aoa_to_sheet(summaryData);
    
    // Set column widths
    const colWidths = [
      { wch: 30 }, // A column
      { wch: 25 }, // B column
    ];
    ws['!cols'] = colWidths;
    
    // Apply styling for title and headers
    // Set title cell format (A1)
    if(!ws.A1) ws.A1 = { v: "Báo Cáo Dashboard - " + selectedYear, t: 's' };
    ws.A1.s = { 
      font: { bold: true, sz: 16 },
      alignment: { horizontal: 'center' }
    };
    // Merge title cell across columns
    if(!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: {r:0, c:0}, e: {r:0, c:1} });
    
    // Set header styles
    ['A3', 'A10', 'A19'].forEach(cellRef => {
      if(ws[cellRef]) {
        ws[cellRef].s = { 
          font: { bold: true, sz: 14 },
          fill: { fgColor: { rgb: "DDDDDD" } }
        };
      }
    });
    
    ['A4', 'A11', 'A20', 'B4', 'B11', 'B20'].forEach(cellRef => {
      if(ws[cellRef]) {
        ws[cellRef].s = { 
          font: { bold: true },
          fill: { fgColor: { rgb: "EEEEEE" } }
        };
      }
    });
    
    XLSX.utils.book_append_sheet(wb, ws, 'Báo Cáo Dashboard');
    
    // Save file
    XLSX.writeFile(wb, `Bao_Cao_Dashboard_${selectedYear}.xlsx`);
  };

  return (
    <div className="dashboard-page">
      <Row gutter={[16, 16]} style={{ padding: '20px', backgroundColor: '#F9FBFD' }}>
        <Col span={12}>
          <h2>Dashboard {selectedYear}</h2>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Select 
            defaultValue={selectedYear} 
            style={{ width: 120, marginRight: 16 }} 
            onChange={handleYearChange}
          >
            {years.map(year => (
              <Select.Option key={year} value={year}>{year}</Select.Option>
            ))}
          </Select>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={exportToExcel}
          >
            Xuất Excel
          </Button>
        </Col>
        <Col xxl={8} xl={8} lg={12} md={12} sm={24} xs={24}>
          <Card bordered={false} className="dashboard-card">
            <div className="dashboard-card__content">
              <div className="dashboard-card__icon">
                <DollarTwoTone />
              </div>
              <div className="dashboard-card__info">
                <Revenue year={selectedYear} ref={revenueRef} />
                <p>Tổng thu nhập</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xxl={8} xl={8} lg={12} md={12} sm={24} xs={24}>
          <Card bordered={false} className="dashboard-card">
            <div className="dashboard-card__content">
              <div className="dashboard-card__icon">
                <ProfileTwoTone />
              </div>
              <div className="dashboard-card__info">
                <BookedCount year={selectedYear} ref={bookedRef} />
                <p>Số lượng đơn đặt phòng</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xxl={8} xl={8} lg={24} xs={24}>
          <Card bordered={false} className="dashboard-card">
            <div className="dashboard-card__content">
              <div className="dashboard-card__icon">
                <ContactsTwoTone />
              </div>
              <div className="dashboard-card__info">
                <RoomCount ref={roomCountRef} />
                <p>Số lượng phòng</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ padding: '0 20px 20px', backgroundColor: '#F9FBFD' }}>
        <Col xxl={12} xl={24} lg={24} md={24} sm={24} xs={24}>
          <CustomerArea year={selectedYear} ref={customerChartRef} />
        </Col>
        <Col xxl={12} xl={24} lg={24} md={24} sm={24} xs={24}>
          <HotelPie year={selectedYear} ref={hotelChartRef} />
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;