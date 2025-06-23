'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create sample reviews to match with the averageRating and totalReview values in rooms
    return queryInterface.bulkInsert('RoomReview', [
      // Reviews for room 1 (Deluxe King 101, averageRating: 4.0, totalReview: 5)
      {
        roomId: 1,
        customerId: 1,
        rating: 4,
        comment: 'Phòng rất đẹp và sạch sẽ. Tầm nhìn tuyệt vời ra thành phố. Nhân viên thân thiện và nhiệt tình.',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 1,
        customerId: 2,
        rating: 5,
        comment: 'Tuyệt vời! Phòng rộng rãi, giường cực kỳ thoải mái. Đã đặt nhiều lần và sẽ quay lại.',
        createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 1,
        customerId: 3,
        rating: 4,
        comment: 'Phòng rất tốt với giá cả hợp lý. Bữa sáng phong phú. Vị trí thuận tiện.',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 1,
        customerId: 4,
        rating: 3,
        comment: 'Phòng ổn, nhưng hơi ồn do gần đường lớn. Phục vụ tốt.',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 1,
        customerId: 5,
        rating: 4,
        comment: 'Không gian rộng rãi, sạch sẽ. WiFi nhanh. Sẽ quay lại lần sau.',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },

      // Reviews for room 2 (Superior Twin 102, averageRating: 3.0, totalReview: 3)
      {
        roomId: 2,
        customerId: 2,
        rating: 3,
        comment: 'Phòng nhỏ hơn tôi mong đợi nhưng đầy đủ tiện nghi cơ bản.',
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 2,
        customerId: 3,
        rating: 3,
        comment: 'Phòng sạch sẽ, nhân viên thân thiện nhưng phòng hơi ồn.',
        createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 2,
        customerId: 4,
        rating: 3,
        comment: 'Phòng đơn giản nhưng tiện nghi. Giá hợp lý cho chuyến công tác.',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      },

      // Reviews for room 3 (Executive Suite 103, averageRating: 5.0, totalReview: 8)
      {
        roomId: 3,
        customerId: 1,
        rating: 5,
        comment: 'Phòng Suite quá tuyệt vời! Không gian rộng rãi và sang trọng.',
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 3,
        customerId: 2,
        rating: 5,
        comment: 'Bồn tắm jacuzzi là điểm nhấn tuyệt vời. View đẹp và dịch vụ VIP hoàn hảo.',
        createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 3,
        customerId: 3,
        rating: 5,
        comment: 'Trải nghiệm 5 sao! Tôi đã có kỳ nghỉ tuyệt vời nhất từ trước đến nay.',
        createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 3,
        customerId: 4,
        rating: 5,
        comment: 'Phòng rất đẹp, sạch sẽ và tiện nghi. Nhân viên chu đáo và thân thiện.',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 3,
        customerId: 5,
        rating: 5,
        comment: 'Tuyệt vời, đáng đồng tiền bát gạo! Phòng rất rộng và view đẹp.',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 3,
        customerId: 1,
        rating: 5,
        comment: 'Đã quay lại nhiều lần và luôn hài lòng. Trải nghiệm hoàn hảo.',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 3,
        customerId: 2,
        rating: 5,
        comment: 'Thật tuyệt vời khi có cơ hội ở phòng này. Rất phù hợp cho kỳ nghỉ sang trọng.',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 3,
        customerId: 3,
        rating: 5,
        comment: 'Từ nội thất đến dịch vụ đều hoàn hảo. Rất hài lòng với trải nghiệm này.',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },

      // Reviews for room 4 (Garden View 201, averageRating: 4.0, totalReview: 4)
      {
        roomId: 4,
        customerId: 1,
        rating: 4,
        comment: 'View vườn rất đẹp và yên tĩnh. Phòng rộng rãi và thoải mái.',
        createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 4,
        customerId: 2,
        rating: 4,
        comment: 'Không gian xanh tuyệt vời. Rất thích khu vườn và tiếng chim hót buổi sáng.',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 4,
        customerId: 3,
        rating: 3,
        comment: 'Phòng tốt, view đẹp nhưng tiện nghi hơi cũ.',
        createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 4,
        customerId: 4,
        rating: 5,
        comment: 'Rất thích không gian yên tĩnh và gần gũi thiên nhiên. Sẽ quay lại!',
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000)
      },

      // Room 5: Ocean View 202 (averageRating: 5.0, totalReview: 6)
      {
        roomId: 5,
        customerId: 1,
        rating: 5,
        comment: 'View biển tuyệt đẹp, phòng rộng rãi và sang trọng. Tuyệt vời!',
        createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 5,
        customerId: 2,
        rating: 5,
        comment: 'Ban công nhìn ra biển là điểm nhấn tuyệt vời nhất.',
        createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 5,
        customerId: 3,
        rating: 5,
        comment: 'Phòng đẹp, view biển tuyệt vời, dịch vụ 5 sao.',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 5,
        customerId: 4,
        rating: 5,
        comment: 'Một trải nghiệm hoàn hảo cho kỳ nghỉ của tôi.',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 5,
        customerId: 5,
        rating: 5,
        comment: 'Đáng giá từng đồng! View biển tuyệt đẹp.',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 5,
        customerId: 1,
        rating: 5,
        comment: 'Tôi sẽ quay lại lần sau. Rất hài lòng với mọi thứ.',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      
      // Room 6: Business Room 301 (averageRating: 3.5, totalReview: 2)
      {
        roomId: 6,
        customerId: 1,
        rating: 3,
        comment: 'Phòng đáp ứng nhu cầu làm việc, nhưng hơi nhỏ so với giá cả.',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 6,
        customerId: 2,
        rating: 4,
        comment: 'Bàn làm việc rộng, ghế thoải mái, WiFi nhanh. Phù hợp cho công việc.',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      
      // Room 7: Family Room 302 (averageRating: 4.5, totalReview: 4)
      {
        roomId: 7,
        customerId: 3,
        rating: 5,
        comment: 'Tuyệt vời cho gia đình có trẻ nhỏ. Phòng rộng rãi và đầy đủ tiện nghi.',
        createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 7,
        customerId: 4,
        rating: 4,
        comment: 'Phòng rộng rãi, giường thoải mái, phù hợp cho gia đình 4 người.',
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 7,
        customerId: 5,
        rating: 4,
        comment: 'Không gian thoải mái cho cả gia đình. Nhân viên thân thiện với trẻ em.',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 7,
        customerId: 1,
        rating: 5,
        comment: 'Phòng rộng rãi, thiết kế thông minh, đáp ứng tốt nhu cầu của gia đình.',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      
      // Room 8: Beach Front 401 (averageRating: 5.0, totalReview: 7)
      {
        roomId: 8,
        customerId: 1,
        rating: 5,
        comment: 'Tuyệt vời! Ngủ dậy là ra biển ngay. View siêu đẹp vào buổi sáng.',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 8,
        customerId: 2,
        rating: 5,
        comment: 'Không thể tin là có phòng đẹp và gần biển như vậy. Tuyệt đối hài lòng.',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 8,
        customerId: 3,
        rating: 5,
        comment: 'Phòng sang trọng với view biển đẹp nhất mà tôi từng ở.',
        createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 8,
        customerId: 4,
        rating: 5,
        comment: 'Tiếng sóng biển vỗ vào bờ tạo cảm giác thư giãn tuyệt vời.',
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 8,
        customerId: 5,
        rating: 5,
        comment: 'Đắt xắt ra miếng! Đáng để trải nghiệm ít nhất một lần trong đời.',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 8,
        customerId: 1,
        rating: 5,
        comment: 'Tôi đã quay lại nhiều lần và vẫn luôn hài lòng.',
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 8,
        customerId: 2,
        rating: 5,
        comment: 'Phòng này xứng đáng với từng đồng bạn bỏ ra. Trải nghiệm tuyệt vời.',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      },
      
      // Room 9: Mountain View 501 (averageRating: 4.0, totalReview: 3)
      {
        roomId: 9,
        customerId: 3,
        rating: 4,
        comment: 'View núi Đà Lạt tuyệt đẹp, đặc biệt vào buổi sáng sớm.',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 9,
        customerId: 4,
        rating: 5,
        comment: 'Không khí trong lành, lò sưởi ấm áp vào buổi tối. Rất thích!',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 9,
        customerId: 5,
        rating: 3,
        comment: 'Phòng ổn, view đẹp nhưng hơi lạnh vào buổi đêm.',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      
      // Room 10: Standard Room 601 (averageRating: 3.0, totalReview: 2)
      {
        roomId: 10,
        customerId: 1,
        rating: 3,
        comment: 'Phòng đơn giản nhưng sạch sẽ. Phù hợp cho chuyến du lịch tiết kiệm.',
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: 10,
        customerId: 2,
        rating: 3,
        comment: 'Giá rẻ, tiện nghi cơ bản đầy đủ. Phù hợp cho khách doanh nhân.',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('RoomReview', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true, 
    });
  }
}; 