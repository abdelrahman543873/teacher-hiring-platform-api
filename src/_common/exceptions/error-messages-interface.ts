enum lang {
  EN = 'EN',
  AR = 'AR'
}

export type IErrorMessage = {
  [k: number]: {
    [lang.AR]: string;
    [lang.EN]: string;
  };
};
