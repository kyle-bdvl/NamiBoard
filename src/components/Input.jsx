export default function Input({label, textarea, ref, theme, ...props}){ 
   let focusBorder = '';

  if (theme.title === 'bg-blue-900') {
    focusBorder = 'focus:border-blue-600';
  } else if (theme.title === 'bg-green-900') {
    focusBorder = 'focus:border-green-600';
  } else if (theme.title === 'bg-purple-900') {
    focusBorder = 'focus:border-purple-600';
  } else if (theme.title === 'bg-red-900') {
    focusBorder = 'focus:border-red-600';
  } else if (theme.title === 'bg-yellow-900') {
    focusBorder = 'focus:border-yellow-600';
  } else if (theme.title === 'bg-indigo-900') {
    focusBorder = 'focus:border-indigo-600';
  } else if (theme.title === 'bg-gray-900') {
    focusBorder = 'focus:border-gray-600';
  } else {
    focusBorder = 'focus:border-blue-600';
  }


  const classes =
    `w-full p-1 border-2 rounded-sm border-stone-200 bg-white text-stone-600 focus:outline-none ${focusBorder}`;
  return (
    <p className="flex flex-col gap-1 my-4">
      <label className="text-sm font-bold uppercase text-stone-500">{label}</label>
      {textarea ? (<textarea ref={ref} className={classes} {...props}></textarea>):
      <input maxLength="20" ref={ref} className={classes} {...props}/>
}
    </p>
  );
}