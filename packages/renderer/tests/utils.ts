export const attendreQue = (f: () => boolean): Promise<void> => {
  return new Promise(résoudre => {
    if (f()) résoudre();
    const oublier = setInterval(() => {
      if (f()) {
        clearInterval(oublier);
        résoudre();
      }
    }, 100);
  });
};
