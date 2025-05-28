export default function Button({ children, className, row=true, ...props }) {
  const baseStyles =
    "w-50 py-1.5 px-3 cursor-pointer bg-blue-500 text-black rounded-md duration-200 gap-[10px] hover:drop-shadow-sm";

  const directionStyle = row
    ? "flex flex-row justify-center items-center"
    : "flex flex-col justify-center items-center";

  const styles = `${baseStyles} ${directionStyle} ${className}`;

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
}
