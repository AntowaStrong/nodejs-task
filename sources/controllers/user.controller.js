module.exports = {
  info: (request, response) => {
    response.success({
      id: request.user.id
    })
  }
}