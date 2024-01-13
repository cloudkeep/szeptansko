<script>

	import LanugageTable from '$lib/components/LanguageTable.svelte';
	/**
	 * @type {string | Blob | null}
	 */
	 let file;
	let text = '';
	let targetLanguage = 'en';
	let sourceLanguage = 'auto';
	let translatedText = '';
	let detectedLanguage = '';
	let languagePair = '';
	let ttsModel = '';
	let audioUrl = '';
	let isSubmitting = false;
	let responseMessage = '';
	let errorMessage = '';
	let alertType = '';
	let detectedText = '';

	function clearFile() {
			file = null;
			// @ts-ignore
			document.getElementById('file').value = '';
	}

	function clearText() {
			text = '';
	}

	async function handleSubmit() {
			audioUrl = '';
			const formData = new FormData();
			if (file) {
					formData.append('file', file);
			}
			formData.append('text', text);
			formData.append('target_language', targetLanguage);
			formData.append('source_language', sourceLanguage);

			isSubmitting = true;
			responseMessage = '';
			errorMessage = '';
			alertType = '';

			try {
					const response = await fetch('https://szeptansko.devacat.com/translate/', {
							method: 'POST',
							body: formData
					});

					if (response.ok) {
							const result = await response.json();
							if (result.message) {
									alertType = 'info';
									responseMessage = result.message;
							} else {
									translatedText = result.translated_text;
									detectedText = result.detected_text;
									detectedLanguage = result.detected_language;
									languagePair = result.language_pair;
									ttsModel = result.tts_model;
									audioUrl = `https://szeptansko.devacat.com/download/${result.file_path}`;
									alertType = 'success';
									responseMessage = 'Tłumaczenie zakończone sukcesem';
							}
					} else {
							errorMessage = `Błąd podczas przetwarzania żądania: ${await response.text()}`;
							alertType = 'error';
					}
			} catch (error) {
					// @ts-ignore
					errorMessage = `Błąd połączenia z API: ${error.message}`;
					alertType = 'warning';
			} finally {
					isSubmitting = false;
			}
	}

	// @ts-ignore
	function handleFileChange(event) {
			file = event.target.files[0];
			if (file) {
					text = '';
			}
	}

	$: disableTextInput = file != null;
	$: disableFileInput = text.trim().length > 0;
</script>


<div class="mx-auto max-w-xl px-6 rounded-xl my-5 bg-base-200 py-1">
	<div class="prose select-none p-2">
		<h1 class="font-bold text-3xl flex justify-center items-center">
				<span class="opacity-100">s</span>
				<span class="opacity-90">z</span>
				<span class="opacity-80">e</span>
				<span class="opacity-70">p</span>
				<span class="opacity-60">t</span>
				<span class="opacity-50">a</span>
				<span class="opacity-40">ń</span>
				<span class="opacity-30">s</span>
				<span class="opacity-20">k</span>
				<span class="opacity-10">o</span>
		</h1>
	</div>
