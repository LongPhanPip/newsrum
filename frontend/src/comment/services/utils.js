export const timeToNow = (string) => {
  const TIME_LEVEL = [60, 60, 24, 30, 12];
  const TIME_STR_LEVEL = ['giây', 'phút', 'giờ', 'ngày', 'tháng', 'năm'];
  const now =  Date.now();
  const time = Date.parse(string);
  let diff = (now - time) / 1000;

  let index = 0;
  while(true) {
    if(Math.floor(diff / TIME_LEVEL[index]) > 0) {
      diff /= TIME_LEVEL[index];
    }
    else {
      break;
    }
    index++;
  }
  return (Math.floor(diff) > 0 ? Math.floor(diff) : 0) + ' ' + TIME_STR_LEVEL[index] + ' trước';

}
