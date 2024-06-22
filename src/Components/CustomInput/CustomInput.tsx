export function CustomInput({ title, labelProps, inputProps }: any) {
  return (
    <label {...labelProps}>
      {title}
      <input {...inputProps} />
    </label>
  );
}
