const dateOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export default function date(rawdate) {
  return new Date(rawdate).toLocaleDateString('ru-RU', dateOptions);
}

