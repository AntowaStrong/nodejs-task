const { UserModel } = require('../models')



module.exports = {
  login: async (request, response) => {
    //request. 



    

    





    response.status(200).json({
      success: true,
      data: {
        token: null,
        refresh: null
      }
    })
  },
  logup: (request, response) => {




  },
  logout: (request, response) => {

  },
  refresh: (request, response) => {

  }
}