import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const TIMEZONE = 'Asia/Bangkok'

export const formatDate = (date, format = 'DD/MM/YYYY') => {
  return date ? dayjs.utc(date).tz(TIMEZONE).format(format) : 'N/A'
}

export const isOverdue = (dueDate, returnDate) => {
  return returnDate && dayjs(returnDate).isAfter(dayjs(dueDate))
}
