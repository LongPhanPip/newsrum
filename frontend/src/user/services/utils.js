export const get_post_status = (status) => {
  if (status === 'P')
    return 'Chờ kiểm duyệt';
  else if (status === 'A')
    return 'Đã xác nhận';
}

export const date_format = (string) => {
  return new Date(string).toLocaleString()
}
