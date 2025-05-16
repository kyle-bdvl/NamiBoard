export default function Input({label, textarea, ref, ...props}){ 
  const classes =
    'w-full p-1 border-b-2 rounded-sm border-stone-300 bg-stone-200 text-stone-600 focus:outline-none focus:border-stone-600';
  return (
    <p className="flex flex-col gap-1 my-4">
      <label lassName="text-sm font-bold uppercase text-stone-500">{label}</label>
      {textarea ? (<textarea ref={ref} className={classes} {...props}></textarea>):
      <input  ref={ref} className={classes} {...props}/>
}
    </p>
  );
}