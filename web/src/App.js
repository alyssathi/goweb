import { React, useRef, useState } from "react";

function App() {
	const nameRef = useRef();
	const passwordRef = useRef();
	const idRef = useRef();

	const [name, setName] = useState("Loading...");
	const [password, setPassword] = useState("Loading...");
	const [error, setError] = useState("");

	async function handlePost(e) {
		e.preventDefault();
		setError("");
		if (nameRef.current.value.trim() === "" || password.current.value.trim() === "") {
			setError("You are trying to POST. Please enter some characters into the name and password fields.");
			return;
		}
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

	async function handleGet(e) {
		e.preventDefault();
		setError("");
		if (idRef.current.value.trim() === "") {
			setError("You are trying to GET. Please enter a number into the id field.");
			return;
		}
		try {
			const response = await fetch(`/api/getUser/${idRef.current.value}`, {
				method: "GET",
				headers: { "content-type": "application/json" },
			});
			const data = await response.json();
			console.log(data);
			setName(data.name);
			setPassword(data.password);
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<div className="App">
			<div style={{ display: "flex", flexDirection: "column" }}>
				ID (number): <input type="number" ref={idRef} />
				Name: <input ref={nameRef} />
				Password: <input ref={passwordRef} />
			</div>
			<div>
				<button onClick={handlePost}>POST</button>
				<button onClick={handlePut}>PUT/UPDATE</button>
				<button onClick={handleGet}>GET</button>
			</div>
			<div>
				<p>{error}</p>
			</div>
			<div>
				Your name is: {name} and your password is: {password}. This isn't secure get over it.
			</div>
		</div>
	);
}

export default App;
