import dashboardService from '../services/dashboardService';

const dashboardController = {
  getTotalRevenue: async (req, res) => {
    try {
      const year = req.query.year || new Date().getFullYear();
      const result = await dashboardService.getTotalRevenue(year);
      return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (err) {
      console.error('Error in getTotalRevenue controller:', err);
      return res.status(500).json({
        EM: 'Lỗi từ server',
        EC: -1,
        DT: 0
      });
    }
  },

  getRoomCount: async (req, res) => {
    try {
      const result = await dashboardService.getRoomCount();
      return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (err) {
      console.error('Error in getRoomCount controller:', err);
      return res.status(500).json({
        EM: 'Lỗi từ server',
        EC: -1,
        DT: 0
      });
    }
  },

  getCustomerRegisterByMonth: async (req, res) => {
    try {
      const year = req.query.year || new Date().getFullYear();
      const result = await dashboardService.getCustomerRegisterByMonth(year);
      return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (err) {
      console.error('Error in getCustomerRegisterByMonth controller:', err);
      return res.status(500).json({
        EM: 'Lỗi từ server',
        EC: -1,
        DT: []
      });
    }
  },

  getRevenueByHotel: async (req, res) => {
    try {
      const year = req.query.year || new Date().getFullYear();
      const result = await dashboardService.getRevenueByHotel(year);
      return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (err) {
      console.error('Error in getRevenueByHotel controller:', err);
      return res.status(500).json({
        EM: 'Lỗi từ server',
        EC: -1,
        DT: []
      });
    }
  },

  getBookingCount: async (req, res) => {
    try {
      const year = req.query.year || new Date().getFullYear();
      const result = await dashboardService.getBookingCount(year);
      return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (err) {
      console.error('Error in getBookingCount controller:', err);
      return res.status(500).json({
        EM: 'Lỗi từ server',
        EC: -1,
        DT: 0
      });
    }
  },

};

export default dashboardController; 