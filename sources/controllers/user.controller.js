module.exports = {
  info: (request, response) => {
    response.status(200).json({
      success: true,
      data: {
        id: request.user.id
      }
    })
  }
}