function success(res, data = {}, message = 'Success', status = 200) {
  return res.status(status).json({ success: true, message, ...data })
}

function paginated(res, { data, total, page, limit }) {
  return res.json({
    success: true,
    data,
    pagination: {
      total,
      page:  parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  })
}

module.exports = { success, paginated }
