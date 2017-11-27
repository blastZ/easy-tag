export let DEFAULT_URL = 'http://demo.codvision.com:16831/api/';
export let DEFAULT_TAGED_NUM = 100;
export let DEFAULT_TAGED_PROGRESS = 0.5;

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
