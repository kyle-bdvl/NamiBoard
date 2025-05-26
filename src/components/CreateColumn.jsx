import Input from "./Input";
import {useRef} from 'react';
export default function CreateColumn({onAdd,done}){
  const columnTitle = useRef();

  function handleColumnTitle(){
    let enteredTitle = columnTitle.current.value;
     if(enteredTitle.trim()===''){
      alert("please insert value")
      return;
    }
    onAdd({title:enteredTitle})
    done();
  }

  return(
    <div>
      <Input label={"Column Name"} ref={columnTitle}/>
      <button onClick={handleColumnTitle}>Done</button>
    </div>
  )
}