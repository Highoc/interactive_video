const dateOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

export default function date(rawdate) {
  return new Date(rawdate).toLocaleDateString('en-EN', dateOptions);
}

