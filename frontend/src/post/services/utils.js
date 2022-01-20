import emoji from 'emoji-dictionary';

export const dateFormat = (string) => {
  return new Date(string).toGMTString()
}

export const emojiSupport = (text) => {
  return text.replace(/:\w+:/gi, name => emoji.getUnicode(name))
}
