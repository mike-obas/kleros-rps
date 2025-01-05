export const customErrorObj = (errs: any) => {
    const msgObj =
      errs?.error?.message
        ? errs
        : {
            isError: true,
            error: {
              message:
                "Something went wrong, ensure you have provided the right details.",
            },
          };
    return { msgObj };
  };
  