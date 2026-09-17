<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';

	let email = '';
	let password = '';
	let confirmPassword = '';
	let notice = '';
	let step = 'email'; // 'login' or 'signup'

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && window.location.hash === '#login') {
			window.location.hash = '';
			clearFormData();
		}
	}

	function clearFormData() {
		password = '';
		confirmPassword = '';
		step = 'email';
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- {#snippet formInput(id: string, type: string, bindE: variable, placeholder: string)}
	<label for={id}>Email</label>
	<input {id} {type} name={id} bind:value={bindE} placeholder={placeholder} required />
{/snippet} -->

<Modal hash="login">
		<h1>Join the Nest</h1>
		<h2>Log in into your account</h2>
		<hr />
		{#if step === 'email'}
			<form method="POST" action="?/checkUser" use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success' && result.data)
						if (result.data.exists) step = 'login';
						else step = 'signup';
					else if (result.type === 'failure')
						notice = String(result.data?.error) || 'Please check your input and try again.';
					else
						notice = 'Something went wrong. Please try again.';
					}}}
			>
				<label for="email">Email</label>
				<input id="email" type="email" name="email" bind:value={email} placeholder="Enter your email address..." required />
				<button type="submit">Continue</button>
			</form>

		{:else if step === 'login'}
			<form method="POST" action="?/login">
				<label for="email">Email</label>
				<input id="email" type="email" name="email" bind:value={email} oninput={clearFormData} placeholder="Enter your email address..." required/>
				<label for="password">Password</label>
				<input id="password" type="password" name="password" bind:value={password} placeholder="Enter your password..." required/>
				<button type="submit">Login</button>
			</form>

		{:else if step === 'signup'}
			<form method="POST" action="?/signup" use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						if (result.data?.success)
							notice = 'Check your email to confirm your account!';
						else if (result.data?.error)
							notice = `Error: ${result.data.error}`;
					} else {
						console.log(result);
						notice = 'An unknown error occurred during sign up.';
					}
				}}}>
				<label for="email">Email</label>
				<input id="email" type="email" name="email" bind:value={email} oninput={clearFormData} placeholder="Enter your email address..." required/>
				<label for="password">Password</label>
				<input id="password" type="password" name="password" bind:value={password} placeholder="Enter your password..." required/>
				<label for="confirm-password">Confirm Pasword</label>
				<input id="confirm-password" type="password" name="confirm-password" bind:value={confirmPassword} placeholder="Confirm your password..." required/>
				<button type="submit">Sign Up</button>
			</form>
		{/if}
		<footer>
			{notice}
			By continuing, you acknowledge that you understand and agree to the Terms & Conditions and Privacy Policy
		</footer>

</Modal>

<style lang="postcss">
	h1 {
		font-size: 1.9rem;
		font-weight: 500;
		line-height: 2.3rem;
		color: var(--color-text-0);
	}

	h2 {
		font-size: 1.9rem;
		font-weight: 500;
		line-height: 2.3rem;
		color: var(--color-text-2);
	}

	hr {
		margin: 1rem 0;
		width: 100%;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	label {
		font-size: 1.2rem;
		font-weight: 500;
		color: var(--color-text-2);
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;

		input {
			border-radius: 8px;
			padding: 0.2rem 0.8rem;
			margin-bottom: 0.5rem;
			font-size: 1.5rem;
			outline: 1px solid rgba(255, 255, 255, 0.2);
		}

		input:focus {
			outline: 2px solid rgba(255, 255, 255, 0.4);
			box-shadow: 0 0 6px var(--color-accent-box-shadow);
		}
	}

	button {
		background-color: var(--color-accent);
		color: var(--color-text-0);
		margin-top: 1rem;
		padding: 0.4rem 0;
		font-size: 1.3rem;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	button:hover {
		background-color: var(--color-accent-dim);
		color: var(--color-text-1);
	}

	footer {
		margin-top: 1rem;
		font-size: 0.9rem;
		text-align: center;
		color: var(--color-text-2);
	}
</style>
