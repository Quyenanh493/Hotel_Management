let handleLogin = (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameters"
    })
  }

  return res.status(200).json({
    errCode: 0,
    message: "helloworld",
    yourEmail: email,
    test: 'test'
  });
}

module.exports = {
  handleLogin: handleLogin
}