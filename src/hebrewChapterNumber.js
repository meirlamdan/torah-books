const let1000 = [" א'", " ב'", " ג'", " ד'", " ה'"];
const let100 = ["ק", "ר", "ש", "ת"];
const let10 = ["י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
const let1 = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];

function convertToHebrewLetters(num) {
  if (num <= 0 || num >= 6000) {
    throw new Error();
  }

  let ret = "";

  if (num >= 100) {
    if (num >= 1000 && num < 6000) {
      ret += let1000[Math.floor(num / 1000) - 1];
      num %= 1000;
    }

    if (num < 500) {
      ret += let100[Math.floor(num / 100) - 1];
    } else if (num >= 500 && num < 900) {
      ret += "ת";
      ret += let100[Math.floor((num - 400) / 100) - 1];
    } else if (num >= 900 && num < 1000) {
      ret += "תת";
      ret += let100[Math.floor((num - 800) / 100) - 1];
    }

    num %= 100;
  }

  switch (num) {
    case 16:
      ret += "טז";
      break;
    case 15:
      ret += "טו";
      break;
    default:
      if (num >= 10) {
        ret += let10[Math.floor(num / 10) - 1];
        num %= 10;
      }
      if (num > 0) {
        ret += let1[num - 1];
      }
      break;
  }

  return ret;
}

function hebrewChapterNumber(num, chapter) {
  chapter = chapter === 'Chapter' ? 'פרק' : chapter === 'Daf' ? 'דף' : '';
  if (chapter === 'דף') {
    if (num % 2 === 1) {
      num = Math.floor(num / 2) + 1;
    } else {
      num = num / 2;
      return `${chapter} ${convertToHebrewLetters(num)} ע"ב`
    }
  }
  return `${chapter} ${convertToHebrewLetters(num)}`
}

export default hebrewChapterNumber

