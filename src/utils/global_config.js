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

export const setParams = (params, value) => {
  switch (params) {
    case 'url': {
      DEFAULT_URL = value;
      break;
    }
    case 'taged-num': {
      DEFAULT_TAGED_NUM = value;
      break;
    }
    case 'taged-progress': {
      DEFAULT_TAGED_PROGRESS = value;
      break;
    }
  }
}
