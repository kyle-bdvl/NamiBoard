import { useRef } from 'react';
import Input from './Input.jsx';
export default function createKanbanBoard({onAdd, onCancel}) {
  const title = useRef();
  const objective = useRef();
  const dueDate = useRef();

  // Having a function to take the values from the useRef 
  function handleSave(){
    let enteredTitle = title.current.value;
    let enteredObjective = objective.current.value; 
    let enteredDueDate = dueDate.current.value;
    
    onAdd({
      title:enteredTitle,
      objective:enteredObjective,
      dueDate:enteredDueDate
    })
  }

  return (
    <div>
      <menu>
        <li>
          <button onClick={handleSave}>
            Save
          </button>
        </li>
        <li>
          <button onClick={onCancel}>
            cancel
          </button>
        </li>
      </menu>
      <div>
        <Input type="text" ref={title} label={'Title'} />
        <Input textarea ref={objective} label={'Objective'}/>
        <Input type="date" ref={dueDate} label={'Date'}/>
      </div>
    </div>
  );
}