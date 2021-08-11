import { React, useRef } from "react";

function App() {
	const nameRef = useRef();
	const passwordRef = useRef();

	async function handlePOSTSubmit(e) {
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
	return (
		<div className="App">
			<div>
				<h3>Posting to DB</h3>
				<form onSubmit={handlePOSTSubmit}>
					Name: <input ref={nameRef} />
					Password: <input ref={passwordRef} />
					<button type="submit">Submit</button>
				</form>
			</div>
		</div>
	);
}

export default App;
