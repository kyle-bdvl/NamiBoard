import { useState} from "react";    
import { useNavigate } from "react-router-dom";
function LoginPage({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

function handleSubmit(e){
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
        alert("Please fill in all fields");
        return;
    }
    else if (email=== "admin@gmail.com" && password === "12345") {
        onLogin();
    }
    else {
        alert ('Invalid email or password!');
        setEmail("");
        setPassword("");
        return;
    }
}
    return (
       <div className="flex items-center justify-center h-screen bg-gray-100">
         <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4 text-center">LOGIN</h2>
            <input type="text"
            placeholder="Please enter your email"
            className="border border-gray-300 p-2 mb-4 w-full rounded"
            // two way binding
            value={email} 
            onChange={(e)=>setEmail(e.target.value)}/>

            <input type="text"
            placeholder="Please enter your password"
            className="border border-gray-300 p-2 mb-4 w-full rounded"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}/> 
            <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
                Login
                </button>
                <div className="text-left mt-4">
                    <span className="text-blue-600 cursor-pointer underline"
                    onClick={()=> navigate("/signUp")}>
                        Don't have an account? Sign up
                    </span>
                </div>
        </form>
       </div>
    );
}
export default LoginPage;

// new comment is added 