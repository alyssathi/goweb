import { React, useRef, useState } from "react";

function App() {
	const nameRef = useRef();
	const passwordRef = useRef();
	const idRef = useRef();

	const [name, setName] = useState("Loading...");
	const [password, setPassword] = useState("Loading...");

	async function handlePost(e) {
		e.preventDefault();
		try {
			await fetch("/api/createUser", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ name: nameRef.current.value, password: passwordRef.current.value }),
			});
		} catch (err) {
			console.log(err);
		}
	}

	async function handlePut(e) {
		e.preventDefault();
		if (idRef.current.value.trim() === "") return;
		try {
			await fetch("/api/updateUser", {
				method: "PUT",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ id: idRef.current.value, name: nameRef.current.value, password: passwordRef.current.value }),
			});
		} catch (err) {
			console.log(err);
		}
	}

	// async function handleGETSubmit(e) {
	// 	e.preventDefault();
	// 	try {
	// 		const response = await fetch("api/getUser");
	// 		const data = await response.json();
	// 		console.log(data);
	// 		setName(data.name);
	// 		setPassword(data.password);
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// }

	return (
		<div className="App">
			<div style={{ display: "flex", flexDirection: "column" }}>
				ID: <input ref={idRef} />
				Name: <input ref={nameRef} />
				Password: <input ref={passwordRef} />
			</div>
			<div>
				<button onClick={handlePost}>POST</button>
				<button onClick={handlePut}>PUT/UPDATE</button>
			</div>
		</div>
	);
}

export default App;
