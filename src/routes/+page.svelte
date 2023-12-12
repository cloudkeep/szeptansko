<script>
	// @ts-ignore
	let file;
	let text = '';
	let targetLanguage = 'en';
	let translatedText = '';
	let downloadUrl = '';
	let isSubmitting = false;
	let responseReceived = false;
	let errorMessage = '';

	async function handleSubmit() {
		const formData = new FormData();
		// @ts-ignore
		if (file) {
			formData.append('file', file);
		}
		formData.append('text', text);
		formData.append('target_language', targetLanguage);

		isSubmitting = true;
		responseReceived = false;
		errorMessage = '';

    try {
			const response = await fetch('https://szeptansko.devacat.com/translate/', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const result = await response.json();
				translatedText = result.translated_text;
				downloadUrl = `https://szeptansko.devacat.com/download/${result.file_path}`;
				responseReceived = true;
			} else {
				const errorResult = await response.text(); // Pobieranie treści błędu
				errorMessage = `Błąd podczas przetwarzania żądania: ${errorResult}`;
			}
		} catch (error) {
			// @ts-ignore
			errorMessage = `Błąd połączenia z API: ${error.message}`;
		} finally {
			isSubmitting = false;
		}
	}

	// @ts-ignore
	function handleFileChange(event) {
		file = event.target.files[0];
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<input type="file" on:change={handleFileChange} />
	<textarea bind:value={text} placeholder="Wpisz tekst lub wybierz plik audio"></textarea>
	<select bind:value={targetLanguage}>
		<option value="en">Angielski</option>
		<option value="pl">Polski</option>
		<!-- Dodaj więcej języków -->
	</select>
	<button type="submit" disabled={isSubmitting}>Przetłumacz</button>
</form>

{#if isSubmitting}
	<p>Przetwarzanie...</p>
{/if}

{#if responseReceived}
	<p>Przetłumaczony tekst: {translatedText}</p>
	{#if downloadUrl}
		<a href={downloadUrl} download="translated_audio.wav">Pobierz plik audio</a>
	{/if}
{:else if errorMessage}
	<p class="error">{errorMessage}</p>
{/if}
