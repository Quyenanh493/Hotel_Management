import { Op } from "sequelize";
import db from "../models/index";
import bcrypt from "bcryptjs";
import authMiddleware from "../middleware/authMiddleware";

// Sử dụng phiên bản bất đồng bộ của bcrypt
const hashUserPassword = async (userPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(userPassword, salt);
  return hashPassword;
}

const checkEmailExist = async (userEmail) => {
  let user = await db.Account.findOne({
    where: { email: userEmail }
  });

  return !!user;
}

const checkPhoneExist = async (userPhone) => {
  let user = await db.Customer.findOne({
    where: { phoneNumber: userPhone }
  });

  return !!user;
}

const registerNewUser = async (rawUserData) => {
  try {
    // check email exist
    let isEmailExist = await checkEmailExist(rawUserData.email);
    if (isEmailExist) {
      return {
        EM: 'Email đã tồn tại trong hệ thống',
        EC: 1,
        DT: ''
      }
    }
    
    // check phone exist
    let isPhoneExist = await checkPhoneExist(rawUserData.phone);
    if (isPhoneExist) {
      return {
        EM: 'Số điện thoại đã tồn tại trong hệ thống',
        EC: 1,
        DT: ''
      }
    }
    
    let imageUrl = rawUserData.image || '';
    
    // Tạo transaction để đảm bảo tính nhất quán dữ liệu
    const result = await db.sequelize.transaction(async (t) => {
      // Tạo account mới
      let hashPassword = await hashUserPassword(rawUserData.password);
      let newAccount = await db.Account.create({
        email: rawUserData.email,
        password: hashPassword,
        accountType: 'customer',
        accountStatus: true
      }, { transaction: t });

      // Tạo customer mới liên kết với account
      if (newAccount) {
        const newCustomer = await db.Customer.create({
          accountId: newAccount.accountId,
          customerName: rawUserData.name || '',
          phoneNumber: rawUserData.phone,
          email: rawUserData.email,
          address: rawUserData.address || '',
          birthday: rawUserData.birthday || null,
          idNumber: rawUserData.idNumber || '',
          customerNote: rawUserData.note || '',
          customerImage: imageUrl 
        }, { transaction: t });
        
        console.log("Created new customer with image URL:", imageUrl);
        return { newAccount, newCustomer };
      }

      return { newAccount };
    });

    if (result) {
      // Generate JWT tokens
      const accessToken = authMiddleware.generateToken(result.newAccount.accountId, 'customer');
      const refreshToken = authMiddleware.generateRefreshToken(result.newAccount.accountId, 'customer');
      
      return {
        EM: 'Đăng ký tài khoản thành công',
        EC: 0,
        DT: { 
          accessToken,
          refreshToken
        }
      }
    }

    return {
      EM: 'Đăng ký tài khoản thất bại',
      EC: 1,
      DT: ''
    }
  } catch (error) {
    // Cải thiện logging
    console.error('Error in registerNewUser:', error);
    return {
      EM: 'Có lỗi xảy ra trong quá trình đăng ký',
      EC: -2,
      DT: ''
    }
  }
}

const checkPassword = async (inputPassword, hashPassword) => {
  return await bcrypt.compare(inputPassword, hashPassword);
}

const handleUserLogin = async (rawData) => {
  try {
    console.log("rawData:", rawData);
    // Tìm account với email
    let account = await db.Account.findOne({
      where: {
        email: rawData.valueLogin
      }
    });

    // Nếu không tìm thấy bằng email, thử tìm customer với số điện thoại
    if (!account) {
      let customer = await db.Customer.findOne({
        where: { phoneNumber: rawData.valueLogin },
        include: [{ model: db.Account }]
      });
      
      if (customer && customer.Account) {
        account = customer.Account;
      }
    }

    // Kiểm tra tài khoản và mật khẩu
    if (account) {
      // Kiểm tra trạng thái tài khoản trước khi kiểm tra mật khẩu
      if (!account.accountStatus) {
        return {
          EM: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với quản trị viên để được hỗ trợ.',
          EC: 2, // Mã lỗi riêng cho tài khoản bị khóa
          DT: ''
        }
      }

      let isCorrectPassword = await checkPassword(rawData.password, account.password);
      if (isCorrectPassword) {
        // Lấy thông tin user hoặc customer
        let userData = null;
        
        if (account.accountType === 'staff' || account.accountType === 'admin') {
          userData = await db.User.findOne({
            where: { accountId: account.accountId },
            attributes: { exclude: ['password'] },
            include: [{ 
              model: db.Role,
              attributes: ['roleId', 'roleName', 'description'] 
            }]
          });
        } else {
          userData = await db.Customer.findOne({
            where: { accountId: account.accountId },
            attributes: { exclude: ['accountId'] }
          });
        }
        
        // Cập nhật thời gian đăng nhập
        await account.update({ lastLogin: new Date() });
        
        // Generate JWT tokens
        const token = authMiddleware.generateToken(account.accountId, account.accountType);
        const refreshToken = authMiddleware.generateRefreshToken(account.accountId, account.accountType);
        
        // Trả về thông tin người dùng (không bao gồm mật khẩu)
        let userInfo = {
          accountId: account.accountId,
          email: account.email,
          accountType: account.accountType,
          userData: userData,
          accessToken: token,
          refreshToken: refreshToken
        };
        
        return {
          EM: 'Đăng nhập thành công',
          EC: 0,
          DT: userInfo
        }
      }
    }
    
    return {
      EM: 'Email/Số điện thoại hoặc mật khẩu không chính xác',
      EC: 1,
      DT: ''
    }

  } catch (error) {
    console.error('Error in handleUserLogin:', error.message);
    return {
      EM: 'Có lỗi xảy ra trong quá trình đăng nhập',
      EC: -2,
      DT: ''
    }
  }
}

module.exports = {
  registerNewUser,
  handleUserLogin
}