<form on:submit|preventDefault={handleSubmit} class="flex flex-col items-start space-y-4 my-4 gap-y-2">
	<div class="flex  items-center">
		<div class="flex-grow flex flex-col">
			<label for="file" class="text-lg">Wybierz plik audio:</label>
			<div class="flex items-center gap-x-2">
			<input type="file" id="file" on:change={handleFileChange} class="file-input file-input-bordered file-input-primary w-full max-w-xs" disabled={disableFileInput} />
			<button type="button" class="btn btn-circle" on:click={clearFile} disabled={!file}>
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
			</button>
			</div>
		</div>

	</div>
	<div class="flex items-center">
			<div class="flex-grow flex flex-col">
					<label for="text" class="text-lg">Wpisz tekst:</label>
					<div class="flex items-center gap-x-2">
					<textarea bind:value={text} id="text" placeholder="Wpisz tekst" class="textarea textarea-bordered" disabled={disableTextInput}></textarea>
					<button type="button" class="btn btn-circle" on:click={clearText} disabled={!text.trim().length}>
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
				</button>
			</div>
			</div>

	</div>
	<div class="flex flex-col">
		<label for="sourceLanguage" class="text-lg">Wybierz język źródłowy:</label>
		<select bind:value={sourceLanguage} id="sourceLanguage" class="select select-bordered">
				<option value="auto">Automatycznie</option>
				<option value="en">Angielski</option>
				<option value="pl">Polski</option>
				<option value="es">Hiszpański</option>
				<option value="de">Niemiecki</option>
				<option value="it">Włoski</option>
				<option value="uk">Ukraiński</option>
				<option value="fr">Francuski</option>
		</select>
	</div>
	<div class="flex flex-col">
			<label for="targetLanguage" class="text-lg">Wybierz język docelowy:</label>
			<select bind:value={targetLanguage} id="targetLanguage" class="select select-bordered">
				<option value="en">Angielski</option>
				<option value="pl">Polski</option>
				<option value="es">Hiszpański</option>
				<option value="de">Niemiecki</option>
				<option value="it">Włoski</option>
				<option value="uk">Ukraiński</option>
				<option value="fr">Francuski</option>
			</select>
	</div>
	<button type="submit" disabled={isSubmitting} class="btn btn-primary">Przetłumacz</button>
</form>

{#if isSubmitting}
    <div class="flex justify-center items-center my-5">
        <span class="loading loading-spinner loading-lg"></span>
    </div>
{/if}

	{#if responseMessage}
			<!-- Customized alerts for each response type -->
			<div role="alert" class={`alert ${alertType === 'info' ? 'alert-info' : ''} ${alertType === 'success' ? 'alert-success' : ''} ${alertType === 'warning' ? 'alert-warning' : ''} ${alertType === 'error' ? 'alert-error' : ''} flex items-center space-x-2`}>
							{#if alertType === 'info'}
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
							{/if}
							{#if alertType === 'success'}
							<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
							{/if}
							{#if alertType === 'warning'}
							<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
							{/if}
							{#if alertType === 'error'}
							<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
							{/if}
					<span>{responseMessage}</span>
			</div>
	{/if}

	{#if errorMessage}
			<div role="alert" class="alert alert-error flex items-center space-x-2">
				<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
					<span>{errorMessage}</span>
			</div>
	{/if}

	{#if audioUrl}
	<div class="flex flex-col w-full py-3">
		Tekst rozpoznany:
		<div class="grid card bg-base-300 rounded-box place-items-center py-1 prose">
			<div><p class="text-lg break-words text-center">{detectedText}</p></div>
				
		</div>
		Tekst przetłumaczony:
			<div class="grid card bg-base-300 rounded-box place-items-center py-1 prose">
				<div><p class="text-lg break-words text-center">{translatedText}</p></div>
					
			</div>
		<div class="divider"></div>

			<div class="grid card bg-base-300 rounded-box place-items-center py-3 gap-y-2">
					<audio controls src={audioUrl}>
							Twoja przeglądarka nie obsługuje elementu audio.
					</audio>
					<a href={audioUrl} download="translated_audio.wav" class="btn btn-secondary">Pobierz plik audio</a>
			</div>

			<div class="divider"></div>

			<div class="grid card bg-base-300 rounded-box place-items-center py-3 gap-y-2">
					<div class="badge badge-accent">{detectedLanguage}</div>
					<div class="badge badge-secondary">{languagePair}</div>
					<div class="badge badge-primary">{ttsModel}</div>
			</div>
	</div>
{/if}
<div class="collapse collapse-arrow bg-base-200">
  <input type="checkbox" /> 
  <div class="collapse-title text-xl font-medium ">
    Dostępne kierunki tłumaczenia
  </div>
  <div class="collapse-content"> 
    <LanugageTable />
  </div>
</div>

</div>



<footer class="footer footer-center p-4 bg-base-300 text-base-content mt-auto">
  <aside>
    <p>Wiktoria Potoniec,<br>
Vladyslav Khmara,<br>
Julia Fedko,<br>
Grzegorz Chwasta.</p>
  </aside>
</footer>