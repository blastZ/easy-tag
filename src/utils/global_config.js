import { blue, blueGrey } from 'material-ui/colors';

const Theme = [
  {
    MAIN: blue[500],
    BUTTON: blue[700],
    TEXT: blueGrey[700],
    BAR: blue[200]
  }
]

const theme = Theme[0];

export const Color = {
  MAIN: theme.MAIN,
  BUTTON: theme.BUTTON,
  TEXT: theme.TEXT,
  BAR: theme.BAR
}

export let DEFAULT_URL = 'http://demo.codvision.com:16831/api/';
export let DEFAULT_TAGED_NUM = 100;
export let DEFAULT_TAGED_PROGRESS = 0.1;
export let DEFAULT_TAG_SIZE = 10;
export let VERSION = "1.1.3";

export const setParams = (params, value) => {
  switch (params) {
    case 'url': {
      DEFAULT_URL = value;
      localStorage.setItem('DEFAULT_URL', DEFAULT_URL);
      break;
    }
    case 'taged-num': {
      DEFAULT_TAGED_NUM = value;
      localStorage.setItem('DEFAULT_TAGED_NUM', DEFAULT_TAGED_NUM);
      break;
    }
    case 'taged-progress': {
      DEFAULT_TAGED_PROGRESS = value;
      localStorage.setItem('DEFAULT_TAGED_PROGRESS', DEFAULT_TAGED_PROGRESS);
      break;
    }
    case 'tag-size': {
      DEFAULT_TAG_SIZE = value;
      localStorage.setItem('DEFAULT_TAG_SIZE', DEFAULT_TAG_SIZE);
      break;
    }
  }
}
