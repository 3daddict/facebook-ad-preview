<script>
	import { onMount, onDestroy } from 'svelte';
	let dataObject = [];
	let adList;
	let api_token;
	let format;
	let postIdGlobal = null;
	let inject;

	async function getPreviews(id, access_token, ad_format) {
		await getPostID(id, access_token);
		await fetch(`https://graph.facebook.com/v6.0/${id}/previews?access_token=${access_token}&ad_format=${ad_format}`, {
			method: 'GET'
		})
		.then(data => data.json())
		.then(async (result) => {
			dataObject.push({
				id: id,
				iframe: result.data[0].body,
				postID: postIdGlobal
			})
			var element = document.createElement('div');
			element.innerHTML = `
				<div class="card-item" style="border: 1px solid #eee; margin: 8px; border-radius: 4px;">
					<div class="iframe-container">
						${result.data[0].body}
					</div>
					<div class="info-group">
						<h3 style="font-size: 14px; margin-left: 10px;">AD ID:<br />${id}</h3>
						<h4 style="font-size: 12px; margin-left: 10px;">Post ID:<br />${postIdGlobal}</h4>
					</div>
				</div>
			`
			inject.appendChild(element);

			return dataObject;
		})
		.catch((err) => {
			console.log('Error getPreviews:', err);
		});
	}

	async function getPostID(id, access_token) {
		let eosId;
		await fetch(`https://graph.facebook.com/v6.0/${id}?fields=creative{effective_object_story_id}&access_token=${access_token}`, {
			method: 'GET'
		})
		.then(data => data.json())
		.then(result => {
			eosId = result.creative.effective_object_story_id
			postIdGlobal = eosId;
			return eosId;
		})
  		.catch(error => console.log('error', error));
	}

	function submit() {
		dataObject = [];
		inject.innerHTML = '';
		// API Call Init and Timeout function
		let AdArray = JSON.parse("[" + adList + "]");
		for (let i = 0; i < AdArray.length; i++) {
			(function (i) {
				setTimeout(function () {
					getPreviews(AdArray[i], api_token, format);
				}, 1000 * i);
			})(i);
		};
		console.log(dataObject);
	}

	onMount(() => {
		inject = document.getElementById('cardContainer');
	})

</script>

<style>
	.header {
		margin: 0 8px;
	}
	.form-container {
		background: #eee;
		padding: 4px 4px;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
	}

	.col {
		flex: 1 0;
		padding: 4px 4px;
	}

	.primary {
		flex-grow: 2;
	}

	.secondary {
		flex-grow: 4;
	}

	.third {
		flex-grow: 1;
	}

	input, select, button {
		width: 100%;
		margin: 0;
		border-radius: 4px;
		height: 32px;
	}

	.card-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-content: flex-start;
	}

	@media (max-width: 600px) {
		.row {
			flex-direction: column;
		}
	}

</style>

<svelte:head>
	<title>Facebook Ad Preview</title>
</svelte:head>

<div class="header">
	<h1>Facebook Ad Preview</h1>
	<p>Enter the form data below to generate Ad Previews from your account</p>
	<p>Use this <a href="https://developers.facebook.com/tools/explorer/" target="_blank">Link</a> to generate a token.</p>
</div>
<div class="form-container">
	<div class="row">		
		<div class="primary col">
			<div class="form-control">
				<div class="input-container">
					<input class="siteHeader__input" type="text" id="token" placeholder="Access Token" bind:value={api_token} />
				</div>
			</div>
		</div>
		<div class="secondary col">
			<div class="form-control">
				<div class="input-container">
					<input type="text" id="adList" placeholder="Comma Separeated AD ID List" bind:value={adList} />
				</div>
			</div>
		</div>
	</div>
	<div class="row">		
		<div class="third col">
			<select bind:value={format} id="cars">
				<option value="DESKTOP_FEED_STANDARD">DESKTOP_FEED_STANDARD</option>
				<option value="INSTAGRAM_STANDARD">INSTAGRAM_STANDARD</option>
				<option value="INSTAGRAM_STORY">INSTAGRAM_STORY</option>
				<option value="MARKETPLACE_MOBILE">MARKETPLACE_MOBILE</option>
				<option value="MOBILE_FEED_BASIC">MOBILE_FEED_BASIC</option>
				<option value="MOBILE_FEED_STANDARD" selected="selected">MOBILE_FEED_STANDARD</option>
				<option value="MOBILE_INTERSTITIAL">MOBILE_INTERSTITIAL</option>
				<option value="MOBILE_MEDIUM_RECTANGLE">MOBILE_MEDIUM_RECTANGLE</option>
				<option value="MOBILE_NATIVE">MOBILE_NATIVE</option>
				<option value="RIGHT_COLUMN_STANDARD">RIGHT_COLUMN_STANDARD</option>
				<option value="WATCH_FEED_MOBILE">WATCH_FEED_MOBILE</option>
			</select>
		</div>
		<div class="forth col">
			<button class="btn" type="submit" on:click={submit}>Run</button>
		</div>
	</div>
</div>
<div class="card-container" id="cardContainer"></div>
