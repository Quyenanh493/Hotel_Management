'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Hotel', [ // Sửa tên bảng thành 'Hotel'
      {
        hotelName: 'Grand Plaza Hotel',
        openDay: new Date('2018-01-15'),
        address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        hotelStatus: true,
        hotelType: 'Luxury',
        hotelImage: 'grand_plaza.jpg',
        hotelImages: JSON.stringify(['grand_plaza.jpg', 'grand_plaza.jpg', 'grand_plaza.jpg', 'grand_plaza.jpg']),
        description: 'Khách sạn 5 sao sang trọng tại trung tâm Thành phố Hồ Chí Minh',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Riverside Resort',
        openDay: new Date('2019-05-20'),
        address: '45 Trần Phú, Quận Hải Châu, Đà Nẵng',
        hotelStatus: true,
        hotelType: 'Resort',
        hotelImage: 'riverside_resort.jpg',
        hotelImages: JSON.stringify(['riverside_resort.jpg', 'riverside_resort.jpg', 'riverside_resort.jpg', 'riverside_resort.jpg']),
        description: 'Khu nghỉ dưỡng ven sông với tầm nhìn tuyệt đẹp ra biển Đà Nẵng',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Capital Suites',
        openDay: new Date('2017-11-10'),
        address: '78 Lý Thường Kiệt, Quận Hoàn Kiếm, Hà Nội',
        hotelStatus: true,
        hotelType: 'Business',
        hotelImage: 'capital_suites.jpg',
        hotelImages: JSON.stringify(['capital_suites.jpg', 'capital_suites.jpg', 'capital_suites.jpg', 'capital_suites.jpg']),
        description: 'Khách sạn dành cho doanh nhân với đầy đủ tiện nghi hiện đại',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Ocean View Hotel',
        openDay: new Date('2020-02-28'),
        address: '15 Trần Phú, TP. Nha Trang, Khánh Hòa',
        hotelStatus: true,
        hotelType: 'Beach Resort',
        hotelImage: 'ocean_view.jpg',
        hotelImages: JSON.stringify(['ocean_view.jpg', 'ocean_view.jpg', 'ocean_view.jpg', 'ocean_view.jpg']),
        description: 'Khách sạn hướng biển với bãi biển riêng tại Nha Trang',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Mountain Retreat',
        openDay: new Date('2019-12-05'),
        address: '28 Nguyễn Chí Thanh, TP. Đà Lạt, Lâm Đồng',
        hotelStatus: true,
        hotelType: 'Boutique',
        hotelImage: 'mountain_retreat.jpg',
        hotelImages: JSON.stringify(['mountain_retreat.jpg', 'mountain_retreat.jpg', 'mountain_retreat.jpg', 'mountain_retreat.jpg']),
        description: 'Khách sạn boutique yên tĩnh giữa núi đồi Đà Lạt',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'City Comfort Inn',
        openDay: new Date('2021-03-15'),
        address: '56 Lê Lợi, Quận 1, TP.HCM',
        hotelStatus: true,
        hotelType: 'Budget',
        hotelImage: 'city_comfort.jpg',
        hotelImages: JSON.stringify(['city_comfort.jpg', 'city_comfort.jpg', 'city_comfort.jpg', 'city_comfort.jpg']),
        description: 'Khách sạn giá rẻ nhưng đầy đủ tiện nghi tại trung tâm thành phố',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Heritage Palace',
        openDay: new Date('2018-07-22'),
        address: '101 Phan Chu Trinh, Quận Hoàn Kiếm, Hà Nội',
        hotelStatus: true,
        hotelType: 'Historic',
        hotelImage: 'heritage_palace.jpg',
        hotelImages: JSON.stringify(['heritage_palace.jpg', 'heritage_palace.jpg', 'heritage_palace.jpg', 'heritage_palace.jpg']),
        description: 'Khách sạn mang phong cách kiến trúc cổ điển Hà Nội',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Sunset Bay Resort',
        openDay: new Date('2020-11-30'),
        address: '23 Võ Nguyên Giáp, Phú Quốc, Kiên Giang',
        hotelStatus: true,
        hotelType: 'Beach Resort',
        hotelImage: 'sunset_bay.jpg',
        hotelImages: JSON.stringify(['sunset_bay.jpg', 'sunset_bay.jpg', 'sunset_bay.jpg', 'sunset_bay.jpg']),
        description: 'Khu nghỉ dưỡng với tầm nhìn hoàng hôn tuyệt đẹp tại Phú Quốc',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Business Tower Hotel',
        openDay: new Date('2019-09-18'),
        address: '88 Nguyễn Văn Linh, Quận 7, TP.HCM',
        hotelStatus: true,
        hotelType: 'Business',
        hotelImage: 'business_tower.jpg',
        hotelImages: JSON.stringify(['business_tower.jpg', 'business_tower.jpg', 'business_tower.jpg', 'business_tower.jpg']),
        description: 'Khách sạn cao cấp dành cho doanh nhân tại khu vực Phú Mỹ Hưng',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Highland Retreat',
        openDay: new Date('2022-01-10'),
        address: '15 Hùng Vương, TP. Sapa, Lào Cai',
        hotelStatus: true,
        hotelType: 'Mountain Resort',
        hotelImage: 'highland_retreat.jpg',
        hotelImages: JSON.stringify(['highland_retreat.jpg', 'highland_retreat.jpg', 'highland_retreat.jpg', 'highland_retreat.jpg']),
        description: 'Khu nghỉ dưỡng trên cao với tầm nhìn ra thung lũng Sapa',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Thêm khách sạn TP.HCM
      {
        hotelName: 'Saigon Pearl Hotel',
        openDay: new Date('2020-06-15'),
        address: '92 Nguyễn Huệ, Quận 1, TP.HCM',
        hotelStatus: true,
        hotelType: 'Luxury',
        hotelImage: 'saigon_pearl.jpg',
        hotelImages: JSON.stringify(['saigon_pearl.jpg', 'saigon_pearl.jpg', 'saigon_pearl.jpg', 'saigon_pearl.jpg']),
        description: 'Khách sạn cao cấp tại trung tâm Sài Gòn với thiết kế hiện đại',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Landmark 81 Suites',
        openDay: new Date('2021-03-20'),
        address: '208 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM',
        hotelStatus: true,
        hotelType: 'Premium',
        hotelImage: 'landmark81.jpg',
        hotelImages: JSON.stringify(['landmark81.jpg', 'landmark81.jpg', 'landmark81.jpg', 'landmark81.jpg']),
        description: 'Căn hộ khách sạn sang trọng tại tòa nhà cao nhất Việt Nam',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Ben Thanh Premium Hotel',
        openDay: new Date('2019-11-05'),
        address: '136 Lê Thị Hồng Gấm, Quận 1, TP.HCM',
        hotelStatus: true,
        hotelType: 'Business',
        hotelImage: 'benthanh_premium.jpg',
        hotelImages: JSON.stringify(['benthanh_premium.jpg', 'benthanh_premium.jpg', 'benthanh_premium.jpg', 'benthanh_premium.jpg']),
        description: 'Khách sạn cao cấp gần chợ Bến Thành và nhà hát thành phố',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Bitexco Sky Hotel',
        openDay: new Date('2020-09-12'),
        address: '45 Hai Bà Trưng, Quận 1, TP.HCM',
        hotelStatus: true,
        hotelType: 'Luxury',
        hotelImage: 'bitexco_sky.jpg',
        hotelImages: JSON.stringify(['bitexco_sky.jpg', 'bitexco_sky.jpg', 'bitexco_sky.jpg', 'bitexco_sky.jpg']),
        description: 'Khách sạn trên cao với tầm nhìn panorama toàn thành phố',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Saigon Riverside Hotel',
        openDay: new Date('2018-08-25'),
        address: '18 Tôn Đức Thắng, Quận 1, TP.HCM',
        hotelStatus: true,
        hotelType: 'Resort',
        hotelImage: 'saigon_riverside.jpg',
        hotelImages: JSON.stringify(['saigon_riverside.jpg', 'saigon_riverside.jpg', 'saigon_riverside.jpg', 'saigon_riverside.jpg']),
        description: 'Khách sạn ven sông Sài Gòn với không gian yên tĩnh giữa lòng thành phố',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Thêm khách sạn Hà Nội
      {
        hotelName: 'Hanoi Golden Palace',
        openDay: new Date('2019-04-18'),
        address: '47 Hàng Bạc, Hoàn Kiếm, Hà Nội',
        hotelStatus: true,
        hotelType: 'Boutique',
        hotelImage: 'hanoi_golden.jpg',
        hotelImages: JSON.stringify(['hanoi_golden.jpg', 'hanoi_golden.jpg', 'hanoi_golden.jpg', 'hanoi_golden.jpg']),
        description: 'Khách sạn boutique trong khu phố cổ Hà Nội',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Lotte Center Hanoi Hotel',
        openDay: new Date('2020-12-10'),
        address: '54 Liễu Giai, Ba Đình, Hà Nội',
        hotelStatus: true,
        hotelType: 'Luxury',
        hotelImage: 'lotte_hanoi.jpg',
        hotelImages: JSON.stringify(['lotte_hanoi.jpg', 'lotte_hanoi.jpg', 'lotte_hanoi.jpg', 'lotte_hanoi.jpg']),
        description: 'Khách sạn 5 sao trong tòa nhà Lotte Center với dịch vụ đẳng cấp quốc tế',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Old Quarter Heritage Hotel',
        openDay: new Date('2017-07-30'),
        address: '25 Hàng Gai, Hoàn Kiếm, Hà Nội',
        hotelStatus: true,
        hotelType: 'Historic',
        hotelImage: 'old_quarter.jpg',
        hotelImages: JSON.stringify(['old_quarter.jpg', 'old_quarter.jpg', 'old_quarter.jpg', 'old_quarter.jpg']),
        description: 'Khách sạn mang đậm nét kiến trúc cổ trong tim phố cổ Hà Nội',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'West Lake Luxury Resort',
        openDay: new Date('2021-05-22'),
        address: '58 Quảng An, Tây Hồ, Hà Nội',
        hotelStatus: true,
        hotelType: 'Resort',
        hotelImage: 'west_lake.jpg',
        hotelImages: JSON.stringify(['west_lake.jpg', 'west_lake.jpg', 'west_lake.jpg', 'west_lake.jpg']),
        description: 'Khu nghỉ dưỡng cao cấp bên hồ Tây với không gian xanh mát',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Hanoi Opera House Hotel',
        openDay: new Date('2018-03-14'),
        address: '29 Tràng Tiền, Hoàn Kiếm, Hà Nội',
        hotelStatus: true,
        hotelType: 'Premium',
        hotelImage: 'opera_house.jpg',
        hotelImages: JSON.stringify(['opera_house.jpg', 'opera_house.jpg', 'opera_house.jpg', 'opera_house.jpg']),
        description: 'Khách sạn sang trọng đối diện nhà hát lớn Hà Nội',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Hotel', null, { // Sửa tên bảng thành 'Hotel'
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  }
};