let handlingUnauthorized = false;

export const isHandlingUnauthorized = () => handlingUnauthorized;

export const startHandlingUnauthorized = () => {
  handlingUnauthorized = true;
};

export const resetUnauthorizedHandling = () => {
  handlingUnauthorized = false;
};
