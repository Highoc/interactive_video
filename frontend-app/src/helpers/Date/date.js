const dateOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const timeOptions = {
  hour: 'numeric',
  minute: 'numeric',
};

export default function date(rawdate) {
  return new Date(rawdate).toLocaleDateString('ru-RU', dateOptions);
}

export function time(rawdate) {
  const info = new Date(rawdate).toLocaleDateString('ru-RU', timeOptions);
  const parsedinfo = info.split(',');
  return parsedinfo[1];
}
