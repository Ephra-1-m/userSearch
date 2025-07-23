async function search() {
  const name = document.getElementById('nameInput').value.trim();
  if (!name) {
    alert('Please enter a name');
    console.log("yes")
    return;
  }

  // Open social platforms FIRST (before await)
  const encodedName = encodeURIComponent(name);
  const urls = [
    `https://www.facebook.com/search/top?q=${encodedName}`,
    `https://www.instagram.com/${encodedName}`,
    `https://www.tiktok.com/search?q=${encodedName}`,
    `https://www.snapchat.com/add/${encodedName}`,
    `https://twitter.com/search?q=${encodedName}`,
    `https://www.google.com/search?q=site:tinder.com "${encodedName}"`,
    `https://www.google.com/search?q=site:bumble.com "${encodedName}"`
  ];

  // Open tabs immediately while still in click event context
  urls.forEach(url => window.open(url, '_blank'));

  // Now run the API call after opening tabs
  try {
    const response = await fetch(`http://localhost:3000/search?name=${encodedName}`);
    const data = await response.json();

    console.log('Search API response:', data);

    if (data.error) {
      alert('Error: ' + data.error);
      return;
    }
     console.log('Results array:', data.results);

    displayResults(data.results);
  } catch (err) {
    alert('Failed to fetch search results');
    console.error(err);
  }
}
