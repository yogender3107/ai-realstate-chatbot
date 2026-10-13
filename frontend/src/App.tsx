/** @format */

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
type Message = {
	id: string;
	role: 'user' | 'assistant';
	text: string;
	time: string;
};
const ideas = [
	'Find a 2 BHK apartment in Jaipur under ₹60 lakh',
	'Show available villas in Jaipur',
	'Find properties in Vaishali Nagar with 3 bedrooms',
];
const timeNow = () =>
	new Intl.DateTimeFormat(undefined, {
		hour: '2-digit',
		minute: '2-digit',
	}).format(new Date());

async function ask(message: string): Promise<string> {
	const res = await fetch(import.meta.env.VITE_GRAPHQL_URL || '/graphql', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			query:
				'query Ask($message:String!){askPropertyAssistant(message:$message)}',
			variables: { message },
		}),
	});
	if (!res.ok) throw new Error(`API request failed (${res.status})`);
	const json = (await res.json()) as {
		data?: { askPropertyAssistant?: string };
		errors?: { message: string }[];
	};
	if (json.errors?.length) throw new Error(json.errors[0].message);
	return (
		json.data?.askPropertyAssistant ||
		"I couldn't get a response. Please try again."
	);
}
export default function App() {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: 'welcome',
			role: 'assistant',
			text: "Hi! I'm your property assistant. Tell me the city, budget, bedrooms, or property type you're looking for. I'll search the database and only recommend matching listings.",
			time: timeNow(),
		},
	]);
	const [input, setInput] = useState(''),
		[loading, setLoading] = useState(false),
		[error, setError] = useState('');
	const bottom = useRef<HTMLDivElement>(null);
	useEffect(() => {
		bottom.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, loading]);
	async function send(raw: string) {
		const text = raw.trim();
		if (!text || loading) return;
		setInput('');
		setError('');
		setMessages((old) => [
			...old,
			{ id: crypto.randomUUID(), role: 'user', text, time: timeNow() },
		]);
		setLoading(true);
		try {
			const reply = await ask(text);
			setMessages((old) => [
				...old,
				{
					id: crypto.randomUUID(),
					role: 'assistant',
					text: reply,
					time: timeNow(),
				},
			]);
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Something went wrong.');
		} finally {
			setLoading(false);
		}
	}
	function submit(e: FormEvent) {
		e.preventDefault();
		void send(input);
	}
	function keydown(e: KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			void send(input);
		}
	}
	return (
		<main className='shell'>
			<aside className='sidebar'>
				<div className='brand'>
					<div className='mark'>⌂</div>
					<div>
						<b>Haven AI</b>
						<small>PROPERTY FINDER</small>
					</div>
				</div>
				<p className='label'>YOUR ASSISTANT</p>
				<div className='nav active'>✳ &nbsp; Property search</div>
				<div className='tip'>
					<div className='tip-icon'>⌕</div>
					<b>Search with your words</b>
					<p>
						Describe the home you want. I'll check real property records and
						explain the matches.
					</p>
				</div>
				<div className='side-footer'>
					<span className='dot' /> Database search
					<small>No embeddings required</small>
				</div>
			</aside>
			<section className='panel'>
				<header className='topbar'>
					<div className='mobile-brand'>
						<span className='mark'>⌂</span>
						<b>Haven AI</b>
					</div>
					<div className='status'>
						<span className='dot' />{' '}
						<div>
							Property assistant<small>Connected through GraphQL</small>
						</div>
					</div>
					<span className='pill'>✦ &nbsp; AI-powered</span>
				</header>
				<div className='conversation'>
					<section className='intro'>
						<div className='intro-mark'>⌂</div>
						<p className='eyebrow'>A BETTER WAY TO FIND HOME</p>
						<h1>
							Let's find your
							<br />
							<em>place in the world.</em>
						</h1>
						<p className='intro-copy'>
							Tell me what matters to you. I'll search available listings in the
							database and show you the ones that match.
						</p>
					</section>
					{messages.length === 1 && (
						<section className='ideas'>
							<p className='label'>TRY ASKING</p>
							{ideas.map((x) => (
								<button key={x} onClick={() => void send(x)} disabled={loading}>
									<span>↗</span>
									{x}
								</button>
							))}
						</section>
					)}
					<div className='messages'>
						{messages.map((m) => (
							<article className={`message ${m.role}`} key={m.id}>
								{m.role === 'assistant' && <div className='avatar'>⌂</div>}
								<div className='msg-body'>
									<div className='meta'>
										<b>{m.role === 'assistant' ? 'Haven AI' : 'You'}</b>
										<time>{m.time}</time>
									</div>
									<div className={`bubble ${m.role}`}>
										{m.text.split('\n').map((line, i) => (
											<p key={i}>{line || ' '}</p>
										))}
									</div>
								</div>
							</article>
						))}
						{loading && (
							<article className='message assistant'>
								<div className='avatar'>⌂</div>
								<div className='msg-body'>
									<div className='meta'>
										<b>Haven AI</b>
										<span>Searching properties…</span>
									</div>
									<div className='bubble typing'>
										<i />
										<i />
										<i />
									</div>
								</div>
							</article>
						)}
						<div ref={bottom} />
					</div>
					{error && (
						<div className='error'>
							{error} <button onClick={() => setError('')}>Dismiss</button>
						</div>
					)}
				</div>
				<footer className='composer-wrap'>
					<form className='composer' onSubmit={submit}>
						<textarea
							rows={1}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={keydown}
							placeholder='Describe your ideal property…'
							aria-label='Message property assistant'
							disabled={loading}
						/>
						<button
							className='send'
							type='submit'
							disabled={!input.trim() || loading}
							aria-label='Send'>
							↑
						</button>
					</form>
					<p className='disclaimer'>
						Suggestions use current database records. Confirm availability and
						details before making a decision.
					</p>
				</footer>
			</section>
		</main>
	);
}
