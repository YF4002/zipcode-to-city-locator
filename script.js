document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('zip-form');
	const input = document.getElementById('zip-code');
	const result = document.querySelector('.result');

	function showResult(html) {
		result.innerHTML = html;
		document.getElementById('zip-form').focus();
	}

	function showError(msg) {
		showResult(`<p class="error">${msg}</p>`);
	}

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const zip = input.value.trim();

		showResult('<p>Loading&hellip;</p>');

		// Use HTTPS to avoid mixed-content problems when page is served over HTTPS
		fetch(`https://api.zippopotam.us/us/${zip}`)
			.then((response) => {
				if (!response.ok) {
					if (response.status === 404) throw new Error('ZIP code not found.');
					throw new Error('Network response was not ok.');
				}
				return response.json();
			})
			.then((data) => {
				const place = (data.places && data.places[0]) || null;
				if (!place) {
					showError('No place information returned for this ZIP code.');
					return;
				}

				const html = `
					<h2>Results for ${zip}</h2>
					<p><strong>City:</strong> ${place['place name']}</p>
					<p><strong>State:</strong> ${place['state']} ${place['state abbreviation'] ? `(${place['state abbreviation']})` : ''}</p>
					<p><strong>Latitude:</strong> ${place['latitude']}, <strong>Longitude:</strong> ${place['longitude']}</p>
				`;

				showResult(html);
			})
			.catch((err) => {
				showError(err.message || 'An error occurred while looking up the ZIP code.');
			});
	});
});

