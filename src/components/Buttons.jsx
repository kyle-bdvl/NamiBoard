export default function Button({ children, row=true, ...props }) {
  const baseStyles =
    "w-40 py-1.5 px-3 cursor-pointer bg-blue-500 text-white rounded-md duration-200 gap-[10px] hover:bg-blue-700 hover:drop-shadow-sm";

  const directionStyle = row
    ? "flex flex-row justify-center items-center"
    : "flex flex-col justify-center items-center";

  const styles = `${baseStyles} ${directionStyle}`;

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
}
